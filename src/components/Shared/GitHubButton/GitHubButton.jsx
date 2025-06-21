"use client";

import { soundFiles } from "@/data/staticData";
import usePreloadSounds from "@/hooks/usePreloadSounds";
import SvgIcon from "../SvgIcon";
import s from "./GitHubButton.module.scss";

const GitHubButton = () => {
  const play = usePreloadSounds({ click4: soundFiles.click4 });

  return (
    <a
      href="https://github.com/Moamal-2000/tic-tac-toe"
      target="_blank"
      className={s.button}
      rel="noreferrer"
      title="Visit GitHub Repository"
      onClick={() => play("click4")}
    >
      <SvgIcon name="github" />
      GitHub
    </a>
  );
};

export default GitHubButton;
