"use client";

import { useGlobalStore } from "@/stores/global.store/global.store";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import s from "./MatchAbortedModal.module.scss";

const MatchAbortedModal = () => {
  const {
    isOpponentDisconnected,
    resetMultiplayerState,
    exploreMode,
    updateMultiplayerState,
    hasGameStarted,
  } = useMultiplayerStore();
  const { updateGameMode } = useGlobalStore();

  const router = useRouter();
  const backToMenuButtonRef = useRef(null);
  const t = useTranslations("modals.match_aborted_modal");

  function handleClose() {
    updateMultiplayerState({ exploreMode: true });
  }

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

  const hideComponent =
    !isOpponentDisconnected || exploreMode || !hasGameStarted;

  if (hideComponent) return null;

  return (
    <div className={s.modalOverlay} role="presentation">
      <div
        className={s.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="match-aborted-title"
        aria-describedby="match-aborted-description"
      >
        <h2 id="match-aborted-title">{t("title")}</h2>
        <p id="match-aborted-description">{t("description")}</p>

        <div className={s.buttons}>
          <button type="button" onClick={handleClose}>
            Close
          </button>
          <button
            type="button"
            onClick={handleBackToMenu}
            ref={backToMenuButtonRef}
          >
            {t("back_to_menu")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchAbortedModal;
