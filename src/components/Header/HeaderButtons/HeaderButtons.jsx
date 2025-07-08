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
import PlayModeSelector from "./PlayModeSelector/PlayModeSelector";

const HeaderButtons = () => {
  const resetStats = useXOStore((s) => s.resetStats);
  const { toggleAboutModel, gameMode, updateGameMode } = useGlobalStore(
    (s) => s
  );
  const playSound = usePreloadSounds({ click: soundFiles.click });
  const isOnlineMode = gameMode === "online";

  function handleAboutClick() {
    toggleAboutModel();
    playSound(BUTTON_SOUND);
  }

  function handleResetClick() {
    if (isOnlineMode) {
      // send emit to server with event "rematch"
    } else resetStats();

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
        <PlayModeSelector playClickSound={() => playSound(BUTTON_SOUND)} />
      </div>

      <div className={s.wrapper2}>
        <InstallPWAButton playClickSound={() => playSound(BUTTON_SOUND)} />
        <Button onClick={handleAboutClick}>About</Button>
        <Button onClick={handleMenuClick}>Menu</Button>
        <Button onClick={handleResetClick}>
          {isOnlineMode ? "Rematch" : "Reset"}
        </Button>
      </div>
    </div>
  );
};

export default HeaderButtons;
