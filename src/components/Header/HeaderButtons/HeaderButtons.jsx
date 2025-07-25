"use client";

import InstallPWAButton from "@/components/PWA/InstallPWAButton";
import Button from "@/components/Shared/Button/Button";
import { BUTTON_SOUND, soundFiles } from "@/data/sounds";
import usePreloadSounds from "@/hooks/usePreloadSounds";
import { useGlobalStore } from "@/stores/global.store/global.store";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
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
  const { updateMultiplayerState } = useMultiplayerStore((s) => s);
  const playSound = usePreloadSounds({ click: soundFiles.click });
  const isOnlineMode = gameMode === "online";

  function handleAboutClick() {
    toggleAboutModel();
    playSound(BUTTON_SOUND);
  }

  function handleResetClick() {
    if (isOnlineMode) {
      updateMultiplayerState({ isRematchMenuActive: true });
    } else resetStats();

    playSound(BUTTON_SOUND);
  }

  function handleMenuClick() {
    updateGameMode("");
    playSound(BUTTON_SOUND);
  }

  return (
    <div className={`${s.headerButtons} ${isOnlineMode ? s.onlineMode : ""}`}>
      <div className={s.wrapper1}>
        <BoardSelector playClickSound={() => playSound(BUTTON_SOUND)} />
        <PlayModeSelector playClickSound={() => playSound(BUTTON_SOUND)} />
      </div>

      <div className={s.wrapper2}>
        <FullscreenToggleButton
          playClickSound={() => playSound(BUTTON_SOUND)}
        />
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
