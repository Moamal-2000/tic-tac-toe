"use client";

import { BUTTON_SOUND, soundFiles } from "@/data/sounds";
import usePreloadSounds from "@/hooks/usePreloadSounds";
import { useGlobalStore } from "@/stores/global.store/global.store";
import { useRef } from "react";
import AboutHeader from "./AboutHeader/AboutHeader";
import s from "./AboutPopup.module.scss";
import GameObjectiveCard from "./GameObjectiveCard/GameObjectiveCard";
import HowToPlayCard from "./HowToPlayCard/HowToPlayCard";
import PowerUpsExplanationCard from "./PowerUpsExplanationCard/PowerUpsExplanationCard";
import WinningExplanationCard from "./WinningExplanationCard/WinningExplanationCard";

const AboutPopup = () => {
  const { isAboutModelActive, toggleAboutModel } = useGlobalStore((s) => s);
  const aboutArticleRef = useRef(null);
  const showClass = isAboutModelActive ? s.show : "";
  const playSound = usePreloadSounds({ click: soundFiles.click });

  function handleOverlayClick(event) {
    const popupElement = aboutArticleRef.current;
    const clickedInsidePopup = popupElement.contains(event.target);

    if (clickedInsidePopup) return;
    toggleAboutModel(false);
    playSound(BUTTON_SOUND);
  }

  if (!isAboutModelActive) return null;

  return (
    <div
      className={`${s.aboutOverlay} ${showClass}`}
      onClick={handleOverlayClick}
    >
      <article className={s.aboutArticle} ref={aboutArticleRef}>
        <AboutHeader playSound={playSound} />
        <GameObjectiveCard />
        <HowToPlayCard />
        <WinningExplanationCard />
        <PowerUpsExplanationCard />
      </article>
    </div>
  );
};

export default AboutPopup;
