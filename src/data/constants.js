export const BOARD_SIZES = [3, 4, 5];
export const SYMBOL_O_TEXT = "○";
export const SYMBOL_X_TEXT = "✕";
export const SYMBOL_O = "o";
export const SYMBOL_X = "x";
export const FIRST_PLAYER = SYMBOL_X;
export const INITIAL_BOARD_SIZE = 4;
export const SWAP_SYMBOL_DELAY_MS = 800;
export const BOMB_DELETION_DELAY_MS = 800;
export const WINNER_POPUP_DURATION_MS = 2000;
export const KEY_DEBOUNCE_DELAY_MS = 200;
export const IS_PRODUCTION = process.env.NODE_ENV === "production";
export const INITIAL_PLAY_MODE = "classicMode"; // "classicMode" | "autoHideMode"
export const INITIAL_SQUARE_HIDDEN_TIME = 6;
export const PLAY_MODES = [
  { name: "Classic", type: "classicMode", id: 1 },
  { name: "Auto Hide Mode", type: "autoHideMode", id: 2 },
];
export const SCREEN_SIZES = {
  large: {
    devices: ["standard desktop", "large laptop", "desktop"],
    size: 1200,
  },
  medium: {
    devices: ["small laptop", "tablet in landscape"],
    size: 992,
  },
  small: {
    devices: ["tablet", "large phone in landscape"],
    size: 768,
  },
  verySmall: {
    devices: ["small phone"],
    size: 376,
  },
};
