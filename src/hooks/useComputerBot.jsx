"use client";

import { chooseBotAction } from "@/ai/bot";
import { normalizeFromStore } from "@/ai/engine";
import { SYMBOL_X } from "@/data/constants";
import { BUTTON_SOUND, soundFiles } from "@/data/sounds";
import usePreloadSounds from "@/hooks/usePreloadSounds";
import { useGlobalStore } from "@/stores/global.store/global.store";
import { useXOStore } from "@/stores/xo.store/xo.store";
import { useEffect, useRef } from "react";

export default function useComputerBot() {
  const gameMode = useGlobalStore((s) => s.gameMode);
  const aiDifficulty = useGlobalStore((s) => s.aiDifficulty);
  const playSound = usePreloadSounds(soundFiles);

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
  } = useXOStore((s) => s);

  const busyRef = useRef(false);

  useEffect(() => {
    if (gameMode !== "computer") return;
    if (!hasGameStart) return;
    if (winner) return;
    if (playerTurn !== SYMBOL_X) return;
    if (powerUps.hasActivePowerUp) return;
    if (squaresToSwap.length > 0) return;
    if (busyRef.current) return;

    const allowPowerUps =
      (boardSize === 4 || boardSize === 5) && playMode !== "autoHideMode";

    busyRef.current = true;

    const timeout = setTimeout(() => {
      try {
        const baseState = normalizeFromStore({
          board,
          boardSize,
          playerTurn,
          powerUps,
        });
        const stateForBot = allowPowerUps
          ? baseState
          : {
              ...baseState,
              powerUps: {
                ...baseState.powerUps,
                [SYMBOL_X]: {
                  freeze: {
                    ...baseState.powerUps[SYMBOL_X].freeze,
                    available: false,
                  },
                  bomb: {
                    ...baseState.powerUps[SYMBOL_X].bomb,
                    available: false,
                  },
                  swap: {
                    ...baseState.powerUps[SYMBOL_X].swap,
                    available: false,
                  },
                },
              },
            };

        const { action } = chooseBotAction(stateForBot, aiDifficulty);

        if (!action) return;

        // Ensure AI is controlling player2 selection state, then execute.
        if (action.type === "place") {
          fillSquare(action.row, action.col);
          return;
        }

        if (!allowPowerUps) return;

        if (action.type === "freeze") {
          playSound(BUTTON_SOUND, 0.3);
          updateXOStoreState({
            squaresToSwap: [],
            powerUps: {
              ...powerUps,
              selectedPower: "freeze",
              whoUsingPower: "player2",
            },
          });
          usePowerUp({
            rowIndex: action.row,
            columnIndex: action.col,
            playSound,
          });
          return;
        }

        if (action.type === "bomb") {
          playSound(BUTTON_SOUND, 0.3);
          updateXOStoreState({
            squaresToSwap: [],
            powerUps: {
              ...powerUps,
              selectedPower: "bomb",
              whoUsingPower: "player2",
            },
          });
          usePowerUp({
            rowIndex: action.row,
            columnIndex: action.col,
            playSound,
          });
          return;
        }

        if (action.type === "swap") {
          playSound(BUTTON_SOUND, 0.3);
          updateXOStoreState({
            squaresToSwap: [],
            powerUps: {
              ...powerUps,
              selectedPower: "swap",
              whoUsingPower: "player2",
            },
          });

          // Select first square (shows .select state)
          usePowerUp({
            rowIndex: action.a[0],
            columnIndex: action.a[1],
            playSound,
          });

          // Select second square shortly after so the UI renders the first selection,
          // then shows the swap overlay animation for both squares.
          setTimeout(() => {
            playSound(BUTTON_SOUND, 0.3);
            usePowerUp({
              rowIndex: action.b[0],
              columnIndex: action.b[1],
              playSound,
            });
          }, 180);
          return;
        }
      } finally {
        busyRef.current = false;
      }
    }, 250);

    return () => {
      clearTimeout(timeout);
      busyRef.current = false;
    };
  }, [
    gameMode,
    aiDifficulty,
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
    playSound,
  ]);
}
