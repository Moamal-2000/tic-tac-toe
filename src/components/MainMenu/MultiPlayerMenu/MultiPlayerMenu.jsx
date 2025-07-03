"use client";

import BackButton from "@/components/Shared/BackButton/BackButton";
import {
  INITIAL_BOARD_SIZE,
  SYMBOL_O,
  WINNER_POPUP_DURATION_MS,
} from "@/data/constants";
import { socket } from "@/socket/socket";
import { useGlobalStore } from "@/stores/global.store/global.store";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useEffect, useState } from "react";
import MPBoardSelection from "./MPBoardSelection/MPBoardSelection";
import s from "./MultiPlayerMenu.module.scss";

const obj = {
  [SYMBOL_O]: "Test",
};

const MultiPlayerMenu = () => {
  const { updateGameMode, updateGlobalState } = useGlobalStore((s) => s);
  const { getGameStates } = useMultiplayerStore((s) => s);
  const [selectedBoardSize, setSelectedBoardSize] =
    useState(INITIAL_BOARD_SIZE);

  function handleSubmit(event) {
    event?.preventDefault();
    socket.emit("matchmaking", selectedBoardSize);
    updateGlobalState({ key: "isWaitingForOpponent", value: true });
  }

  useEffect(() => {
    socket.on("room-update", (state) => {
      const someoneWins = !!state.winner;

      updateGlobalState({ key: "isMainMenuActive", value: false });
      updateGlobalState({ key: "isWaitingForOpponent", value: false });
      getGameStates({
        boardSize: state.board[0].length,
        playerTurn: state.turn,
        board: state.board,
        winner: state.winner,
        isWinnerPopupVisible: someoneWins,
      });
    });

    handleSubmit();
  }, []);

  return (
    <div className={s.mpContent}>
      <BackButton onClick={() => updateGameMode(null)} />

      <header className={s.header}>
        <h1>Multiplayer Setup</h1>
        <p>Configure your game settings</p>
      </header>

      <form className={s.mpForm} onSubmit={handleSubmit}>
        <MPBoardSelection
          selectedBoardSize={selectedBoardSize}
          setSelectedBoardSize={setSelectedBoardSize}
        />

        <button type="submit">Join & Wait</button>
      </form>
    </div>
  );
};

export default MultiPlayerMenu;
