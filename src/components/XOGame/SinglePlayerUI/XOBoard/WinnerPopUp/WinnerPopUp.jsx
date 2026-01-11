"use client";

import { SYMBOL_O, SYMBOL_X } from "@/data/constants";
import {
  DRAW_SOUND,
  getRandomSound,
  soundFiles,
  WINNER_SOUNDS,
} from "@/data/sounds";
import usePreloadSounds from "@/hooks/usePreloadSounds";
import { useXOStore } from "@/stores/xo.store/xo.store";
import { useTranslations } from "next-intl";
import s from "./WinnerPopUp.module.scss";

const WinnerPopUp = () => {
  const { winner, isWinnerPopupVisible } = useXOStore();
  const playSound = usePreloadSounds(soundFiles);
  const t = useTranslations("winner_popup");

  const isDraw = winner === "Draw!";
  const isP1Win = winner === SYMBOL_O;
  const isP2Win = winner === SYMBOL_X;

  const classes = [
    s.winner,
    isDraw ? s.draw : "",
    isP1Win ? s.p1 : "",
    isP2Win ? s.p2 : "",
    isWinnerPopupVisible ? s.show : "",
  ].join(" ");

  function getWinnerMessage() {
    return t(`${isDraw ? "draws" : isP1Win ? "p1_wins" : "p2_wins"}`);
  }

  if (isWinnerPopupVisible) {
    if (isDraw) {
      playSound(DRAW_SOUND, 0.1);
    }

    if (isP1Win || isP2Win) {
      playSound(...getRandomSound(...WINNER_SOUNDS));
    }
  }

  return <p className={classes}>{getWinnerMessage()}</p>;
};

export default WinnerPopUp;
