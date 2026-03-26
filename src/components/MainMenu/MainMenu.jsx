"use client";

import { useGlobalStore } from "@/stores/global.store/global.store";
import LoadingMenu from "./LoadingMenu/LoadingMenu";
import s from "./MainMenu.module.scss";
import MainMenuButtons from "./MainMenuButtons/MainMenuButtons";
import MultiPlayerMenu from "./MultiPlayerMenu/MultiPlayerMenu";

const MainMenu = () => {
  const { waitingOpponent, menuActive, gameMode, is404 } = useGlobalStore();

  if ((!menuActive && !waitingOpponent) || is404) return null;

  const showMainButtons = gameMode !== "online";
  const showMultiplayerMenu = gameMode === "online" && !waitingOpponent;

  const menuLayoutClass = showMainButtons ? s.menuButtons : "";

  return (
    <div className={s.menuOverlay}>
      <section className={`${s.mainMenu} ${menuLayoutClass}`}>
        {showMainButtons && <MainMenuButtons />}
        {showMultiplayerMenu && <MultiPlayerMenu />}
        {waitingOpponent && <LoadingMenu />}
      </section>
    </div>
  );
};

export default MainMenu;
