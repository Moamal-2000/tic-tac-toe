import { SYMBOL_O, SYMBOL_O_TEXT, SYMBOL_X, SYMBOL_X_TEXT } from "./constants";

export const POWER_UPS_BUTTONS = [
  { name: "freeze", label: "Freeze" },
  { name: "bomb", label: "Bomb" },
  { name: "swap", label: "Swap" },
];

export const HOW_TO_PLAY_LIST = [
  {
    content: (
      <p>
        <strong>
          Player 1 <b>({SYMBOL_O_TEXT})</b>
        </strong>{" "}
        always starts the game by placing their symbol first.{" "}
        <strong>
          Player 2{" "}
          <b>
            (<b data-symbol="x">{SYMBOL_X_TEXT}</b>)
          </b>
        </strong>{" "}
        follows.
      </p>
    ),
    id: 1,
  },
  {
    content: (
      <div>
        Simply <strong>click</strong> on any empty cell on the game board to
        place your symbol.
      </div>
    ),
    id: 2,
  },
  {
    content:
      "Get your symbols in a row (horizontal, vertical, or diagonal) to win.",
    id: 3,
  },
  {
    content: (
      <div>
        If all cells are filled with no winner, it's a <strong>draw</strong>.
      </div>
    ),
    id: 4,
  },
];

export const BOARD_EXAMPLES = {
  winningBoard: [
    [
      { fillWith: SYMBOL_O, type: "winning" },
      { fillWith: SYMBOL_X },
      { fillWith: "" },
      { fillWith: "" },
    ],
    [
      { fillWith: SYMBOL_X },
      { fillWith: SYMBOL_O, type: "winning" },
      { fillWith: "" },
      { fillWith: "" },
    ],
    [
      { fillWith: "" },
      { fillWith: "" },
      { fillWith: SYMBOL_O, type: "winning" },
      { fillWith: "" },
    ],
    [
      { fillWith: "" },
      { fillWith: "" },
      { fillWith: "" },
      { fillWith: SYMBOL_O, type: "winning" },
    ],
  ],
  freezeBoard: [
    [
      { fillWith: SYMBOL_O },
      { fillWith: SYMBOL_X, type: "frozen" },
      { fillWith: SYMBOL_O },
      { fillWith: "" },
    ],
    [
      { fillWith: "" },
      { fillWith: SYMBOL_X },
      { fillWith: "" },
      { fillWith: SYMBOL_O },
    ],
    [
      { fillWith: "" },
      { fillWith: SYMBOL_X },
      { fillWith: SYMBOL_O },
      { fillWith: SYMBOL_X },
    ],
    [
      { fillWith: "" },
      { fillWith: SYMBOL_X },
      { fillWith: "" },
      { fillWith: SYMBOL_X },
    ],
  ],
  bombBoard: [
    [
      { fillWith: SYMBOL_O, type: "targeted" },
      { fillWith: SYMBOL_X, type: "targeted" },
      { fillWith: SYMBOL_O, type: "targeted" },
      { fillWith: "" },
    ],
    [
      { fillWith: "", type: "targeted" },
      { fillWith: SYMBOL_X, type: "targeted" },
      { fillWith: SYMBOL_O, type: "targeted" },
      { fillWith: "" },
    ],
    [
      { fillWith: "", type: "targeted" },
      { fillWith: SYMBOL_X, type: "targeted" },
      { fillWith: SYMBOL_O, type: "targeted" },
      { fillWith: SYMBOL_X },
    ],
    [
      { fillWith: "" },
      { fillWith: SYMBOL_O },
      { fillWith: "" },
      { fillWith: SYMBOL_X },
    ],
  ],
  afterBombBoard: [
    [{ fillWith: "" }, { fillWith: "" }, { fillWith: "" }, { fillWith: "" }],
    [{ fillWith: "" }, { fillWith: "" }, { fillWith: "" }, { fillWith: "" }],
    [
      { fillWith: "" },
      { fillWith: "" },
      { fillWith: "" },
      { fillWith: SYMBOL_X },
    ],
    [
      { fillWith: "" },
      { fillWith: SYMBOL_O },
      { fillWith: "" },
      { fillWith: SYMBOL_X },
    ],
  ],
  selectSwapBoard: [
    [
      { fillWith: SYMBOL_O },
      { fillWith: SYMBOL_X },
      { fillWith: SYMBOL_O },
      { fillWith: "" },
    ],
    [
      { fillWith: "" },
      { fillWith: SYMBOL_X },
      { fillWith: "" },
      { fillWith: SYMBOL_O },
    ],
    [
      { fillWith: "" },
      { fillWith: SYMBOL_X },
      { fillWith: SYMBOL_O },
      { fillWith: SYMBOL_X },
    ],
    [
      { fillWith: "" },
      { fillWith: SYMBOL_O, type: "selected" },
      { fillWith: "" },
      { fillWith: SYMBOL_X, type: "selected frozen" },
    ],
  ],
  afterSwapBoard: [
    [
      { fillWith: SYMBOL_O },
      { fillWith: SYMBOL_X, type: "winning" },
      { fillWith: SYMBOL_O },
      { fillWith: "" },
    ],
    [
      { fillWith: "" },
      { fillWith: SYMBOL_X, type: "winning" },
      { fillWith: "" },
      { fillWith: SYMBOL_O },
    ],
    [
      { fillWith: "" },
      { fillWith: SYMBOL_X, type: "winning" },
      { fillWith: SYMBOL_O },
      { fillWith: SYMBOL_X },
    ],
    [
      { fillWith: "" },
      { fillWith: SYMBOL_X, type: "winning" },
      { fillWith: "" },
      { fillWith: SYMBOL_O, type: "frozen" },
    ],
  ],
};

export const GAME_MODES_BUTTONS = [
  {
    label: "Play on This Device",
    iconName: "user",
    mode: "local",
    id: 1,
  },
  {
    label: "Play Online",
    iconName: "users",
    mode: "online",
    id: 2,
  },
];
