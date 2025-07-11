"use client";

import { PLAY_MODES } from "@/data/constants";
import { useGlobalStore } from "@/stores/global.store/global.store";
import { useXOStore } from "@/stores/xo.store/xo.store";
import s from "./PlayModeSelector.module.scss";

const PlayModeSelector = ({ playClickSound }) => {
  const {
    playMode,
    updateXOStoreState,
    startNewGame,
    boardSize,
    updateBoardSize,
  } = useXOStore((s) => s);
  const gameMode = useGlobalStore((s) => s.gameMode);

  if (gameMode === "online") return null;

  function handleClick(type) {
    const isAutoHideMode = type === "autoHideMode";
    const isBoardSize5 = boardSize === 5;

    if (isAutoHideMode && isBoardSize5) updateBoardSize(4);

    playClickSound?.();
    updateXOStoreState({ playMode: type });
    startNewGame();
  }

  return (
    <div className={s.playModeSelector}>
      {PLAY_MODES.map(({ name, type, id }) => (
        <button
          key={`${type}-${id}`}
          className={type === playMode ? s.active : ""}
          onClick={() => handleClick(type)}
        >
          {name}
        </button>
      ))}
    </div>
  );
};

export default PlayModeSelector;
