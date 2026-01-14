"use client";

import { GITHUB_URL } from "@/data/links";
import { BUTTON_SOUND, soundFiles } from "@/data/sounds";
import usePreloadSounds from "@/hooks/app/usePreloadSounds";
import { useTranslations } from "next-intl";
import s from "./GitHubButton.module.scss";

const GitHubButton = () => {
  const t = useTranslations("header");
  const playSound = usePreloadSounds({ click: soundFiles.click });

  return (
    <a
      href={GITHUB_URL}
      target="_blank"
      className={s.button}
      rel="noreferrer"
      title={t("github")}
      onClick={() => playSound(BUTTON_SOUND)}
    >
      <svg aria-hidden="true">
        <use href={"/icons-sprite.svg#github"} />
      </svg>
      <span>GitHub</span>
    </a>
  );
};

export default GitHubButton;
