"use client";

import { useGlobalStore } from "@/stores/global.store/global.store";
import s from "./MainMenu.module.scss";
import MainMenuButtons from "./MainMenuButtons/MainMenuButtons";

const MainMenu = () => {
  const isMainMenuActive = useGlobalStore((s) => s.isMainMenuActive);

  if (!isMainMenuActive) return null;

  return (
    <div className={s.menuOverlay}>
      <section className={s.mainMenu}>
        <MainMenuButtons />
      </section>
    </div>
  );
};

export default MainMenu;
