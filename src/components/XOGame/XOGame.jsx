"use client";

import { useGlobalStore } from "@/stores/global.store/global.store";
import SinglePlayerUI from "./SinglePlayerUI/SinglePlayerUI";

const XOGame = () => {
  const { gameMode } = useGlobalStore((s) => s);

  return gameMode === "singleplayer" && <SinglePlayerUI />;
};

export default XOGame;
