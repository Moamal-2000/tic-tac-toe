import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useLocalStorageStore = create(
  persist(
    (set) => ({
      isVolumeOn: true,

      updateLocalStorageState: (state) => set(state),
    }),
    { name: "global-storage" }
  )
);
