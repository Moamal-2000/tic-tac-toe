"use client";

import { useEffect, useRef } from "react";
import { useGlobalStore } from "@/stores/global.store/global.store";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useRouter } from "next/navigation";
import s from "./OpponentDisconnectedModal.module.scss";

const OpponentDisconnectedModal = () => {
  const router = useRouter();
  const { isOpponentDisconnected, resetMultiplayerState } = useMultiplayerStore(
    (state) => state
  );
  const { updateGameMode } = useGlobalStore();
  const backToMenuButtonRef = useRef(null);

  function handleBackToMenu() {
    resetMultiplayerState();
    updateGameMode(null);
    router.push("/");
  }

  useEffect(() => {
    if (!isOpponentDisconnected) {
      return;
    }

    if (backToMenuButtonRef.current) {
      backToMenuButtonRef.current.focus();
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        handleBackToMenu();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpponentDisconnected]);

  if (!isOpponentDisconnected) return null;

  return (
    <div
      className={s.modalOverlay}
      role="presentation"
    >
      <div
        className={s.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="opponent-disconnected-title"
        aria-describedby="opponent-disconnected-description"
      >
        <h2 id="opponent-disconnected-title">Opponent Disconnected!</h2>
        <p id="opponent-disconnected-description">
          Your opponent has withdrawn from the game. You will be returned to the
          main menu.
        </p>
        <button
          type="button"
          onClick={handleBackToMenu}
          className={s.button}
          ref={backToMenuButtonRef}
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
};

export default OpponentDisconnectedModal;
