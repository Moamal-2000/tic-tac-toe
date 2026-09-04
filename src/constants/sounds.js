const SOUNDS_BASE_PATH = "/assets/sounds";
export const SOUND_PATHS = {
  click: `${SOUNDS_BASE_PATH}/click.mp3`,
  unselect: `${SOUNDS_BASE_PATH}/unselect.mp3`,
  freeze: `${SOUNDS_BASE_PATH}/freeze.mp3`,
  bomb: `${SOUNDS_BASE_PATH}/bomb.mp3`,
  swap: `${SOUNDS_BASE_PATH}/swap.mp3`,
  victory1: `${SOUNDS_BASE_PATH}/victory-1.mp3`,
  victory2: `${SOUNDS_BASE_PATH}/victory-2.mp3`,
  draw: `${SOUNDS_BASE_PATH}/draw.mp3`,
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
  const randomIndex = Math.floor(Math.random() * sounds.length);
  const sound = sounds[randomIndex][0];
  const volume = sounds[randomIndex][1];
  return [sound, volume];
}
