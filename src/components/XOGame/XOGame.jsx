"use client";

import { useGlobalStore } from "@/stores/global.store/global.store";
import MultiPlayerUI from "./MultiPlayerUI/MultiPlayerUI";
import SinglePlayerUI from "./SinglePlayerUI/SinglePlayerUI";

const XOGame = () => {
  const { gameMode } = useGlobalStore((s) => s);

  return (
    <>
      {gameMode === "singleplayer" && <SinglePlayerUI />}
      {gameMode === "multiplayer" && <MultiPlayerUI />}
    </>
  );
};

export default XOGame;
