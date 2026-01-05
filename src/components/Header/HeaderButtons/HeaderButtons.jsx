"use client";

import InstallPWAButton from "@/components/PWA/InstallPWAButton";
import Button from "@/components/Shared/Button/Button";
import { BUTTON_SOUND, soundFiles } from "@/data/sounds";
import usePreloadSounds from "@/hooks/usePreloadSounds";
import { languagesMenu } from "@/i18n/config";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useGlobalStore } from "@/stores/global.store/global.store";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useXOStore } from "@/stores/xo.store/xo.store";
import { useTranslations } from "next-intl";
import Image from "next/image";
import BoardSelector from "./BoardSelector/BoardSelector";
import FullscreenToggleButton from "./FullscreenToggleButton/FullscreenToggleButton";
import s from "./HeaderButtons.module.scss";
import PlayModeSelector from "./PlayModeSelector/PlayModeSelector";
import VolumeButton from "./VolumeButton/VolumeButton";

const HeaderButtons = () => {
  const t = useTranslations("header");
  const resetStats = useXOStore((s) => s.resetStats);
  const {
    toggleAboutModel,
    gameMode,
    updateGameMode,
    isLangMenuActive,
    updateGlobalState,
  } = useGlobalStore();
  const { updateMultiplayerState } = useMultiplayerStore((s) => s);

  const playSound = usePreloadSounds({ click: soundFiles.click });
  const isOnlineMode = gameMode === "online";

  const pathname = usePathname();
  const router = useRouter();

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

  function handleToggleLangMenu({ isOpen } = {}) {
    updateGlobalState({
      isLangMenuActive: isOpen !== undefined ? isOpen : !isLangMenuActive,
    });
  }

  function handleLangClick(countryCode) {
    router.replace(pathname, { locale: countryCode });
    handleToggleLangMenu({ isOpen: false });
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
        <div className={s.languageSection}>
          <Button onClick={handleToggleLangMenu}>
            {t("language")}
            <svg aria-hidden="true">
              <use href="/icons-sprite.svg#chevronDown"></use>
            </svg>
          </Button>

          <div
            className={`${s.languageSelect} ${
              isLangMenuActive ? s.active : ""
            }`}
          >
            {languagesMenu.map(({ code, name, flag, alt }) => (
              <button
                key={code}
                type="button"
                onClick={() => handleLangClick(code)}
              >
                {name}
                <Image src={flag} alt={alt} width={20} height={12} />
              </button>
            ))}
            {/* <button>
              English
              <Image
                src="/flags/usa.webp"
                alt="USA flag"
                width={20}
                height={12}
              />
            </button>
            <button>
              العربية
              <Image
                src="/flags/saudi.webp"
                alt="Saudi flag"
                width={20}
                height={12}
              />
            </button> */}
          </div>
        </div>
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
