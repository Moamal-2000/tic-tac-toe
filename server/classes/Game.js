import {
  FIRST_PLAYER,
  SECOND_IN_MS,
  SYMBOL_O,
  SYMBOL_X,
  TURN_TIMER_DURATION,
} from "../data/constants.js";
import { Board } from "./Board.js";
import { Player } from "./Player.js";

export class Game {
  constructor(id, socketO, socketX, boardSize, io) {
    this.id = id;
    this.io = io;
    this.board = new Board(boardSize);
    this.players = {
      [SYMBOL_O]: new Player(socketO.id, SYMBOL_O, boardSize),
      [SYMBOL_X]: new Player(socketX.id, SYMBOL_X, boardSize),
    };
    this.turn = FIRST_PLAYER;
    this.winner = null;
    this.draw = false;
    this.hasGameStarted = false;
    this.isWinnerPopupVisible = false;
    this.timeRemaining = TURN_TIMER_DURATION;
    this.timerActive = false;
    this.timerInterval = null;
    this.powerUpsState = {
      selectedPower: null,
      whoUsingPower: null,
    };
  }

  selectAbility(playerSymbol, ability) {
    // Only the current turn player can select
    if (this.turn !== playerSymbol) return false;

    const player = this.players[playerSymbol];
    if (!player.abilities[ability]) return false;

    // Check if ability is on cooldown
    if (player.abilities[ability].cooldown > 0) return false;

    // Toggle: if same ability selected, unselect
    if (
      this.powerUpsState.selectedPower === ability &&
      this.powerUpsState.whoUsingPower === playerSymbol
    ) {
      // If unselecting swap, clear any swapSelected flags on the board
      if (ability === "swap") {
        this.clearSwapSelection();
      }

      this.powerUpsState.selectedPower = null;
      this.powerUpsState.whoUsingPower = null;
      return true;
    }

    const opponentSymbol = this.getOpponentSymbol();

    // Validate freeze: needs opponent symbol on board
    if (ability === "freeze") {
      if (!this.board.hasOpponentSymbol(opponentSymbol)) {
        return false;
      }
    }

    // Validate swap: needs at least 2 symbols on board
    if (ability === "swap") {
      if (this.board.getPlacedSymbolCount() < 2) {
        return false;
      }
    }

    // Select the ability
    this.powerUpsState.selectedPower = ability;
    this.powerUpsState.whoUsingPower = playerSymbol;
    return true;
  }

  getCurrentPlayer() {
    return this.players[this.turn];
  }

  getOpponentSymbol() {
    return this.turn === SYMBOL_X ? SYMBOL_O : SYMBOL_X;
  }

  startTimer(callback) {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timeRemaining = TURN_TIMER_DURATION;
    this.timerActive = true;
    this.timerCallback = callback;
    this.broadcastTimerUpdate();

    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      this.broadcastTimerUpdate();

      if (this.timeRemaining <= 0) {
        this.stopTimer();
        if (this.timerCallback) this.timerCallback();
      }
    }, SECOND_IN_MS);
  }

  broadcastTimerUpdate() {
    this.io.to(this.id).emit("timer-update", {
      timeRemaining: this.timeRemaining,
      timerActive: this.timerActive,
    });
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.timerActive = false;
    this.broadcastTimerUpdate();
  }

  resetTimer() {
    this.stopTimer();
    this.timeRemaining = TURN_TIMER_DURATION;
    this.timerActive = false;
  }

  // Ensure timer is running without resetting the time
  ensureTimerRunning() {
    if (!this.timerInterval && this.timerActive && this.timerCallback) {
      this.timerInterval = setInterval(() => {
        this.timeRemaining--;

        if (this.timeRemaining <= 0) {
          this.stopTimer();
          if (this.timerCallback) this.timerCallback();
        }
      }, SECOND_IN_MS);
    }
  }

  getOpponentSymbol() {
    return this.turn === SYMBOL_X ? SYMBOL_O : SYMBOL_X;
  }

  applyMove(row, col) {
    if (!this.board.isCellFree(row, col)) return false;

    const opponent = this.getOpponentSymbol();

    // Fill square with player's symbol
    this.board.setCell(row, col, this.turn);

    // Decrease players power-ups cooldown
    this.players[this.turn].decrementCooldowns();
    this.players[opponent].decrementCooldowns();

    const winner = this.checkWin(row, col);

    if (winner) {
      this.winner = winner;
      return true;
    }

    // Clear power-up selection when turn changes
    this.powerUpsState.selectedPower = null;
    this.powerUpsState.whoUsingPower = null;

    this.turn = this.getOpponentSymbol();
    return true;
  }

  useAbility(ability, row, col, row2, col2, action) {
    const player = this.getCurrentPlayer();
    const cell = this.board.getCell(row, col);
    const opponent = this.getOpponentSymbol();

    // Handle swap selection/unselection before checking ability use
    if (ability === "swap" && action) {
      if (action === "select") {
        // Mark cell as selected for swap
        if (!cell.owner) {
          return false; // Can't select empty cells
        }
        cell.swapSelected = true;
        return true;
      } else if (action === "unselect") {
        // Unmark cell as selected
        cell.swapSelected = false;
        return true;
      }
    }

    if (!player.abilities[ability] || !player.abilities[ability].use())
      return false;

    // Validate freeze: can only be placed on opponent symbols, not frozen already
    if (ability === "freeze") {
      // Must have opponent symbol, cannot be empty, cannot be own symbol, cannot be frozen
      if (!cell.owner || cell.owner === this.turn || cell.frozen) {
        player.abilities[ability].cooldown = 0; // Reset cooldown since validation failed
        return false;
      }
      cell.frozen = true;
    } else if (ability === "bomb") {
      // Mark cells for bomb effect (3x3 area centered at row, col)
      this.triggerBombEffect(row, col);

      // Return "bomb-processing" to indicate bomb needs delay before deletion
      return "bomb-processing";
    } else if (ability === "swap") {
      // Validate both cells have symbols
      if (!cell.owner || !this.board.getCell(row2, col2).owner) {
        player.abilities[ability].cooldown = 0; // Reset cooldown since validation failed
        return false;
      }

      cell.swapSelected = true;
      this.board.getCell(row2, col2).swapSelected = true;

      // Return true to indicate ability is being processed
      return "swap-processing";
    }

    const winner = this.checkWin();
    if (winner) this.winner = winner;

    // Clear power-up selection after use
    this.powerUpsState.selectedPower = null;
    this.powerUpsState.whoUsingPower = null;

    // Change turn and decrement cooldowns
    this.players[this.turn].decrementCooldowns();
    this.players[opponent].decrementCooldowns();
    this.turn = opponent;

    return true;
  }

  performSwap(row, col, row2, col2) {
    const cell = this.board.getCell(row, col);
    const cell2 = this.board.getCell(row2, col2);

    // Perform the swap
    const cellOwner = cell.owner;
    cell.owner = cell2.owner;
    cell2.owner = cellOwner;

    // Clear swap selection markers
    cell.swapSelected = false;
    cell2.swapSelected = false;

    // Check if both players won (treat as draw)
    if (this.checkBothPlayersWon()) {
      this.isWinnerPopupVisible = true;
      this.draw = true;
      // Both won = draw, don't set a single winner
      this.winner = null;
    } else {
      const winner = this.checkWin();
      if (winner) this.winner = winner;
    }

    // Clear power-up selection and change turn
    this.powerUpsState.selectedPower = null;
    this.powerUpsState.whoUsingPower = null;

    const opponent = this.getOpponentSymbol();
    this.players[this.turn].decrementCooldowns();
    this.players[opponent].decrementCooldowns();
    this.turn = opponent;

    return true;
  }

  triggerBombEffect(row, col, radius = 1) {
    const boardSize = this.board.size;

    // Mark all cells in 3x3 area with isBombed flag
    for (let dimensionX = -radius; dimensionX <= radius; dimensionX++) {
      for (let dimensionY = -radius; dimensionY <= radius; dimensionY++) {
        const newRow = row + dimensionX;
        const newCol = col + dimensionY;

        const isOutOfBounds =
          newRow < 0 ||
          newCol < 0 ||
          newRow >= boardSize ||
          newCol >= boardSize;

        if (isOutOfBounds) continue;

        const targetedCell = this.board.getCell(newRow, newCol);
        targetedCell.bombed = true;
      }
    }
  }

  deleteBombEffect(row, col, radius = 1) {
    const boardSize = this.board.size;

    // Clear symbols in 3x3 area and handle frozen squares
    for (let dimensionX = -radius; dimensionX <= radius; dimensionX++) {
      for (let dimensionY = -radius; dimensionY <= radius; dimensionY++) {
        const newRow = row + dimensionX;
        const newCol = col + dimensionY;

        const isOutOfBounds =
          newRow < 0 ||
          newCol < 0 ||
          newRow >= boardSize ||
          newCol >= boardSize;

        if (isOutOfBounds) continue;

        const targetedCell = this.board.getCell(newRow, newCol);

        if (targetedCell.frozen) {
          // Remove freeze effect but keep the symbol
          targetedCell.frozen = false;
        } else {
          // Clear the symbol
          targetedCell.owner = null;
        }

        // Clear the bombed flag
        targetedCell.bombed = false;
      }
    }
  }

  clearSwapSelection() {
    const boardSize = this.board.size;
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        const cell = this.board.getCell(row, col);
        if (cell.swapSelected) cell.swapSelected = false;
      }
    }
  }

  checkWin(row, col) {
    const size = this.board.size;
    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];

    for (const symbol of [SYMBOL_X, SYMBOL_O]) {
      if (row !== undefined && col !== undefined) {
        const cell = this.board.getCell(row, col);
        if (cell.owner === symbol && !cell.frozen) {
          for (const [dr, dc] of directions) {
            if (this.countAligned(row, col, dr, dc, symbol) >= size) {
              this.isWinnerPopupVisible = true;
              return symbol;
            }
          }
        }
      } else {
        for (let r = 0; r < size; r++) {
          for (let c = 0; c < size; c++) {
            const cell = this.board.getCell(r, c);
            if (cell.owner === symbol && !cell.frozen) {
              for (const [dr, dc] of directions) {
                if (this.countAligned(r, c, dr, dc, symbol) >= size) {
                  this.isWinnerPopupVisible = true;
                  return symbol;
                }
              }
            }
          }
        }
      }
    }

    return false;
  }

  // Check if both players have won (used for swap power-up)
  checkBothPlayersWon() {
    const size = this.board.size;
    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];

    const winners = new Set();

    for (const symbol of [SYMBOL_X, SYMBOL_O]) {
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          const cell = this.board.getCell(r, c);
          if (cell.owner === symbol && !cell.frozen) {
            for (const [dr, dc] of directions) {
              if (this.countAligned(r, c, dr, dc, symbol) >= size) {
                winners.add(symbol);
                break;
              }
            }
          }
        }

        if (winners.has(symbol)) break;
      }
    }

    return winners.size === 2;
  }

  checkDraw() {
    const hasFreeCell = this.board.hasFreeCell();
    if (!hasFreeCell) this.isWinnerPopupVisible = true;
    return !hasFreeCell;
  }

  countAligned(row, col, dr, dc, symbol) {
    let count = 1;

    for (const dir of [-1, 1]) {
      let r = row + dr * dir;
      let c = col + dc * dir;

      while (
        this.inBounds(r, c) &&
        this.board.getCell(r, c).owner === symbol &&
        !this.board.getCell(r, c).frozen
      ) {
        count++;
        r += dr * dir;
        c += dc * dir;
      }
    }

    return count;
  }

  inBounds(row, col) {
    const boardSize = this.board.size;
    return row >= 0 && col >= 0 && row < boardSize && col < boardSize;
  }

  getState() {
    return {
      board: this.board.grid.map((row) =>
        row.map((cell) => ({
          owner: cell.owner,
          isFrozen: cell.frozen,
          isBombed: cell.bombed,
          swapSelected: cell.swapSelected,
        }))
      ),
      abilities: {
        [SYMBOL_O]: this.players[SYMBOL_O].getAbilitiesState(
          this.board,
          SYMBOL_X
        ),
        [SYMBOL_X]: this.players[SYMBOL_X].getAbilitiesState(
          this.board,
          SYMBOL_O
        ),
      },
      powerUps: {
        player1: this.players[SYMBOL_O].getAbilitiesState(this.board, SYMBOL_X),
        player2: this.players[SYMBOL_X].getAbilitiesState(this.board, SYMBOL_O),
        selectedPower: this.powerUpsState.selectedPower,
        whoUsingPower:
          this.powerUpsState.whoUsingPower === SYMBOL_O
            ? "player1"
            : this.powerUpsState.whoUsingPower === SYMBOL_X
            ? "player2"
            : null,
        hasActivePowerUp: false,
      },
      turn: this.turn,
      winner: this.winner,
      draw: this.draw || this.checkDraw(),
      hasGameStarted: this.hasGameStarted,
      isWinnerPopupVisible: this.isWinnerPopupVisible,
      timeRemaining: this.timeRemaining,
      timerActive: this.timerActive,
    };
  }

  reset() {
    this.board = new Board(this.board.size);
    this.turn = SYMBOL_X;
    this.winner = null;
    this.draw = false;
    this.hasGameStarted = true;
    this.isWinnerPopupVisible = false;
    this.timeRemaining = TURN_TIMER_DURATION;
    this.timerActive = false;
    this.powerUpsState = { selectedPower: null, whoUsingPower: null };

    // Reset all player cooldowns
    Object.values(this.players).forEach((player) => {
      Object.values(player.abilities).forEach((ability) => {
        ability.cooldown = 0;
      });
    });
  }
}
