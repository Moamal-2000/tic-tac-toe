"use client";

import { useGlobalStore } from "@/stores/global.store/global.store";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import MultiPlayerUI from "./MultiPlayerUI/MultiPlayerUI";
import SinglePlayerUI from "./SinglePlayerUI/SinglePlayerUI";

const XOGame = () => {
  const gameMode = useGlobalStore((s) => s.gameMode);
  const hasGameStarted = useMultiplayerStore((s) => s.hasGameStarted);

  return (
    <>
      {(gameMode === "local" || gameMode === "computer") && <SinglePlayerUI />}
      {gameMode === "online" && hasGameStarted && <MultiPlayerUI />}
    </>
  );
};

export default XOGame;
