// index.js
import cors from "cors";
import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { GameManager } from "./classes/GameManger.js";

const PORT = process.env.PORT || 4000;
const ORIGIN = (
  process.env.ORIGIN || "http://localhost:3000,http://localhost:4000"
).split(",");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ORIGIN,
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors({ origin: ORIGIN }));

app.get("/health", (_, res) => res.send("OK"));

const gameManager = new GameManager(io);

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("matchmaking", (boardSize) => {
    gameManager.handleMatchmaking(socket, boardSize);
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

  socket.on("requestRematch", ({ playerWhoRequested }) => {
    gameManager.handleRequestRematch(socket, playerWhoRequested);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);

    // remove if in matchmaking queue
    // if in game the other player wins and remove the game for rooms map(for now)
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
