"use client";

import { useGlobalStore } from "@/stores/global.store/global.store";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import s from "./MatchAbortedModal.module.scss";

const MatchAbortedModal = () => {
  const router = useRouter();
  const { isOpponentDisconnected, resetMultiplayerState } =
    useMultiplayerStore();
  const { updateGameMode } = useGlobalStore();
  const backToMenuButtonRef = useRef(null);
  const t = useTranslations("modals.match_aborted_modal");

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
        <button
          type="button"
          onClick={handleBackToMenu}
          className={s.button}
          ref={backToMenuButtonRef}
        >
          {t("back_to_menu")}
        </button>
      </div>
    </div>
  );
};

export default MatchAbortedModal;
