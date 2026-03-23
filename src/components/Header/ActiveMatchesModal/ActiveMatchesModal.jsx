"use client";

import XOBoard from "@/components/XOGame/MultiPlayerUI/XOBoard/XOBoard";
import { MAX_LIVE_MATCHES } from "@/data/constants";
import { socket } from "@/socket/socket";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import s from "./ActiveMatchesModal.module.scss";

const ActiveMatchesModal = ({ isOpen, onClose }) => {
  const [matches, setMatches] = useState([]);
  const t = useTranslations("header.live_matches");

  useEffect(() => {
    if (!isOpen) return undefined;

    function handleActiveMatchesUpdate({ matches: nextMatches = [] }) {
      setMatches(nextMatches.slice(0, MAX_LIVE_MATCHES));
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    socket.on("active-matches-update", handleActiveMatchesUpdate);
    socket.emit("get-active-matches");
    const refreshInterval = setInterval(() => {
      socket.emit("get-active-matches");
    }, 3000);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      socket.off("active-matches-update", handleActiveMatchesUpdate);
      clearInterval(refreshInterval);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={s.overlay} onClick={onClose} role="presentation">
      <div
        className={s.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="active-matches-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={s.header}>
          <div>
            <h2 id="active-matches-title">{t("title")}</h2>
            <p>{t("subtitle")}</p>
          </div>
          <button
            type="button"
            className={s.closeButton}
            onClick={onClose}
            aria-label={t("close_aria")}
          >
            x
          </button>
        </div>

        {matches.length === 0 ? (
          <div className={s.emptyState}>{t("empty")}</div>
        ) : (
          <div className={s.matchesGrid}>
            {matches.map((match) => (
              <XOBoard
                key={match.roomId}
                board={match.board}
                boardSize={match.boardSize}
                playerTurn={match.turn}
                draw={match.draw}
                readOnly
                compact
                className={s.matchBoard}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveMatchesModal;
