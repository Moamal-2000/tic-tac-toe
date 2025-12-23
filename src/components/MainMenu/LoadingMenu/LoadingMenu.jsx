"use client";

import BackButton from "@/components/Shared/BackButton/BackButton";
import { BUTTON_SOUND, soundFiles } from "@/data/sounds";
import usePreloadSounds from "@/hooks/usePreloadSounds";
import { socket } from "@/socket/socket";
import { useGlobalStore } from "@/stores/global.store/global.store";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useEffect } from "react";
import s from "./LoadingMenu.module.scss";

const LoadingMenu = () => {
  const updateGlobalState = useGlobalStore((s) => s.updateGlobalState);
  const { updateGameStates, updateStatsOnResult } = useMultiplayerStore();
  const playSound = usePreloadSounds({ click: soundFiles.click });

  function syncNewGameState(state) {
    const {
      turn,
      board,
      winner,
      draw,
      hasGameStarted,
      isWinnerPopupVisible,
      timeRemaining,
      timerActive,
    } = state;

    updateGlobalState({ isMainMenuActive: false });
    updateGlobalState({ isWaitingForOpponent: false });

    // If the game has ended (winner or draw), update multiplayer stats
    if (winner || draw) {
      updateStatsOnResult({ winner, draw });
    }

    // Extract squaresToSwap from the board state
    const squaresToSwap = [];
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell.swapSelected) {
          squaresToSwap.push([rowIndex, colIndex]);
        }
      });
    });

    updateGameStates({
      boardSize: state.board[0].length,
      playerTurn: turn,
      board,
      winner,
      draw,
      hasGameStarted,
      isWinnerPopupVisible,
      powerUps: state.powerUps,
      mySymbol: state.me,
      squaresToSwap,
      timeRemaining,
      timerActive,
    });
  }

  useEffect(() => {
    const handleRoomUpdate = (state) => {
      syncNewGameState(state);
    };

    socket.on("room-update", handleRoomUpdate);

    return () => {
      socket.off("room-update", handleRoomUpdate);
    };
  }, []);

  function handleBackButton() {
    socket.emit("cancel-matchmaking");
    updateGlobalState({ isWaitingForOpponent: false });
    playSound(BUTTON_SOUND);
  }

  return (
    <div className={s.loadingMenu}>
      <BackButton onClick={handleBackButton} />

      <div className={s.content}>
        <div className={s.loader}>
          <svg aria-hidden="true">
            <use href="/icons-sprite.svg#spinner" />
          </svg>
        </div>

        <h2>Finding Match...</h2>
        <p>Please wait while we connect you with another player</p>
      </div>
    </div>
  );
};

export default LoadingMenu;
