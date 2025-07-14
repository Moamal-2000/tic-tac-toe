import { socket } from "@/socket/socket";

export function debugging(globalStore) {
  const { updateGameMode, updateGlobalState } = globalStore;

  updateGameMode("online");
  socket.emit("matchmaking", 3);
  updateGlobalState({ isWaitingForOpponent: false });
}
