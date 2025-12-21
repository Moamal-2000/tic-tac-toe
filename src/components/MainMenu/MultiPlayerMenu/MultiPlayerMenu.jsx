"use client";

import BackButton from "@/components/Shared/BackButton/BackButton";
import { BUTTON_SOUND, soundFiles } from "@/data/sounds";
import usePreloadSounds from "@/hooks/usePreloadSounds";
import { socket } from "@/socket/socket";
import { useGlobalStore } from "@/stores/global.store/global.store";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useEffect } from "react";
import MPBoardSelection from "./MPBoardSelection/MPBoardSelection";
import s from "./MultiPlayerMenu.module.scss";

const MultiPlayerMenu = () => {
  const { updateGameMode, updateGlobalState } = useGlobalStore();
  const { updateGameStates, updateStatsOnResult, selectedBoardSize, resetMultiplayerState, updateMultiplayerState } =
    useMultiplayerStore((s) => s);
  const playSound = usePreloadSounds({ click: soundFiles.click });

  function handleSubmit(event) {
    event?.preventDefault();
    socket.emit("matchmaking", selectedBoardSize);
    updateGlobalState({ isWaitingForOpponent: true });
    playSound(BUTTON_SOUND);
  }

  function handleBackButton() {
    playSound(BUTTON_SOUND);
    updateGameMode(null);
  }

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
    socket.on("room-update", (state) => {
      syncNewGameState(state);
    });

    socket.on("opponent-disconnected", () => {
      updateMultiplayerState({ isOpponentDisconnected: true });
    });
  }, []);

  return (
    <div className={s.mpContent}>
      <BackButton onClick={handleBackButton} />

      <header className={s.header}>
        <h1>Multiplayer Setup</h1>
        <p>Configure your game settings</p>
      </header>

      <form className={s.mpForm} onSubmit={handleSubmit}>
        <MPBoardSelection />
        <button type="submit">Find Match</button>
      </form>
    </div>
  );
};

export default MultiPlayerMenu;
