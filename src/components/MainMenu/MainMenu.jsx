"use client";

import { GAME_MODES_BUTTONS } from "@/data/staticData";
import SvgIcon from "../Shared/SvgIcon";
import s from "./MainMenu.module.scss";

const MainMenu = () => {
  return (
    <div className={s.menuOverlay}>
      <section className={s.mainMenu}>
        <div className={s.buttons}>
          {GAME_MODES_BUTTONS.map(({ label, iconName, id }) => (
            <button type="button" className={s.button} key={`${label}-${id}`}>
              <div className={s.iconHolder}>
                <SvgIcon name={iconName} />
              </div>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MainMenu;
