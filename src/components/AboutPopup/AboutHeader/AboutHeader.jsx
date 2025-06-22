"use client";

import { SYMBOL_X } from "@/data/constants";
import { useGlobalStore } from "@/stores/global.store/global.store";
import s from "./AboutHeader.module.scss";

const AboutHeader = ({ playSound }) => {
  const toggleAboutModel = useGlobalStore((s) => s.toggleAboutModel);

  function handleCloseButtonClick() {
    toggleAboutModel(false);
    playSound("click4");
  }

  return (
    <header className={s.header}>
      <h2 className={s.title}>
        About <br /> Tic Tac Toe
      </h2>

      <button
        type="button"
        className={s.closeBtn}
        onClick={handleCloseButtonClick}
        aria-label="Close About Popup"
      >
        {SYMBOL_X}
      </button>
    </header>
  );
};

export default AboutHeader;
