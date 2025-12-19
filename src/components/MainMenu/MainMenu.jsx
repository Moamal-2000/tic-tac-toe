"use client";

import { useGlobalStore } from "@/stores/global.store/global.store";
import LoadingMenu from "./LoadingMenu/LoadingMenu";
import s from "./MainMenu.module.scss";
import MainMenuButtons from "./MainMenuButtons/MainMenuButtons";
import MultiPlayerMenu from "./MultiPlayerMenu/MultiPlayerMenu";

const MainMenu = () => {
  const { isMainMenuActive, gameMode, isWaitingForOpponent } = useGlobalStore();

  if (!isMainMenuActive && !isWaitingForOpponent) return null;

  const displayMainMenuButtons = gameMode !== "online";
  const displayMultiplayerMenu = gameMode === "online" && !isWaitingForOpponent;

  const menuButtonsClass = displayMainMenuButtons ? s.menuButtons : "";

  return (
    <div className={s.menuOverlay}>
      <section className={`${s.mainMenu} ${menuButtonsClass}`}>
        {displayMainMenuButtons && <MainMenuButtons />}
        {displayMultiplayerMenu && <MultiPlayerMenu />}
        {isWaitingForOpponent && <LoadingMenu />}
      </section>
    </div>
  );
};

export default MainMenu;
