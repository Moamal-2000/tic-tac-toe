import { create } from "zustand";

export const useGlobalStore = create((set, get) => ({
  isAboutModelActive: false,
  isMainMenuActive: true,
  gameMode: null, // "local" | "online"
  isWaitingForOpponent: false,
  isVolumeOn: true,

  toggleAboutModel: (value) => {
    set({ isAboutModelActive: value ? value : !get().isAboutModelActive });
  },
  updateGameMode: (gameMode) => {
    set({ gameMode, isMainMenuActive: gameMode !== "local" });
  },
  updateGlobalState: (state) => set(state),
}));
