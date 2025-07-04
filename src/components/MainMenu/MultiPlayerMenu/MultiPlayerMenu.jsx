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
  const { updateGameMode, updateGlobalState } = useGlobalStore((s) => s);
  const { getGameStates, selectedBoardSize } = useMultiplayerStore((s) => s);
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
    const { turn, board, winner, isWinnerPopupVisible } = state;

    updateGlobalState({ isMainMenuActive: false });
    updateGlobalState({ isWaitingForOpponent: false });

    getGameStates({
      boardSize: state.board[0].length,
      playerTurn: turn,
      board,
      winner,
      isWinnerPopupVisible,
    });
  }

  useEffect(() => {
    socket.on("room-update", (state) => {
      syncNewGameState(state);
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
        <button type="submit">Join & Wait</button>
      </form>
    </div>
  );
};

export default MultiPlayerMenu;
