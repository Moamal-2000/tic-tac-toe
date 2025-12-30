import { create } from "zustand";

export const useGlobalStore = create((set, get) => ({
  isAboutModelActive: false,
  menuActive: true,
  gameMode: null, // "local" | "computer" | "online"
  aiDifficulty: "medium", // "easy" | "medium" | "hard"
  waitingOpponent: false,

  toggleAboutModel: (value) => {
    set({ isAboutModelActive: value ? value : !get().isAboutModelActive });
  },
  updateGameMode: (gameMode) => {
    const shouldShowMenu = !gameMode || gameMode === "online";
    set({
      gameMode,
      menuActive: shouldShowMenu,
      waitingOpponent: false,
    });
  },
  updateGlobalState: (state) => set(state),
}));
