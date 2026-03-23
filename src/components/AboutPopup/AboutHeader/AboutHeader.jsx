"use client";

import CloseButton from "@/components/Shared/Buttons/CloseButton/CloseButton";
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

      <CloseButton
        onClick={handleCloseButtonClick}
        ariaLabel={t("close_aria")}
      />
    </header>
  );
};

export default AboutHeader;
