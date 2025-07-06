"use client";

import SvgIcon from "@/components/Shared/SvgIcon";
import { BUTTON_SOUND } from "@/data/sounds";
import { useGlobalStore } from "@/stores/global.store/global.store";
import s from "./AboutHeader.module.scss";

const AboutHeader = ({ playSound }) => {
  const toggleAboutModel = useGlobalStore((s) => s.toggleAboutModel);

  function handleCloseButtonClick() {
    toggleAboutModel(false);
    playSound(BUTTON_SOUND);
  }

  return (
    <header className={s.header}>
      <h2 className={s.title}>About Tic Tac Toe</h2>

      <button
        type="button"
        className={s.closeBtn}
        onClick={handleCloseButtonClick}
        aria-label="Close About Popup"
      >
        <SvgIcon name="x-symbol" />
      </button>
    </header>
  );
};

export default AboutHeader;
