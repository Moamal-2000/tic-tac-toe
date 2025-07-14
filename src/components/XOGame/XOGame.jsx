"use client";

import { useGlobalStore } from "@/stores/global.store/global.store";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useEffect } from "react";
import { debugging } from "../../../debugging";
import MultiPlayerUI from "./MultiPlayerUI/MultiPlayerUI";
import SinglePlayerUI from "./SinglePlayerUI/SinglePlayerUI";

const XOGame = () => {
  const gameMode = useGlobalStore((s) => s.gameMode);
  const hasGameStarted = useMultiplayerStore((s) => s.hasGameStarted);

  const globalStore = useGlobalStore((s) => s);

  useEffect(() => {
    debugging(globalStore);
  }, []);

  return (
    <>
      {gameMode === "local" && <SinglePlayerUI />}
      {gameMode === "online" && hasGameStarted && <MultiPlayerUI />}
    </>
  );
};

export default XOGame;
