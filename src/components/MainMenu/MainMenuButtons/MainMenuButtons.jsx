"use client";

import QuitGameModal from "@/components/Shared/Modals/QuitGameModal/QuitGameModal";
import { BUTTON_SOUND, soundFiles } from "@/data/sounds";
import { GAME_MODES_BUTTONS } from "@/data/staticData";
import usePreloadSounds from "@/hooks/app/usePreloadSounds";
import { socket } from "@/socket/socket";
import { useGlobalStore } from "@/stores/global.store/global.store";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useTranslations } from "next-intl";
import { useState } from "react";
import s from "./MainMenuButtons.module.scss";

const MainMenuButtons = () => {
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [pendingMode, setPendingMode] = useState(null);

  const { updateGameMode, updateGlobalState } = useGlobalStore();
  const {
    exploreMode,
    hasGameStarted,
    resetMultiplayerState,
    updateMultiplayerState,
  } = useMultiplayerStore();

  const playSound = usePreloadSounds({ click: soundFiles.click });
  const t = useTranslations("main_menu");

  function handleClick(mode) {
    if (mode === "return_to_match") {
      updateGameMode("online");
      updateGlobalState({ menuActive: false });
      playSound(BUTTON_SOUND);
      return;
    }

    if (exploreMode) {
      updateGameMode(mode);
      resetMultiplayerState();
      playSound(BUTTON_SOUND);
      return;
    }

    if (hasGameStarted) {
      setPendingMode(mode);
      setShowQuitModal(true);
      updateMultiplayerState({ exploreMode: false });
      playSound(BUTTON_SOUND);
      return;
    }

    updateGameMode(mode);
    updateMultiplayerState({ exploreMode: false });
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
    updateMultiplayerState({ exploreMode: false });
  }

  function handleCancelQuit() {
    setShowQuitModal(false);
    setPendingMode(null);
  }

  return (
    <>
      <div className={s.buttons}>
        {GAME_MODES_BUTTONS.map(({ iconName, mode, id }) => {
          if (mode === "return_to_match" && !hasGameStarted) return null;

          return (
            <button
              type="button"
              className={s.button}
              key={`${mode}-${id}`}
              onClick={() => handleClick(mode)}
            >
              <svg aria-hidden="true">
                <use href={`/icons-sprite.svg#${iconName}`} />
              </svg>
              {t(`game_modes.${mode}`)}
            </button>
          );
        })}
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
