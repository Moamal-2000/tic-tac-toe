"use client";

import BackButton from "@/components/Shared/BackButton/BackButton";
import { socket } from "@/socket/socket";
import { useGlobalStore } from "@/stores/global.store/global.store";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useEffect, useState } from "react";
import MPBoardSelection from "./MPBoardSelection/MPBoardSelection";
import s from "./MultiPlayerMenu.module.scss";

const MultiPlayerMenu = () => {
  const { updateGameMode, updateGlobalState } = useGlobalStore((s) => s);
  const { getGameStates } = useMultiplayerStore((s) => s);
  const [selectedBoardSize, setSelectedBoardSize] = useState(3);

  function handleSubmit(event) {
    event?.preventDefault();
    socket.emit("matchmaking", selectedBoardSize);
    updateGlobalState({ key: "isWaitingForOpponent", value: true });
  }

  useEffect(() => {
    socket.on("room-update", (state) => {
      updateGlobalState({ key: "isMainMenuActive", value: false });
      updateGlobalState({ key: "isWaitingForOpponent", value: false });
      getGameStates({
        boardSize: state.board[0].length,
        playerTurn: state.turn,
        board: state.board,
        winner: state.winner,
        isWinnerPopupVisible: state.isWinnerPopupVisible,
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
