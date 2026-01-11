"use client";

import Button from "@/components/Shared/Button/Button";
import { BUTTON_SOUND, soundFiles } from "@/data/sounds";
import useEventListener from "@/hooks/useEventListener";
import usePreloadSounds from "@/hooks/usePreloadSounds";
import { languagesMenu } from "@/i18n/config";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useGlobalStore } from "@/stores/global.store/global.store";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRef } from "react";
import s from "./LanguageSelector.module.scss";

const LanguageSelector = () => {
  const t = useTranslations("global");
  const { updateGlobalState, isLangMenuActive } = useGlobalStore();

  const router = useRouter();
  const pathname = usePathname();
  const playSound = usePreloadSounds({ click: soundFiles.click });

  const langContainerRef = useRef(null);
  const langMenuRef = useRef(null);

  useEventListener(
    typeof window !== "undefined" ? window : null,
    "click",
    handleClickOutside
  );

  function handleClickOutside(event) {
    const isClickOutsideLangMenu = !langContainerRef.current.contains(
      event.target
    );

    if (isClickOutsideLangMenu) updateGlobalState({ isLangMenuActive: false });
  }

  function handleToggleLangMenu({ isOpen, sound = true } = {}) {
    updateGlobalState({
      isLangMenuActive: isOpen !== undefined ? isOpen : !isLangMenuActive,
    });

    sound && playSound(BUTTON_SOUND);
  }

  function handleLangClick(countryCode) {
    router.replace(pathname, { locale: countryCode });
    handleToggleLangMenu({ isOpen: false });
  }

  return (
    <div className={s.languageSection} ref={langContainerRef}>
      <Button onClick={handleToggleLangMenu}>
        {t("language")}
        <svg aria-hidden="true">
          <use href="/icons-sprite.svg#chevronDown"></use>
        </svg>
      </Button>

      <div
        className={`${s.languageSelect} ${isLangMenuActive ? s.active : ""}`}
        ref={langMenuRef}
        onBlur={() => handleToggleLangMenu({ isOpen: false, sound: false })}
        onFocus={() => handleToggleLangMenu({ isOpen: true, sound: false })}
      >
        {languagesMenu.map(({ code, name, flag, alt }) => (
          <button
            key={code}
            type="button"
            onClick={() => handleLangClick(code)}
          >
            {t(`languages.${name.toLowerCase()}`)}
            <Image src={flag} alt={alt} width={20} height={12} />
          </button>
        ))}
      </div>
    </div>
  );
};
export default LanguageSelector;
