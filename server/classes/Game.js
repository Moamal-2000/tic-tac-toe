import { SYMBOL_O, SYMBOL_X } from "../data/constants.js";
import { Board } from "./Board.js";
import { Player } from "./Player.js";

export class Game {
  constructor(id, socketO, socketX, boardSize) {
    this.id = id;
    this.board = new Board(boardSize);
    this.players = {
      [SYMBOL_O]: new Player(socketO.id, SYMBOL_O),
      [SYMBOL_X]: new Player(socketX.id, SYMBOL_X),
    };
    this.turn = SYMBOL_X;
    this.winner = null;
    this.moveCount = 0;
    this.hasGameStarted = false;
  }

  getCurrentPlayer() {
    return this.players[this.turn];
  }

  getOpponentSymbol() {
    return this.turn === SYMBOL_X ? SYMBOL_O : SYMBOL_X;
  }

  applyMove(row, col) {
    if (!this.board.isCellFree(row, col)) return false;
    this.board.setCell(row, col, this.turn);
    this.players[this.turn].decrementCooldowns();
    this.moveCount++;
    if (this.checkWin(row, col)) {
      this.winner = this.turn;
    } else {
      this.turn = this.getOpponentSymbol();
    }
    return true;
  }

  useAbility(ability, row, col, row2, col2) {
    const player = this.getCurrentPlayer();
    const cell = this.board.getCell(row, col);

    if (!player.abilities[ability] || !player.abilities[ability].use()) {
      return false;
    }

    switch (ability) {
      case "freeze":
        cell.frozen = true;
        break;
      case "bomb":
        if (cell.owner) cell.owner = null;
        break;
      case "swap":
        const cell2 = this.board.getCell(row2, col2);
        const cellOwner = cell.owner;
        cell.owner = cell2.owner;
        cell2.owner = cellOwner;
        break;
    }

    return true;
  }

  checkWin(row, col) {
    const symbol = this.turn;
    const size = this.board.size;

    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];

    for (const [dr, dc] of directions) {
      if (this.countAligned(row, col, dr, dc, symbol) >= size) {
        return true;
      }
    }

    return false;
  }

  countAligned(row, col, dr, dc, symbol) {
    let count = 1;

    for (const dir of [-1, 1]) {
      let r = row + dr * dir;
      let c = col + dc * dir;

      while (this.inBounds(r, c) && this.board.getCell(r, c).owner === symbol) {
        count++;
        r += dr * dir;
        c += dc * dir;
      }
    }

    return count;
  }

  inBounds(row, col) {
    const n = this.board.size;
    return row >= 0 && col >= 0 && row < n && col < n;
  }

  getState() {
    return {
      board: this.board.grid.map((row) =>
        row.map((cell) => ({
          owner: cell.owner,
          frozen: cell.frozen,
        }))
      ),
      abilities: {
        [SYMBOL_O]: this.players[SYMBOL_O].getAbilitiesState(),
        [SYMBOL_X]: this.players[SYMBOL_X].getAbilitiesState(),
      },
      turn: this.turn,
      winner: this.winner,
      hasGameStarted: this.hasGameStarted,
    };
  }
}
