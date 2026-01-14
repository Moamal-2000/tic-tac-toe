"use client";

import { DIFFICULTY_OPTIONS } from "@/data/constants";
import { BUTTON_SOUND, soundFiles } from "@/data/sounds";
import usePreloadSounds from "@/hooks/app/usePreloadSounds";
import { useGlobalStore } from "@/stores/global.store/global.store";
import { useTranslations } from "next-intl";
import s from "./DifficultySelector.module.scss";

const DifficultySelector = () => {
  const t = useTranslations("main_menu");
  const { botDifficulty, updateGlobalState } = useGlobalStore();
  const playSound = usePreloadSounds({ click: soundFiles.click });

  function handleDifficultyChange(botDifficulty) {
    playSound(BUTTON_SOUND);
    updateGlobalState({ botDifficulty });
  }

  return (
    <div className={s.diffOptions}>
      {DIFFICULTY_OPTIONS.map((difficulty) => (
        <button
          type="button"
          className={`${s.option} ${
            botDifficulty === difficulty ? s.active : ""
          }`}
          key={difficulty}
          onClick={() => handleDifficultyChange(difficulty)}
        >
          {t(`difficulty.${difficulty}`)}
        </button>
      ))}
    </div>
  );
};

export default DifficultySelector;
