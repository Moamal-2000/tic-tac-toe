"use client";

import InstallPWAButton from "@/components/PWA/InstallPWAButton";
import Button from "@/components/Shared/Button/Button";
import { BUTTON_SOUND, soundFiles } from "@/data/sounds";
import usePreloadSounds from "@/hooks/usePreloadSounds";
import { useGlobalStore } from "@/stores/global.store/global.store";
import { useXOStore } from "@/stores/xo.store/xo.store";
import BoardSelector from "./BoardSelector/BoardSelector";
import FullscreenToggleButton from "./FullscreenToggleButton/FullscreenToggleButton";
import s from "./HeaderButtons.module.scss";

const HeaderButtons = () => {
  const resetStats = useXOStore((s) => s.resetStats);
  const { toggleAboutModel, updateGameMode } = useGlobalStore((s) => s);
  const playSound = usePreloadSounds({ click: soundFiles.click });

  function handleAboutClick() {
    toggleAboutModel();
    playSound(BUTTON_SOUND);
  }

  function handleResetClick() {
    resetStats();
    playSound(BUTTON_SOUND);
  }

  function handleMenuClick() {
    updateGameMode("");
    playSound(BUTTON_SOUND);
  }

  return (
    <div className={s.headerButtons}>
      <div className={s.wrapper1}>
        <FullscreenToggleButton
          playClickSound={() => playSound(BUTTON_SOUND)}
        />
        <BoardSelector playClickSound={() => playSound(BUTTON_SOUND)} />
      </div>

      <div className={s.wrapper2}>
        <InstallPWAButton playClickSound={() => playSound(BUTTON_SOUND)} />
        <Button onClick={handleAboutClick}>About</Button>
        <Button onClick={handleResetClick}>Reset</Button>
        <Button onClick={handleMenuClick}>Menu</Button>
      </div>
    </div>
  );
};

export default HeaderButtons;
