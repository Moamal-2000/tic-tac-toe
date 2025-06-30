"use client";

import { BOARD_SIZES, INITIAL_BOARD_SIZE } from "@/data/constants";
import { useState } from "react";
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
        <div className={s.boardSelectionWrapper}>
          <label htmlFor="boardSize">Board Size</label>

          <div className={s.boardSelection} id="boardSize">
            {BOARD_SIZES.map((size) => (
              <div className={s.option} key={`boardSize-${size}`}>
                <input
                  type="radio"
                  name="boardSize"
                  id={`boardSize-${size}`}
                  value={size}
                  checked={size === selectedBoardSize}
                  onChange={(e) => setSelectedBoardSize(+e.target.value)}
                />
                <label htmlFor={`boardSize-${size}`}>
                  {size}x{size}
                </label>
              </div>
            ))}
          </div>
        </div>

        <button type="submit">Join & Wait</button>
      </form>
    </div>
  );
};

export default MultiPlayerMenu;
