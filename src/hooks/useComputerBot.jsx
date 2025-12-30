"use client";

import { chooseBotAction } from "@/ai/bot";
import { normalizeFromStore } from "@/ai/engine";
import { BOT_MOVE_DELAY_MS, SYMBOL_X } from "@/data/constants";
import { BUTTON_SOUND, soundFiles } from "@/data/sounds";
import { POWER_UPS } from "@/data/staticData";
import usePreloadSounds from "@/hooks/usePreloadSounds";
import { useGlobalStore } from "@/stores/global.store/global.store";
import { useXOStore } from "@/stores/xo.store/xo.store";
import { useEffect } from "react";

export default function useComputerBot() {
  const { gameMode, botDifficulty } = useGlobalStore();
  const {
    hasGameStart,
    winner,
    board,
    boardSize,
    playerTurn,
    powerUps,
    playMode,
    squaresToSwap,
    updateXOStoreState,
    fillSquare,
    usePowerUp,
  } = useXOStore();

  const playSound = usePreloadSounds(soundFiles);

  const isBotTurn =
    gameMode === "computer" &&
    hasGameStart &&
    !winner &&
    playerTurn === SYMBOL_X &&
    !powerUps.hasActivePowerUp &&
    squaresToSwap.length === 0;

  const allowPowerUps =
    boardSize >= 4 && boardSize <= 5 && playMode !== "autoHideMode";

  function executePowerUp(type, action) {
    playSound(BUTTON_SOUND, 0.3);

    updateXOStoreState({
      squaresToSwap: [],
      powerUps: {
        ...powerUps,
        selectedPower: type,
        whoUsingPower: "player2",
      },
    });

    if (type === "swap") {
      const [first, second] = [action.a, action.b];

      usePowerUp({ rowIndex: first[0], columnIndex: first[1], playSound });

      setTimeout(() => {
        playSound(BUTTON_SOUND, 0.3);
        usePowerUp({ rowIndex: second[0], columnIndex: second[1], playSound });
      }, 180);

      return;
    }

    usePowerUp({ rowIndex: action.row, columnIndex: action.col, playSound });
  }

  useEffect(() => {
    if (!isBotTurn) return;

    function performBotMove() {
      const baseState = normalizeFromStore({
        board,
        boardSize,
        playerTurn,
        powerUps,
      });

      let stateForBot = baseState;

      if (!allowPowerUps) {
        const disabledPlayerXPowerUps = Object.fromEntries(
          Object.entries(baseState.powerUps[SYMBOL_X]).map(([key, val]) => [
            key,
            { ...val, available: false },
          ])
        );

        stateForBot = {
          ...baseState,
          powerUps: {
            ...baseState.powerUps,
            [SYMBOL_X]: disabledPlayerXPowerUps,
          },
        };
      }

      const { action } = chooseBotAction(stateForBot, botDifficulty);
      if (!action) return;

      if (action.type === "place") {
        playSound(BUTTON_SOUND, 0.3);
        fillSquare(action.row, action.col);
        return;
      }

      if (allowPowerUps && POWER_UPS.includes(action.type)) {
        executePowerUp(action.type, action);
      }
    }

    const timeout = setTimeout(performBotMove, BOT_MOVE_DELAY_MS);

    return () => {
      clearTimeout(timeout);
    };
  }, [playerTurn]);
}
