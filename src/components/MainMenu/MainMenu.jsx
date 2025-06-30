"use client";

import { GAME_MODES_BUTTONS } from "@/data/staticData";
import { useGlobalStore } from "@/stores/global.store/global.store";
import SvgIcon from "../Shared/SvgIcon";
import s from "./MainMenu.module.scss";

const MainMenu = () => {
  const { updateGameMode, isMainMenuActive } = useGlobalStore((s) => s);

  if (!isMainMenuActive) return null;

  return (
    <div className={s.menuOverlay}>
      <section className={s.mainMenu}>
        <div className={s.buttons}>
          {GAME_MODES_BUTTONS.map(({ label, iconName, id }) => (
            <button
              type="button"
              className={s.button}
              key={`${label}-${id}`}
              onClick={() => updateGameMode(label)}
            >
              <SvgIcon name={iconName} />
              {label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MainMenu;
