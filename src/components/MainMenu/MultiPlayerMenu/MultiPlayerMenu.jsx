"use client";

import BackButton from "@/components/Shared/BackButton/BackButton";
import { INITIAL_BOARD_SIZE } from "@/data/constants";
import { useGlobalStore } from "@/stores/global.store/global.store";
import { useState } from "react";
import { io } from "socket.io-client";
import MPBoardSelection from "./MPBoardSelection/MPBoardSelection";
import s from "./MultiPlayerMenu.module.scss";

const socket = io.connect("http://localhost:4000");

const MultiPlayerMenu = () => {
  const { updateGameMode, updateGlobalState } = useGlobalStore((s) => s);
  const [selectedBoardSize, setSelectedBoardSize] =
    useState(INITIAL_BOARD_SIZE);

  function handleSubmit(event) {
    event.preventDefault();
    socket.emit("matchmaking", selectedBoardSize);
    updateGlobalState({ key: "isWaitingForOpponent", value: true });
  }

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
