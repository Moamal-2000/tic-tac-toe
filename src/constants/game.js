import { SYMBOL_O, SYMBOL_X } from "./global";

export const POWER_UPS_BUTTONS = [
  { name: "freeze", label: "Freeze" },
  { name: "bomb", label: "Bomb" },
  { name: "swap", label: "Swap" },
];

export const POWER_UPS = POWER_UPS_BUTTONS.map((item) => item.name);

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
  {
    label: "Return to Match",
    iconName: "arrowLeft",
    mode: "return_to_match",
    id: 4,
  },
];
