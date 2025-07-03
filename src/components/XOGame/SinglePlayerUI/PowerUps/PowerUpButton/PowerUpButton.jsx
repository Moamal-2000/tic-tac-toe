"use client";

import usePreloadSounds from "@/hooks/usePreloadSounds";
import { useXOStore } from "@/stores/xo.store/xo.store";
import { soundFiles } from "../../../../../data/sounds";
import s from "./PowerUpButton.module.scss";

const PowerUpButton = ({
  data: { id, name, icon, available, coolDown, player },
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
      key={id}
      type="button"
      className={classes}
      onClick={handleClick}
      disabled={disabled}
    >
      <span className={s.icon}>{icon}</span>
      <span className={s.powerName}>{name}</span>
      <span className={s.coolDown}>{coolDown}</span>
    </button>
  );
};

export default PowerUpButton;
