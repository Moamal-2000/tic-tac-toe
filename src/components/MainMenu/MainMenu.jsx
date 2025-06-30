"use client";

import { useGlobalStore } from "@/stores/global.store/global.store";
import s from "./MainMenu.module.scss";
import MainMenuButtons from "./MainMenuButtons/MainMenuButtons";
import MultiPlayerMenu from "./MultiPlayerMenu/MultiPlayerMenu";

const MainMenu = () => {
  const { isMainMenuActive, gameMode } = useGlobalStore((s) => s);

  if (!isMainMenuActive) return null;

  return (
    <div className={s.menuOverlay}>
      <section className={s.mainMenu}>
        {gameMode !== "multiplayer" && <MainMenuButtons />}
        {gameMode === "multiplayer" && <MultiPlayerMenu />}
      </section>
    </div>
  );
};

export default MainMenu;
