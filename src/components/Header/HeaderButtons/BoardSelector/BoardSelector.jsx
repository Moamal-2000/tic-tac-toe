"use client";

import { BOARD_SIZES } from "@/data/constants";
import { useGlobalStore } from "@/stores/global.store/global.store";
import { useXOStore } from "@/stores/xo.store/xo.store";
import s from "./BoardSelector.module.scss";

const BoardSelector = ({ playClickSound }) => {
  const { boardSize, updateBoardSize } = useXOStore((s) => s);
  const gameMode = useGlobalStore((s) => s.gameMode);

  if (gameMode === "multiplayer") return null;

  function handleClick(size) {
    updateBoardSize(size);
    playClickSound?.();
  }

  return (
    <div className={s.boardSelector}>
      {BOARD_SIZES.map((size) => (
        <button
          key={size}
          className={size === boardSize ? s.active : ""}
          onClick={() => handleClick(size)}
        >
          {size}x{size}
        </button>
      ))}
    </div>
  );
};

export default BoardSelector;
