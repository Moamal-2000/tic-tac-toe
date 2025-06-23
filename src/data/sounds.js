export const soundFiles = {
  bomb1: "/sounds/bomb-1.mp3",
  bomb2: "/sounds/bomb-2.mp3",
  click4: "/sounds/click-4.mp3",
  freeze: "/sounds/freeze-1.mp3",
  swap1: "/sounds/swap-1.mp3",
  swap2: "/sounds/swap-2.mp3",
  unselect: "/sounds/unselect.mp3",
  victory2: "/sounds/victory-2.mp3",
  victory4: "/sounds/victory-4.mp3",
  victoryOrTie: "/sounds/victory-or-tie.mp3",
};

export const BUTTON_SOUND = "click4";
export const UNSELECT_SOUND = "unselect";
export const FREEZE_SOUND = "freeze";
export const SWAP_SYMBOLS_SOUND = "swap1";
export const DRAW_SOUND = "victoryOrTie";

// [soundName, soundVolume]
export const BOMB_SOUNDS = [
  ["bomb1", 0.25],
  ["bomb2", 1],
];
export const WINNER_SOUNDS = [
  ["victory2", 0.1],
  ["victory4", 0.2],
];

export function getRandomSound(...sounds) {
  const randomNumber = Math.floor(Math.random() * sounds.length);
  const sound = sounds[randomNumber][0];
  const volume = sounds[randomNumber][1];
  return [sound, volume];
}
