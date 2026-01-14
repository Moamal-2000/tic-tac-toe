"use client";

import { SYMBOL_O, SYMBOL_X } from "@/data/constants";
import {
  DRAW_SOUND,
  getRandomSound,
  soundFiles,
  WINNER_SOUNDS,
} from "@/data/sounds";
import usePreloadSounds from "@/hooks/app/usePreloadSounds";
import { useGlobalStore } from "@/stores/global.store/global.store";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useXOStore } from "@/stores/xo.store/xo.store";
import { useTranslations } from "next-intl";
import s from "./WinnerPopUp.module.scss";

const WinnerPopUp = () => {
  const gameMode = useGlobalStore((s) => s.gameMode);
  const isSinglePlayerMode = gameMode === "local" || gameMode === "computer";

  const {
    winner,
    isWinnerPopupVisible,
    draw = winner === "Draw!",
  } = isSinglePlayerMode ? useXOStore() : useMultiplayerStore();

  const playSound = usePreloadSounds(soundFiles);
  const t = useTranslations("winner_popup");

  const isP1Win = winner === SYMBOL_O;
  const isP2Win = winner === SYMBOL_X;

  const classes = [
    s.winner,
    draw ? s.draw : "",
    isP1Win ? s.p1 : "",
    isP2Win ? s.p2 : "",
    isWinnerPopupVisible ? s.show : "",
  ].join(" ");

  function getWinnerMessage() {
    return t(`${draw ? "draws" : isP1Win ? "p1_wins" : "p2_wins"}`);
  }

  if (isWinnerPopupVisible) {
    if (draw) {
      playSound(DRAW_SOUND, 0.1);
    }

    if (isP1Win || isP2Win) {
      playSound(...getRandomSound(...WINNER_SOUNDS));
    }
  }

  return <p className={classes}>{getWinnerMessage()}</p>;
};

export default WinnerPopUp;
