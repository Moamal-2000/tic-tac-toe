"use client";

import { BOARD_SIZES } from "@/data/constants";
import { useGlobalStore } from "@/stores/global.store/global.store";
import { useXOStore } from "@/stores/xo.store/xo.store";
import s from "./BoardSelector.module.scss";

const BoardSelector = ({ playClickSound }) => {
  const { boardSize, updateBoardSize, playMode } = useXOStore();
  const gameMode = useGlobalStore((s) => s.gameMode);

  if (gameMode === "online") return null;

  function handleClick(size) {
    updateBoardSize(size);
    playClickSound?.();
  }

  return (
    <div className={s.boardSelector}>
      {BOARD_SIZES.map((size) => {
        if (playMode === "autoHideMode" && size === 5) return null;

        return (
          <button
            key={size}
            className={size === boardSize ? s.active : ""}
            onClick={() => handleClick(size)}
          >
            {size}x{size}
          </button>
        );
      })}
    </div>
  );
};

export default BoardSelector;
