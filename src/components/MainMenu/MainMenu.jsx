"use client";

import { useGlobalStore } from "@/stores/global.store/global.store";
import LoadingMenu from "./LoadingMenu/LoadingMenu";
import s from "./MainMenu.module.scss";
import MainMenuButtons from "./MainMenuButtons/MainMenuButtons";
import MultiPlayerMenu from "./MultiPlayerMenu/MultiPlayerMenu";

const MainMenu = () => {
  const { isMainMenuActive, gameMode, isWaitingForOpponent } = useGlobalStore(
    (s) => s
  );

  if (!isMainMenuActive && !isWaitingForOpponent) return null;

  const displayMultiplayerMenu = gameMode === "online" && !isWaitingForOpponent;

  return (
    <div className={s.menuOverlay}>
      <section className={s.mainMenu}>
        {gameMode !== "online" && <MainMenuButtons />}
        {displayMultiplayerMenu && <MultiPlayerMenu />}
        {isWaitingForOpponent && <LoadingMenu />}
      </section>
    </div>
  );
};

export default MainMenu;
