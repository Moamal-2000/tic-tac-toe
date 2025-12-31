"use client";

import QuitGameModal from "@/components/QuitGameModal/QuitGameModal";
import { BUTTON_SOUND, soundFiles } from "@/data/sounds";
import { GAME_MODES_BUTTONS } from "@/data/staticData";
import usePreloadSounds from "@/hooks/usePreloadSounds";
import { socket } from "@/socket/socket";
import { useGlobalStore } from "@/stores/global.store/global.store";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useState } from "react";
import s from "./MainMenuButtons.module.scss";

const MainMenuButtons = () => {
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [pendingMode, setPendingMode] = useState(null);

  const updateGameMode = useGlobalStore((s) => s.updateGameMode);
  const playSound = usePreloadSounds({ click: soundFiles.click });
  const { hasGameStarted, resetMultiplayerState } = useMultiplayerStore(
    (s) => s
  );

  function handleClick(mode) {
    // Check if player is in an active multiplayer game and trying to switch to local/computer
    if (hasGameStarted && (mode === "local" || mode === "computer")) {
      setPendingMode(mode);
      setShowQuitModal(true);
      playSound(BUTTON_SOUND);
      return;
    }

    updateGameMode(mode);
    playSound(BUTTON_SOUND);
  }

  function handleConfirmQuit() {
    // Disconnect from the current room
    socket.emit("leave-room");
    resetMultiplayerState();

    // Update game mode to the pending mode
    updateGameMode(pendingMode);

    // Reset modal state
    setShowQuitModal(false);
    setPendingMode(null);
  }

  function handleCancelQuit() {
    setShowQuitModal(false);
    setPendingMode(null);
  }

  return (
    <>
      <div className={s.buttons}>
        {GAME_MODES_BUTTONS.map(({ label, iconName, mode, id }) => (
          <button
            type="button"
            className={s.button}
            key={`${mode}-${id}`}
            onClick={() => handleClick(mode)}
          >
            <svg aria-hidden="true">
              <use href={`/icons-sprite.svg#${iconName}`} />
            </svg>
            {label}
          </button>
        ))}
      </div>
      <QuitGameModal
        isVisible={showQuitModal}
        onConfirm={handleConfirmQuit}
        onCancel={handleCancelQuit}
      />
    </>
  );
};

export default MainMenuButtons;
