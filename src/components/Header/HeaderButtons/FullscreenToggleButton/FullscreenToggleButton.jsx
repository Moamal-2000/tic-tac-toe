"use client";

import { KEY_DEBOUNCE_DELAY_MS } from "@/data/constants";
import useFunctionOnKey from "@/hooks/helper/useFunctionOnKey";
import { enterFullScreen, isFullScreenSupported } from "@/lib/helper";
import { useTranslations } from "next-intl";
import { useState } from "react";
import s from "./FullscreenToggleButton.module.scss";

const FullscreenToggleButton = ({ playClickSound }) => {
  const t = useTranslations("header");
  const [isFullScreen, setIsFullScreen] = useState(false);
  useFunctionOnKey(toggleFullScreen, ["KeyF"], KEY_DEBOUNCE_DELAY_MS, true);
  const title = t(`fullscreen.${isFullScreen ? "exit" : "enter"}`);

  function toggleFullScreen() {
    playClickSound?.();
    setIsFullScreen((prevValue) => !prevValue);
    if (document?.fullscreenElement) document?.exitFullscreen();
    enterFullScreen();
  }

  return (
    isFullScreenSupported() && (
      <button
        type="button"
        className={s.fullscreenBtn}
        title={title}
        onClick={toggleFullScreen}
      >
        <svg aria-hidden="true">
          <use
            href={`/icons-sprite.svg#${isFullScreen ? "compress" : "expand"}`}
          />
        </svg>
      </button>
    )
  );
};

export default FullscreenToggleButton;
