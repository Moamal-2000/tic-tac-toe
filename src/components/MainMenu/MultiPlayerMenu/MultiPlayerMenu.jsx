"use client";

import BackButton from "@/components/Shared/BackButton/BackButton";
import { BUTTON_SOUND, soundFiles } from "@/data/sounds";
import usePreloadSounds from "@/hooks/usePreloadSounds";
import { socket } from "@/socket/socket";
import { useGlobalStore } from "@/stores/global.store/global.store";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import MPBoardSelection from "./MPBoardSelection/MPBoardSelection";
import s from "./MultiPlayerMenu.module.scss";

const MultiPlayerMenu = () => {
  const t = useTranslations("main_menu");

  const { updateGameMode, updateGlobalState } = useGlobalStore();
  const selectedBoardSize = useMultiplayerStore((s) => s.selectedBoardSize);
  const [onlinePlayers, setOnlinePlayers] = useState(0);

  const playSound = usePreloadSounds({ click: soundFiles.click });

  function handleSubmit(event) {
    event?.preventDefault();
    socket.emit("matchmaking", selectedBoardSize);
    updateGlobalState({ waitingOpponent: true });
    playSound(BUTTON_SOUND);
  }

  function handleBackButton() {
    playSound(BUTTON_SOUND);
    updateGameMode(null);
  }

  useEffect(() => {
    // Request initial count
    socket.emit("get-online-players");

    const handleOnlinePlayersCount = ({ count }) => {
      setOnlinePlayers(count);
    };

    socket.on("online-players-count", handleOnlinePlayersCount);

    return () => {
      socket.off("online-players-count", handleOnlinePlayersCount);
    };
  }, []);

  return (
    <div className={s.mpContent}>
      <BackButton onClick={handleBackButton} />

      <div className={s.playerCount}>
        <span className={s.playerCountDot} />
        <span className={s.playerCountLabel}>
          {t("multiplayer.setup.online_players")}
        </span>
        <span className={s.playerCountValue}>{onlinePlayers}</span>
      </div>

      <header className={s.header}>
        <div className={s.headerText}>
          <h1>{t("multiplayer.setup.title")}</h1>
          <p>{t("multiplayer.setup.subtitle")}</p>
        </div>
      </header>

      <form className={s.mpForm} onSubmit={handleSubmit}>
        <MPBoardSelection />
        <button type="submit">{t("multiplayer.setup.find_match")}</button>
      </form>
    </div>
  );
};

export default MultiPlayerMenu;
