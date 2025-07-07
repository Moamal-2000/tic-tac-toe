"use client";

import { useGlobalStore } from "@/stores/global.store/global.store";
import MultiPlayerUI from "./MultiPlayerUI/MultiPlayerUI";
import SinglePlayerUI from "./SinglePlayerUI/SinglePlayerUI";

const XOGame = () => {
  const { gameMode } = useGlobalStore((s) => s);

  return (
    <>
      {gameMode === "local" && <SinglePlayerUI />}
      {gameMode === "online" && <MultiPlayerUI />}
    </>
  );
};

export default XOGame;
