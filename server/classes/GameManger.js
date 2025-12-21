import { SYMBOL_O, SYMBOL_X } from "../data/constants.js";
import { Game } from "./Game.js";

export class GameManager {
  constructor(io) {
    this.io = io;
    this.rooms = new Map(); // roomId -> Game
    this.matchmakingQueue = new Map(); // boardSize -> Socket[]
  }

  createRoom(socketO, socketX, boardSize) {
    const roomId = this.generateRoomId();
    const game = new Game(roomId, socketO, socketX, boardSize);
    this.rooms.set(roomId, game);

    socketO.join(roomId);
    socketX.join(roomId);

    socketO.data.roomId = roomId;
    socketX.data.roomId = roomId;

    game.hasGameStarted = true;

    // Start the timer for the first player
    game.startTimer(() => {
      this.handleTimeUp(roomId);
    });

    this.syncRoom(roomId);
  }

  handleMove(socket, { row, col }) {
    const roomId = socket.data.roomId;
    if (!roomId || !this.rooms.has(roomId)) return;

    const game = this.rooms.get(roomId);
    const playerSymbol =
      game.players[SYMBOL_O].id === socket.id ? SYMBOL_O : SYMBOL_X;

    if (game.turn !== playerSymbol) return;

    const moveSuccess = game.applyMove(row, col);
    if (!moveSuccess) return;

    // Reset timer for the next player's turn
    game.resetTimer();
    game.startTimer(() => {
      this.handleTimeUp(roomId);
    });

    // First, sync the state that contains the move (and possibly the result)
    this.syncRoom(roomId);

    // If the game has ended (win or draw), automatically start a new round
    const hasEnded = game.winner || game.checkDraw();
    if (hasEnded) {
      game.stopTimer();
      setTimeout(() => {
        // Make sure the room still exists
        if (!this.rooms.has(roomId)) return;

        const g = this.rooms.get(roomId);
        g.reset();
        this.syncRoom(roomId);
      }, 1500);
    }
  }

  handleAbility(socket, { ability, row, col, row2, col2, action }) {
    const roomId = socket.data.roomId;
    if (!roomId || !this.rooms.has(roomId)) return;

    const game = this.rooms.get(roomId);
    const playerSymbol =
      game.players[SYMBOL_O].id === socket.id ? SYMBOL_O : SYMBOL_X;

    if (game.turn !== playerSymbol) return;

    const abilitySuccess = game.useAbility(
      ability,
      row,
      col,
      row2,
      col2,
      action
    );
    if (!abilitySuccess) return;

    // For swap, sync intermediate states (first square selection) without affecting timer
    if (ability === "swap" && row2 === undefined) {
      this.syncRoom(roomId);
      return;
    }

    // Handle bomb with timeout for animation
    if (ability === "bomb" && abilitySuccess === "bomb-processing") {
      // Sync immediately to show bomb effect on all clients
      this.syncRoom(roomId);

      setTimeout(() => {
        if (!this.rooms.has(roomId)) return;

        const g = this.rooms.get(roomId);
        const opponent = g.getOpponentSymbol();

        g.deleteBombEffect(row, col);

        // Change turn and decrement cooldowns
        g.players[g.turn].decrementCooldowns();
        g.players[opponent].decrementCooldowns();

        g.powerUpsState.selectedPower = null;
        g.powerUpsState.whoUsingPower = null;
        g.turn = opponent;

        // Check if both players won (treat as draw)
        if (g.checkBothPlayersWon()) {
          g.isWinnerPopupVisible = true;
          g.draw = true;
          g.winner = null;
        } else {
          const winner = g.checkWin();
          if (winner) {
            g.winner = winner;
          }
        }

        this.syncRoom(roomId);

        const hasEnded = g.winner || g.draw || g.checkDraw();
        if (hasEnded) {
          g.stopTimer();
          setTimeout(() => {
            if (!this.rooms.has(roomId)) return;

            const gr = this.rooms.get(roomId);
            gr.reset();
            this.syncRoom(roomId);
          }, 1500);
        } else {
          // Start timer for the new turn
          g.resetTimer();
          g.startTimer(() => {
            this.handleTimeUp(roomId);
          });
          this.syncRoom(roomId);
        }
      }, 500); // Animation duration for bomb
      return;
    }

    // Handle swap with timeout for animation
    if (ability === "swap" && row2 !== undefined && col2 !== undefined) {
      // Sync immediately to show both squares selected before animation
      this.syncRoom(roomId);

      setTimeout(() => {
        if (!this.rooms.has(roomId)) return;

        const g = this.rooms.get(roomId);
        g.performSwap(row, col, row2, col2);

        this.syncRoom(roomId);

        // Check if both players won (treat as draw)
        const bothWon = g.checkBothPlayersWon();
        const hasEnded = bothWon || g.winner || g.checkDraw();

        if (hasEnded) {
          g.stopTimer();
          setTimeout(() => {
            if (!this.rooms.has(roomId)) return;

            const gr = this.rooms.get(roomId);
            gr.reset();
            this.syncRoom(roomId);
          }, 1500);
        } else {
          // Start timer for the new turn
          g.resetTimer();
          g.startTimer(() => {
            this.handleTimeUp(roomId);
          });
          this.syncRoom(roomId);
        }
      }, 900); // Match the animation duration
      return;
    }

    const hasEnded = game.winner || game.checkDraw();
    if (hasEnded) {
      game.stopTimer();
      setTimeout(() => {
        if (!this.rooms.has(roomId)) return;

        const g = this.rooms.get(roomId);
        g.reset();
        this.syncRoom(roomId);
      }, 1500);
    } else {
      // Start timer for the next player (only after turn changes)
      game.resetTimer();
      game.startTimer(() => {
        this.handleTimeUp(roomId);
      });
      this.syncRoom(roomId);
    }
  }

  handleTimeUp(roomId) {
    if (!this.rooms.has(roomId)) return;

    const game = this.rooms.get(roomId);
    const opponent = game.turn === SYMBOL_X ? SYMBOL_O : SYMBOL_X;

    // Skip the current player's turn
    game.players[game.turn].decrementCooldowns();
    game.players[opponent].decrementCooldowns();

    // Clear power-up selection when turn changes
    game.powerUpsState.selectedPower = null;
    game.powerUpsState.whoUsingPower = null;

    // Switch turn to opponent
    game.turn = opponent;

    // Check if game has ended (draw)
    const hasEnded = game.checkDraw();
    if (hasEnded) {
      game.stopTimer();
      setTimeout(() => {
        if (!this.rooms.has(roomId)) return;

        const g = this.rooms.get(roomId);
        g.reset();
        this.syncRoom(roomId);
      }, 1500);
    } else {
      // Start timer for the opponent
      game.resetTimer();
      game.startTimer(() => {
        this.handleTimeUp(roomId);
      });
      this.syncRoom(roomId);
    }
  }

  handleSelectAbility(socket, { ability }) {
    const roomId = socket.data.roomId;
    if (!roomId || !this.rooms.has(roomId)) return;

    const game = this.rooms.get(roomId);
    const playerSymbol =
      game.players[SYMBOL_O].id === socket.id ? SYMBOL_O : SYMBOL_X;

    console.log(`Player ${playerSymbol} selecting ability: ${ability}`);
    const changed = game.selectAbility(playerSymbol, ability);
    console.log(`Selection changed: ${changed}, state:`, game.powerUpsState);

    if (changed) {
      // Ensure timer is still running without resetting the time
      game.ensureTimerRunning();
      // Sync the selection state without resetting the timer
      this.syncRoom(roomId);
    }
  }

  handleMatchmaking(socket, boardSize) {
    if (!this.matchmakingQueue.has(boardSize)) {
      this.matchmakingQueue.set(boardSize, []);
    }

    const queue = this.matchmakingQueue.get(boardSize);

    // Check if the socket is already in the queue to prevent matching with itself
    const existingSocketIndex = queue.findIndex((s) => s.id === socket.id);
    if (existingSocketIndex !== -1) {
      // Remove the existing socket and create a new matchmaking request
      queue.splice(existingSocketIndex, 1);
    }

    if (queue.length > 0) {
      const waitingSocket = queue.shift();
      this.createRoom(waitingSocket, socket, boardSize);
    } else {
      queue.push(socket);
    }
  }

  handleCancelMatchmaking(socket) {
    // Remove socket from all matchmaking queues
    for (const queue of this.matchmakingQueue.values()) {
      const index = queue.findIndex((s) => s.id === socket.id);
      if (index !== -1) {
        queue.splice(index, 1);
        console.log(`Socket ${socket.id} removed from matchmaking queue`);
        return;
      }
    }
  }

  handleRequestRematch(socket) {
    const roomId = socket.data.roomId;
    if (!roomId || !this.rooms.has(roomId)) return;

    const game = this.rooms.get(roomId);

    // TODO: Check if rematch is allowed

    // TODO: Send rematch request to other player

    // TODO: Reset game state for both players

    this.syncRoom(roomId);
  }

  syncRoom(roomId) {
    const game = this.rooms.get(roomId);
    if (!game) return;

    const state = game.getState();
    // Send to Player O
    if (game.players[SYMBOL_O]) {
      const socketId = game.players[SYMBOL_O].id;
      this.io.to(socketId).emit("room-update", { ...state, me: SYMBOL_O });
    }

    // Send to Player X
    if (game.players[SYMBOL_X]) {
      const socketId = game.players[SYMBOL_X].id;
      this.io.to(socketId).emit("room-update", { ...state, me: SYMBOL_X });
    }
  }

  handlePlayerDisconnect(socketId) {
    // Check if player is in matchmaking queue
    for (const queue of this.matchmakingQueue.values()) {
      const index = queue.findIndex((socket) => socket.id === socketId);
      if (index !== -1) {
        queue.splice(index, 1);
        return;
      }
    }

    // Check if player is in an active game
    for (const [roomId, game] of this.rooms) {
      const disconnectedPlayer =
        game.players[SYMBOL_O]?.id === socketId
          ? SYMBOL_O
          : game.players[SYMBOL_X]?.id === socketId
          ? SYMBOL_X
          : null;

      if (disconnectedPlayer) {
        const opponent = disconnectedPlayer === SYMBOL_O ? SYMBOL_X : SYMBOL_O;
        const opponentSocketId = game.players[opponent]?.id;

        // Notify opponent of disconnection
        if (opponentSocketId) {
          this.io.to(opponentSocketId).emit("opponent-disconnected");
        }

        // Stop timer and remove room
        game.stopTimer();
        this.rooms.delete(roomId);
        break;
      }
    }
  }

  generateRoomId() {
    return Math.random().toString(36).substring(2, 10);
  }
}
