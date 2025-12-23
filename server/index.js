import cors from "cors";
import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { GameManager } from "./classes/GameManger.js";

const PORT = process.env.PORT || 5000;
const ORIGIN = (
  process.env.ORIGIN || "http://localhost:3000,http://localhost:5000"
).split(",");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: ORIGIN, methods: ["GET", "POST"] },
});

app.use(express.json());
app.use(cors({ origin: ORIGIN }));

app.get("/health", (_, res) => res.send("OK"));

const gameManager = new GameManager(io);

function getOnlinePlayersCount() {
  let onlineCount = 0;
  for (const socket of io.sockets.sockets.values()) {
    // Count only players not in a game room
    if (!socket.data.roomId) {
      onlineCount++;
    }
  }
  return onlineCount;
}

function broadcastOnlinePlayersCount() {
  const onlineCount = getOnlinePlayersCount();
  console.log(`Broadcasting online players: ${onlineCount}`);
  io.emit("online-players-count", { count: onlineCount });
}

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  broadcastOnlinePlayersCount();

  // Also send the count immediately to the newly connected socket
  socket.emit("online-players-count", { count: getOnlinePlayersCount() });

  socket.on("matchmaking", (boardSize) => {
    gameManager.handleMatchmaking(socket, boardSize);
    broadcastOnlinePlayersCount();
  });

  socket.on("cancel-matchmaking", () => {
    gameManager.handleCancelMatchmaking(socket);
    broadcastOnlinePlayersCount();
  });

  socket.on("move", ({ row, col }) => {
    gameManager.handleMove(socket, { row, col });
  });

  socket.on("ability", ({ ability, row, col, row2, col2, action }) => {
    gameManager.handleAbility(socket, {
      ability,
      row,
      col,
      row2,
      col2,
      action,
    });
  });

  socket.on("select-power-up", ({ ability }) => {
    gameManager.handleSelectAbility(socket, { ability });
  });

  socket.on("time-up", () => {
    const roomId = socket.data.roomId;
    gameManager.handleTimeUp(roomId);
  });

  socket.on("square-hover", ({ row, col, power }) => {
    const roomId = socket.data.roomId;
    io.to(roomId).emit("square-hover", { row, col, power });
  });

  socket.on("requestRematch", ({ playerWhoRequested }) => {
    gameManager.handleRequestRematch(socket, playerWhoRequested);
  });

  socket.on("rematch-accepted", () => {
    gameManager.handleRematchAccepted(socket);
  });

  socket.on("rematch-rejected", () => {
    gameManager.handleRematchRejected(socket);
  });

  socket.on("get-online-players", () => {
    const count = getOnlinePlayersCount();
    console.log(`Sending online players count: ${count}`);
    socket.emit("online-players-count", { count });
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
    gameManager.handlePlayerDisconnect(socket.id);
    broadcastOnlinePlayersCount();
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
