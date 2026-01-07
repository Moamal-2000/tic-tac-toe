"use client";

import { BUTTON_SOUND } from "@/data/sounds";
import { useGlobalStore } from "@/stores/global.store/global.store";
import { useTranslations } from "next-intl";
import s from "./AboutHeader.module.scss";

const AboutHeader = ({ playSound }) => {
  const toggleAboutModel = useGlobalStore((s) => s.toggleAboutModel);
  const t = useTranslations("about");

  function handleCloseButtonClick() {
    toggleAboutModel(false);
    playSound(BUTTON_SOUND);
  }

  return (
    <header className={s.header}>
      <h2 className={s.title}>{t("title")}</h2>

      <button
        type="button"
        className={s.closeBtn}
        onClick={handleCloseButtonClick}
        aria-label={t("close_aria")}
      >
        <svg aria-hidden="true">
          <use href="/icons-sprite.svg#x-symbol" />
        </svg>
      </button>
    </header>
  );
};

export default AboutHeader;
