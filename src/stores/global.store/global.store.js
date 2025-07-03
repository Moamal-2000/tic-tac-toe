import { create } from "zustand";

export const useGlobalStore = create((set, get) => ({
  isAboutModelActive: false,
  isMainMenuActive: true,
  gameMode: null, // "singleplayer" | "multiplayer"
  isWaitingForOpponent: false,

  toggleAboutModel: (value) => {
    set({ isAboutModelActive: value ? value : !get().isAboutModelActive });
  },
  updateGameMode: (gameMode) => {
    set({ gameMode, isMainMenuActive: gameMode !== "singleplayer" });
  },
  updateGlobalState: (state) => set(state),
}));
