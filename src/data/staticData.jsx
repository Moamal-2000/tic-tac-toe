import { SYMBOL_O, SYMBOL_X } from "./constants";

export const POWER_UPS_BUTTONS = [
  {
    id: "freeze",
    name: "Freeze",
    icon: "❄️",
  },
  {
    id: "bomb",
    name: "Bomb",
    icon: "💣",
  },
  {
    id: "swap",
    name: "Swap",
    icon: "🔄",
  },
];

export const HOW_TO_PLAY_LIST = [
  {
    content: (
      <p>
        <strong>
          Player 1 <b>({SYMBOL_O})</b>
        </strong>{" "}
        always starts the game by placing their symbol first.{" "}
        <strong>
          Player 2{" "}
          <b>
            (<b data-symbol="x">{SYMBOL_X}</b>)
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

export const soundFiles = {
  bomb1: "/sounds/bomb-1.mp3",
  bomb2: "/sounds/bomb-2.wav",
  click1: "/sounds/click-1.m4a",
  click2: "/sounds/click-2.wav",
  click3: "/sounds/click-3.wav",
  click4: "/sounds/click-4.wav",
  click5: "/sounds/click-5.wav",
  freeze: "/sounds/freeze-1.wav",
  swap1: "/sounds/swap-1.wav",
  swap2: "/sounds/swap-2.wav",
  unselect: "/sounds/unselect.wav",
};
