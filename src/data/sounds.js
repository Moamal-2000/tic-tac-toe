export const soundFiles = {
  click: "/sounds/click.mp3",
  unselect: "/sounds/unselect.mp3",
  freeze: "/sounds/freeze.mp3",
  bomb: "/sounds/bomb.mp3",
  swap: "/sounds/swap.mp3",
  victory1: "/sounds/victory-1.mp3",
  victory2: "/sounds/victory-2.mp3",
  draw: "/sounds/draw.mp3",
};

export const BUTTON_SOUND = "click";
export const UNSELECT_SOUND = "unselect";
export const FREEZE_SOUND = "freeze";
export const BOMB_SOUND = "bomb";
export const SWAP_SOUND = "swap";
export const DRAW_SOUND = "draw";

// [name, volume]
export const WINNER_SOUNDS = [
  ["victory1", 0.1],
  ["victory2", 0.2],
];

export function getRandomSound(...sounds) {
  const randomNumber = Math.floor(Math.random() * sounds.length);
  const sound = sounds[randomNumber][0];
  const volume = sounds[randomNumber][1];
  return [sound, volume];
}
