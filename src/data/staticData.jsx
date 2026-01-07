import { SYMBOL_O, SYMBOL_X } from "./constants";

export const POWER_UPS_BUTTONS = [
  { name: "freeze", label: "Freeze" },
  { name: "bomb", label: "Bomb" },
  { name: "swap", label: "Swap" },
];

export const POWER_UPS = POWER_UPS_BUTTONS.map((item) => item.name);

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
    label: "Play vs Computer",
    iconName: "computer",
    mode: "computer",
    id: 1,
  },
  {
    label: "Play Locally",
    iconName: "users",
    mode: "local",
    id: 2,
  },
  {
    label: "Play Online",
    iconName: "wifi",
    mode: "online",
    id: 3,
  },
];
