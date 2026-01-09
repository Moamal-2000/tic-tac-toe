"use client";

import Button from "@/components/Shared/Button/Button";
import { languagesMenu } from "@/i18n/config";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useGlobalStore } from "@/stores/global.store/global.store";
import { useTranslations } from "next-intl";
import Image from "next/image";
import s from "./LanguageSelector.module.scss";

const LanguageSelector = () => {
  const t = useTranslations("header");
  const { updateGlobalState, isLangMenuActive } = useGlobalStore();

  const router = useRouter();
  const pathname = usePathname();

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
    <div className={s.languageSection}>
      <Button onClick={handleToggleLangMenu}>
        {t("language")}
        <svg aria-hidden="true">
          <use href="/icons-sprite.svg#chevronDown"></use>
        </svg>
      </Button>

      <div
        className={`${s.languageSelect} ${isLangMenuActive ? s.active : ""}`}
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
      </div>
    </div>
  );
};
export default LanguageSelector;
