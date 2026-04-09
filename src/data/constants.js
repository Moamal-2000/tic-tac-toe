export const BOARD_SIZES = [3, 4, 5];
export const SYMBOL_O_TEXT = "○";
export const SYMBOL_X_TEXT = "✕";
export const SYMBOL_O = "o";
export const SYMBOL_X = "x";
export const FIRST_PLAYER = SYMBOL_O;
export const INITIAL_BOARD_SIZE = 4;
export const SWAP_SYMBOL_DELAY_MS = 800;
export const BOMB_DELETION_DELAY_MS = 800;
export const WINNER_POPUP_DURATION_MS = 2000;
export const KEY_DEBOUNCE_DELAY_MS = 200;
export const BOT_MOVE_DELAY_MS = 700;
export const TURN_TIMER_DURATION = 30; // seconds
export const INITIAL_PLAY_MODE = "classicMode"; // "classicMode" | "autoHideMode"
export const INITIAL_SQUARE_HIDDEN_TIME = 6;
export const MAX_LIVE_MATCHES = 9;

export const EMPTY_SCORES = { [SYMBOL_O]: 0, [SYMBOL_X]: 0 };
export const MOVE_SCORES = {
  fill: 1,
  win: 10,
  draw: 5,
  "freeze-square": 2,
  "draw-by-swap": 3,
  "win-by-swap": 4,
  "win-by-bomb": 10,
};

export const MODEL_CLOSE_KEYS = ["Escape", "Backspace"];
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
