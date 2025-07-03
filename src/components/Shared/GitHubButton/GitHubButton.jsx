"use client";

import usePreloadSounds from "@/hooks/usePreloadSounds";
import { BUTTON_SOUND, soundFiles } from "../../../data/sounds";
import SvgIcon from "../SvgIcon";
import s from "./GitHubButton.module.scss";

const GitHubButton = () => {
  const playSound = usePreloadSounds({ click: soundFiles.click });

  return (
    <a
      href="https://github.com/Moamal-2000/tic-tac-toe"
      target="_blank"
      className={s.button}
      rel="noreferrer"
      title="Visit GitHub Repository"
      onClick={() => playSound(BUTTON_SOUND)}
    >
      <SvgIcon name="github" />
      GitHub
    </a>
  );
};

export default GitHubButton;
