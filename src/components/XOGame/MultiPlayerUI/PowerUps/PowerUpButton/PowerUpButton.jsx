"use client";

import { soundFiles, UNSELECT_SOUND } from "@/data/sounds";
import usePreloadSounds from "@/hooks/usePreloadSounds";
import { socket } from "@/socket/socket";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useTranslations } from "next-intl";
import Image from "next/image";
import s from "./PowerUpButton.module.scss";

const PowerUpButton = ({
  data: { name, available, coolDown, player },
  disabled,
}) => {
  const powerUps = useMultiplayerStore((s) => s.powerUps);
  const t = useTranslations("power_ups");

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

    playSound(UNSELECT_SOUND, 0.3);
    // Emit to server - server handles toggle logic
    socket.emit("select-power-up", { ability: name });
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
      <span className={s.powerName}>{t(name)}</span>
      {coolDown > 0 && <span className={s.coolDown}>{coolDown}</span>}
    </button>
  );
};

export default PowerUpButton;
