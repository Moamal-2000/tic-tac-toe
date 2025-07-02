import { create } from "zustand";

export const useMultiplayerStore = create((set, get) => ({
  boardSize: null,
  playerTurn: null,

  getGameStates: ({ boardSize, playerTurn }) => {
    set({ boardSize, playerTurn });
  },
}));
