"use client";

import SvgIcon from "@/components/Shared/SvgIcon";
import { INITIAL_BOARD_SIZE } from "@/data/constants";
import { useGlobalStore } from "@/stores/global.store/global.store";
import { useState } from "react";
import { io } from "socket.io-client";
import MPBoardSelection from "./MPBoardSelection/MPBoardSelection";
import s from "./MultiPlayerMenu.module.scss";

const socket = io.connect("http://localhost:4000");

const MultiPlayerMenu = () => {
  const updateGameMode = useGlobalStore((s) => s.updateGameMode);
  const [selectedBoardSize, setSelectedBoardSize] =
    useState(INITIAL_BOARD_SIZE);

  function handleBackButton() {
    updateGameMode(null);
  }

  function handleSubmit(event) {
    event.preventDefault();
    socket.emit("matchmaking", selectedBoardSize);
  }

  return (
    <div className={s.mpContent}>
      <button type="button" className={s.backButton} onClick={handleBackButton}>
        <SvgIcon name="arrowLeft" />
      </button>

      <header className={s.header}>
        <h1>Multiplayer Setup</h1>
        <p>Configure your game settings</p>
      </header>

      <form className={s.mpForm} onClick={handleSubmit}>
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
