"use client";

import { BASE_URL, IS_PRODUCTION, SOCKET_SERVER_URL } from "@/data/env";
import { useGlobalStore } from "@/stores/global.store/global.store";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import MultiPlayerUI from "./MultiPlayerUI/MultiPlayerUI";
import SinglePlayerUI from "./SinglePlayerUI/SinglePlayerUI";

const XOGame = () => {
  const gameMode = useGlobalStore((s) => s.gameMode);
  const hasGameStarted = useMultiplayerStore((s) => s.hasGameStarted);

  console.log("Testing", { IS_PRODUCTION, BASE_URL, SOCKET_SERVER_URL });

  return (
    <>
      {gameMode === "local" && <SinglePlayerUI />}
      {gameMode === "online" && hasGameStarted && <MultiPlayerUI />}
    </>
  );
};

export default XOGame;
