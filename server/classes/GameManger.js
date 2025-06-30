import { Game } from "./Game.js";

export class GameManager {
  constructor(io) {
    this.io = io;
    this.rooms = new Map(); // roomId -> Game
    this.matchmakingQueue = new Map(); // boardSize -> Socket[]
  }

  createRoom(socketA, socketB, boardSize) {
    const roomId = this.generateRoomId();
    const game = new Game(roomId, socketA, socketB, boardSize);
    this.rooms.set(roomId, game);

    socketA.join(roomId);
    socketB.join(roomId);

    socketA.data.roomId = roomId;
    socketB.data.roomId = roomId;

    this.syncRoom(roomId);
  }

  handleMove(socket, { row, col }) {
    const roomId = socket.data.roomId;
    if (!roomId || !this.rooms.has(roomId)) return;

    const game = this.rooms.get(roomId);
    const playerSymbol = game.players.A.id === socket.id ? "A" : "B";

    if (game.turn !== playerSymbol) return;

    const moveSuccess = game.applyMove(row, col);
    if (moveSuccess) this.syncRoom(roomId);
  }

  handleAbility(socket, { ability, row, col }) {
    const roomId = socket.data.roomId;
    if (!roomId || !this.rooms.has(roomId)) return;

    const game = this.rooms.get(roomId);
    const playerSymbol = game.players.A.id === socket.id ? "A" : "B";

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

  syncRoom(roomId) {
    const game = this.rooms.get(roomId);
    if (!game) return;

    const state = game.getState();
    const sockets = [game.players.A.id, game.players.B.id];
    for (const socketId of sockets) {
      this.io.to(socketId).emit("room-update", state);
    }
  }

  generateRoomId() {
    return Math.random().toString(36).substring(2, 10);
  }
}
