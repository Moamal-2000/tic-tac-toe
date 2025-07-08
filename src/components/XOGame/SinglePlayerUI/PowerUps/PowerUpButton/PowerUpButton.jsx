"use client";

import { soundFiles } from "@/data/sounds";
import usePreloadSounds from "@/hooks/usePreloadSounds";
import { useXOStore } from "@/stores/xo.store/xo.store";
import Image from "next/image";
import s from "./PowerUpButton.module.scss";

const PowerUpButton = ({
  data: { name, available, coolDown, player },
  disabled,
}) => {
  const { selectPowerUp, powerUps, unSelectPower } = useXOStore((s) => s);
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
      unSelectPower(playSound);
      return;
    }

    selectPowerUp({ selectedPower: name, whoUsingPower: player, playSound });
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
