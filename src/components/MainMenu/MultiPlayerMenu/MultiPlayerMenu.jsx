"use client";

import { INITIAL_BOARD_SIZE } from "@/data/constants";
import { useState } from "react";
import MPBoardSelection from "./MPBoardSelection/MPBoardSelection";
import s from "./MultiPlayerMenu.module.scss";

const MultiPlayerMenu = () => {
  const [selectedBoardSize, setSelectedBoardSize] =
    useState(INITIAL_BOARD_SIZE);

  return (
    <div className={s.mpContent}>
      <header className={s.header}>
        <h1>Multiplayer Setup</h1>
        <p>Configure your game settings</p>
      </header>

      <form className={s.mpForm}>
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
