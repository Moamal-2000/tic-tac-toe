"use client";

import { useGlobalStore } from "@/stores/global.store/global.store";
import DifficultySelector from "./DifficultySelector/DifficultySelector";
import LoadingMenu from "./LoadingMenu/LoadingMenu";
import s from "./MainMenu.module.scss";
import MainMenuButtons from "./MainMenuButtons/MainMenuButtons";
import MultiPlayerMenu from "./MultiPlayerMenu/MultiPlayerMenu";

const MainMenu = () => {
  const { waitingOpponent, menuActive, gameMode } = useGlobalStore();

  if (!menuActive && !waitingOpponent) return null;

  const showMainButtons = gameMode !== "online";
  const showMultiplayerMenu = gameMode === "online" && !waitingOpponent;

  const menuLayoutClass = showMainButtons ? s.menuButtons : "";

  return (
    <div className={s.menuOverlay}>
      <section className={`${s.mainMenu} ${menuLayoutClass}`}>
        {showMultiplayerMenu || (!waitingOpponent && <DifficultySelector />)}
        {showMainButtons && <MainMenuButtons />}
        {showMultiplayerMenu && <MultiPlayerMenu />}
        {waitingOpponent && <LoadingMenu />}
      </section>
    </div>
  );
};

export default MainMenu;
