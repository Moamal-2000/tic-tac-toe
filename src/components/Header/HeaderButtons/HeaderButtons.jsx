"use client";

import InstallPWAButton from "@/components/PWA/InstallPWAButton";
import Button from "@/components/Shared/Button/Button";
import { soundFiles } from "@/data/staticData";
import usePreloadSounds from "@/hooks/usePreloadSounds";
import { useGlobalStore } from "@/stores/global.store/global.store";
import { useXOStore } from "@/stores/xo.store/xo.store";
import BoardSelector from "./BoardSelector/BoardSelector";
import FullscreenToggleButton from "./FullscreenToggleButton/FullscreenToggleButton";
import s from "./HeaderButtons.module.scss";

const HeaderButtons = () => {
  const resetStats = useXOStore((s) => s.resetStats);
  const toggleAboutModel = useGlobalStore((s) => s.toggleAboutModel);
  const play = usePreloadSounds({ click4: soundFiles.click4 });

  function handleAboutClick() {
    toggleAboutModel();
    play("click4");
  }

  function handleResetClick() {
    resetStats();
    play("click4");
  }

  return (
    <div className={s.headerButtons}>
      <div className={s.wrapper1}>
        <FullscreenToggleButton playClickSound={() => play("click4")} />
        <BoardSelector playClickSound={() => play("click4")} />
      </div>

      <div className={s.wrapper2}>
        <InstallPWAButton playClickSound={() => play("click4")} />
        <Button onClick={handleAboutClick}>About</Button>
        <Button onClick={handleResetClick}>Reset</Button>
      </div>
    </div>
  );
};

export default HeaderButtons;
