import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";

/**
 * Debug utility to monitor exploreMode state changes
 * Call this function in your component to start monitoring
 */
export const startExploreModeDebugging = () => {
  console.log("🚀 Starting exploreMode debugging...");

  // Log initial state
  const initialState = useMultiplayerStore.getState().exploreMode;
  console.log("📊 Initial exploreMode state:", initialState);

  // Subscribe to state changes
  const unsubscribe = useMultiplayerStore.subscribe(
    (state) => state.exploreMode,
    (exploreMode, previousExploreMode) => {
      console.log("🔄 exploreMode changed:", {
        from: previousExploreMode,
        to: exploreMode,
        fullState: useMultiplayerStore.getState(),
      });
    },
  );

  return unsubscribe;
};

/**
 * Get current exploreMode state and related context
 */
export const getExploreModeContext = () => {
  const state = useMultiplayerStore.getState();
  return {
    exploreMode: state.exploreMode,
    hasGameStarted: state.hasGameStarted,
    isOpponentDisconnected: state.isOpponentDisconnected,
    winner: state.winner,
    draw: state.draw,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Log exploreMode state with context
 */
export const logExploreModeState = (label = "Current") => {
  const context = getExploreModeContext();
  console.log(`📊 ${label} exploreMode context:`, context);
};
