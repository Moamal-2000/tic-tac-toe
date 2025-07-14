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
    if (moveSuccess) this.syncRoom(roomId);
  }

  handleAbility(socket, { ability, row, col }) {
    const roomId = socket.data.roomId;
    if (!roomId || !this.rooms.has(roomId)) return;

    const game = this.rooms.get(roomId);
    const playerSymbol =
      game.players[SYMBOL_O].id === socket.id ? SYMBOL_O : SYMBOL_X;

    if (game.turn !== playerSymbol) return;

    const abilitySuccess = game.useAbility(ability, row, col);
    if (abilitySuccess) this.syncRoom(roomId);
  }

  handleMatchmaking(socket, boardSize) {
    if (!this.matchmakingQueue.has(boardSize)) {
      this.matchmakingQueue.set(boardSize, []);
    }

    const queue = this.matchmakingQueue.get(boardSize);

    if (queue.length > 0) {
      const waitingSocket = queue.shift();
      this.createRoom(waitingSocket, socket, boardSize);
    } else {
      queue.push(socket);
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
    const sockets = [game.players[SYMBOL_O].id, game.players[SYMBOL_X].id];

    for (const socketId of sockets) {
      this.io.to(socketId).emit("room-update", state);
    }
  }

  generateRoomId() {
    return Math.random().toString(36).substring(2, 10);
  }
}
