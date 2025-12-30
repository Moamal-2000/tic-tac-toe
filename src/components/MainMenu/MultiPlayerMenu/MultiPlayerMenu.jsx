"use client";

import BackButton from "@/components/Shared/BackButton/BackButton";
import { BUTTON_SOUND, soundFiles } from "@/data/sounds";
import usePreloadSounds from "@/hooks/usePreloadSounds";
import { socket } from "@/socket/socket";
import { useGlobalStore } from "@/stores/global.store/global.store";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useEffect, useState } from "react";
import MPBoardSelection from "./MPBoardSelection/MPBoardSelection";
import s from "./MultiPlayerMenu.module.scss";

const MultiPlayerMenu = () => {
  const { updateGameMode, updateGlobalState } = useGlobalStore();
  const selectedBoardSize = useMultiplayerStore((s) => s.selectedBoardSize);
  const playSound = usePreloadSounds({ click: soundFiles.click });
  const [onlinePlayers, setOnlinePlayers] = useState(0);

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

      <div
        className={s.playerCount}
        aria-label={`Online players: ${onlinePlayers}`}
      >
        <span className={s.playerCountDot} />
        <span className={s.playerCountLabel}>Online Players</span>
        <span className={s.playerCountValue}>{onlinePlayers}</span>
      </div>

      <header className={s.header}>
        <div className={s.headerText}>
          <h1>Multiplayer Setup</h1>
          <p>Configure your game settings</p>
        </div>
      </header>

      <form className={s.mpForm} onSubmit={handleSubmit}>
        <MPBoardSelection />
        <button type="submit">Find Match</button>
      </form>
    </div>
  );
};

export default MultiPlayerMenu;
