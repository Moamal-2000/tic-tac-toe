import { create } from "zustand";

export const useGlobalStore = create((set, get) => ({
  isAboutModelActive: false,
  isMainMenuActive: false,
  gameMode: null, // "singleplayer" | "multiplayer"

  toggleAboutModel: (value) => {
    set({ isAboutModelActive: value ? value : !get().isAboutModelActive });
  },

}));
