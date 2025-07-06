"use client";

import { SYMBOL_O, SYMBOL_X } from "@/data/constants";
import {
  DRAW_SOUND,
  getRandomSound,
  soundFiles,
  WINNER_SOUNDS,
} from "@/data/sounds";
import usePreloadSounds from "@/hooks/usePreloadSounds";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import s from "./WinnerPopUp.module.scss";

const WinnerPopUp = () => {
  const { winner, draw, isWinnerPopupVisible } = useMultiplayerStore((s) => s);
  const playSound = usePreloadSounds(soundFiles);

  const isP1Win = winner === SYMBOL_O;
  const isP2Win = winner === SYMBOL_X;

  if (isWinnerPopupVisible) {
    if (draw) {
      playSound(DRAW_SOUND, 0.1);
    }

    if (isP1Win || isP2Win) {
      playSound(...getRandomSound(...WINNER_SOUNDS));
    }
  }

  const classes = [
    s.winner,
    draw ? s.draw : "",
    isP1Win ? s.p1 : "",
    isP2Win ? s.p2 : "",
    isWinnerPopupVisible ? s.show : "",
  ].join(" ");

  const winMessage = winMessages?.[draw ? "Draw!" : winner];

  return <p className={classes}>{winMessage}</p>;
};

export default WinnerPopUp;

const winMessages = {
  [SYMBOL_O]: "P1 Wins!",
  [SYMBOL_X]: "P2 Wins!",
  "Draw!": "It's a Draw!",
};
