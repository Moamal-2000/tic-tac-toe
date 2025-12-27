"use client";

import { DIFFICULTY_OPTIONS } from "@/data/constants";
import { BUTTON_SOUND, soundFiles } from "@/data/sounds";
import usePreloadSounds from "@/hooks/usePreloadSounds";
import { useGlobalStore } from "@/stores/global.store/global.store";
import s from "./DifficultySelector.module.scss";

const DifficultySelector = () => {
  const { aiDifficulty, updateGlobalState } = useGlobalStore();
  const playSound = usePreloadSounds({ click: soundFiles.click });

  function handleDifficultyChange(aiDifficulty) {
    playSound(BUTTON_SOUND);
    updateGlobalState({ aiDifficulty });
  }

  return (
    <div className={s.diffOptions}>
      {DIFFICULTY_OPTIONS.map(({ label, value }) => (
        <button
          type="button"
          className={`${s.option} ${aiDifficulty === value ? s.active : ""}`}
          key={value}
          onClick={() => handleDifficultyChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default DifficultySelector;
