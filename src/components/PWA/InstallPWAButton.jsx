"use client";

import s from "@/components/Shared/Button/Button.module.scss";
import { isInStandaloneMode, isIOS, isStandalone } from "@/functions/helper";
import { useEffect, useState } from "react";

const InstallPWAButton = ({ playClickSound }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [showIosInstall, setShowIosInstall] = useState(false);

  useEffect(() => {
    function handleBeforeInstallPrompt(event) {
      event.preventDefault();
      setDeferredPrompt(event);
    }

    function handleAppInstalled() {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
    }

    if (isStandalone()) setIsAppInstalled(true);
    else if (isIOS() && !isInStandaloneMode()) setShowIosInstall(true);

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  async function handleInstallClick() {
    playClickSound?.();
    if (!deferredPrompt) return false;

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    playClickSound?.();

    setDeferredPrompt(null);
  }

  const title = showIosInstall
    ? "Tap the share icon and select 'Add to Home Screen'"
    : "Install App";
  const showInstallButton =
    (deferredPrompt && !isAppInstalled) || showIosInstall;

  return (
    showInstallButton && (
      <button
        type="button"
        onClick={handleInstallClick}
        className={s.button}
        title={title}
      >
        {showIosInstall ? "Install App" : "Install"}
      </button>
    )
  );
};

export default InstallPWAButton;
