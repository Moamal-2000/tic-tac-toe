"use client";

import { useGlobalStore } from "@/stores/global.store/global.store";
import s from "./MainMenu.module.scss";
import MainMenuButtons from "./MainMenuButtons/MainMenuButtons";

const MainMenu = () => {
  const { isMainMenuActive, gameMode } = useGlobalStore((s) => s);

  if (!isMainMenuActive) return null;

  return (
    <div className={s.menuOverlay}>
      <section className={s.mainMenu}>
        {gameMode !== "multiplayer" && <MainMenuButtons />}
      </section>
    </div>
  );
};

export default MainMenu;
