"use client";

import { BUTTON_SOUND, soundFiles } from "@/data/sounds";
import usePreloadSounds from "@/hooks/usePreloadSounds";
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
      <svg aria-hidden="true">
        <use href={"/icons-sprite.svg#github"} />
      </svg>
      GitHub
    </a>
  );
};

export default GitHubButton;
