import { SYMBOL_O, SYMBOL_X } from "./global";

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
