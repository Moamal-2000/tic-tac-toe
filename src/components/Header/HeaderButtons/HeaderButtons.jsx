"use client";

import InstallPWAButton from "@/components/PWA/InstallPWAButton";
import Button from "@/components/Shared/Button/Button";
import { BUTTON_SOUND, soundFiles } from "@/data/sounds";
import usePreloadSounds from "@/hooks/app/usePreloadSounds";
import { useGlobalStore } from "@/stores/global.store/global.store";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useXOStore } from "@/stores/xo.store/xo.store";
import { useTranslations } from "next-intl";
import BoardSelector from "./BoardSelector/BoardSelector";
import FullscreenToggleButton from "./FullscreenToggleButton/FullscreenToggleButton";
import s from "./HeaderButtons.module.scss";
import LanguageSelector from "./LanguageSelector/LanguageSelector";
import PlayModeSelector from "./PlayModeSelector/PlayModeSelector";
import VolumeButton from "./VolumeButton/VolumeButton";

const HeaderButtons = () => {
  const t = useTranslations("header");

  const { toggleAboutModel, gameMode, updateGameMode } = useGlobalStore();
  const resetStats = useXOStore((s) => s.resetStats);
  const updateMultiplayerState = useMultiplayerStore(
    (s) => s.updateMultiplayerState,
  );

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
        <VolumeButton />
        <InstallPWAButton playClickSound={() => playSound(BUTTON_SOUND)} />
        <LanguageSelector />
        <Button onClick={handleAboutClick}>{t("about")}</Button>
        <Button onClick={handleMenuClick}>{t("menu")}</Button>
        <Button onClick={handleResetClick}>
          {isOnlineMode ? t("rematch") : t("reset")}
        </Button>
      </div>
    </div>
  );
};

export default HeaderButtons;
