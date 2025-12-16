"use client";

import BackButton from "@/components/Shared/BackButton/BackButton";
import { BUTTON_SOUND, soundFiles } from "@/data/sounds";
import usePreloadSounds from "@/hooks/usePreloadSounds";
import { useGlobalStore } from "@/stores/global.store/global.store";
import s from "./LoadingMenu.module.scss";

const LoadingMenu = () => {
  const updateGlobalState = useGlobalStore((s) => s.updateGlobalState);
  const playSound = usePreloadSounds({ click: soundFiles.click });

  function handleBackButton() {
    updateGlobalState({ isWaitingForOpponent: false });
    playSound(BUTTON_SOUND);
  }

  return (
    <div className={s.loadingMenu}>
      <BackButton onClick={handleBackButton} />

      <div className={s.content}>
        <div className={s.loader}>
          <svg aria-hidden="true">
            <use href="/icons-sprite.svg#spinner" />
          </svg>
        </div>

        <h2>Finding Match...</h2>
        <p>Please wait while we connect you with another player</p>
      </div>
    </div>
  );
};

export default LoadingMenu;
