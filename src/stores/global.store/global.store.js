import { create } from "zustand";

export const useGlobalStore = create((set, get) => ({
  isAboutModelActive: false,
  isMainMenuActive: true,
  gameMode: null, // "local" | "computer" | "online"
  aiDifficulty: "medium", // "easy" | "medium" | "hard"
  isWaitingForOpponent: false,

  toggleAboutModel: (value) => {
    set({ isAboutModelActive: value ? value : !get().isAboutModelActive });
  },
  updateGameMode: (gameMode) => {
    const shouldShowMenu = !gameMode || gameMode === "online";
    set({
      gameMode,
      isMainMenuActive: shouldShowMenu,
      isWaitingForOpponent: false,
    });
  },
  setAiDifficulty: (aiDifficulty) => set({ aiDifficulty }),
  updateGlobalState: (state) => set(state),
}));
