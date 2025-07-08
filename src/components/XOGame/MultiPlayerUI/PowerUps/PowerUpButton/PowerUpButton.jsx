"use client";

import { soundFiles, UNSELECT_SOUND } from "@/data/sounds";
import usePreloadSounds from "@/hooks/usePreloadSounds";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import Image from "next/image";
import s from "./PowerUpButton.module.scss";

const PowerUpButton = ({
  data: { name, available, coolDown, player },
  disabled,
}) => {
  const { powerUps } = useMultiplayerStore((s) => s);
  const { selectedPower, whoUsingPower } = powerUps;
  const isSelected = selectedPower === name && whoUsingPower === player;
  const playSound = usePreloadSounds({ unselect: soundFiles.unselect });

  const classes = [
    s.powerUp,
    !available ? s.disabled : "",
    player === "player1" ? s.player1 : "",
    isSelected ? s.selected : "",
  ].join(" ");

  function handleClick() {
    if (!available) return;

    if (isSelected) {
      // reset: selectedPower, whoUsingPower (emit to server)
      playSound(UNSELECT_SOUND, 0.3);
      return;
    }

    playSound(UNSELECT_SOUND, 0.3);
    // set: selectedPower, whoUsingPower (emit to server)
  }

  return (
    <button
      key={name}
      type="button"
      className={classes}
      onClick={handleClick}
      disabled={disabled}
    >
      <Image
        className={s.icon}
        src={`/images/${name}-icon.png`}
        alt={name}
        width={22}
        height={21}
        priority
      />
      <span className={s.powerName}>{name}</span>
      <span className={s.coolDown}>{coolDown}</span>
    </button>
  );
};

export default PowerUpButton;
