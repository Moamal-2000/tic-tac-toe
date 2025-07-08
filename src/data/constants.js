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
export const INITIAL_PLAY_MODE = "classicMode";
export const PLAY_MODES = [
  { name: "Classic", type: "classicMode", id: 1 },
  { name: "Auto Hide Mode", type: "autoHideMode", id: 2 },
];
