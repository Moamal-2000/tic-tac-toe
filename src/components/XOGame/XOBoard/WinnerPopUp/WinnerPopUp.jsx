"use client";

import { SYMBOL_O, SYMBOL_X } from "@/data/constants";
import {
  DRAW_SOUND_EFFECT,
  soundFiles,
  WINNER_SOUND_EFFECT,
} from "@/data/sounds";
import usePreloadSounds from "@/hooks/usePreloadSounds";
import { useXOStore } from "@/stores/xo.store/xo.store";
import s from "./WinnerPopUp.module.scss";

const WinnerPopUp = () => {
  const { winner, isWinnerPopupVisible } = useXOStore((s) => s);
  const playSound = usePreloadSounds(soundFiles);

  const isDraw = winner === "Draw!";
  const isP1Win = winner === SYMBOL_O;
  const isP2Win = winner === SYMBOL_X;

  if (isWinnerPopupVisible) {
    if (isDraw) {
      playSound(DRAW_SOUND_EFFECT, 0.1);
    }

    if (isP1Win || isP2Win) {
      playSound(WINNER_SOUND_EFFECT, 0.1);
    }
  }

  const classes = [
    s.winner,
    isDraw ? s.draw : "",
    isP1Win ? s.p1 : "",
    isP2Win ? s.p2 : "",
    isWinnerPopupVisible ? s.show : "",
  ].join(" ");

  return <p className={classes}>{winMessages?.[winner]}</p>;
};

export default WinnerPopUp;

const winMessages = {
  [SYMBOL_O]: "P1 Wins!",
  [SYMBOL_X]: "P2 Wins!",
  "Draw!": "It's a Draw!",
};
