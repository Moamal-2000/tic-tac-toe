"use client";

import { useGlobalStore } from "@/stores/global.store/global.store";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import s from "./MatchAbortedModal.module.scss";

const MatchAbortedModal = () => {
  const updateGameMode = useGlobalStore((s) => s.updateGameMode);
  const {
    isOpponentDisconnected,
    resetMultiplayerState,
    exploreMode,
    updateMultiplayerState,
    hasGameStarted,
  } = useMultiplayerStore();

  const router = useRouter();
  const closeButtonRef = useRef(null);
  const t = useTranslations("modals.match_aborted_modal");
  const tGlobal = useTranslations("global");

  useEffect(() => {
    if (!isOpponentDisconnected) return;
    if (closeButtonRef.current) closeButtonRef.current.focus();

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

  function handleClose() {
    updateMultiplayerState({ exploreMode: true });
  }

  function handleBackToMenu() {
    resetMultiplayerState();
    updateGameMode(null);
    router.push("/");
  }

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
          <button type="button" onClick={handleClose} ref={closeButtonRef}>
            {tGlobal("close")}
          </button>
          <button type="button" onClick={handleBackToMenu}>
            {tGlobal("main_menu")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchAbortedModal;
