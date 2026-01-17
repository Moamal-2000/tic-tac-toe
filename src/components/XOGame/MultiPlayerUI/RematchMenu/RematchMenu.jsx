"use client";

import { socket } from "@/socket/socket";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import RematchDeclineNotification from "./RematchDeclineNotification/RematchDeclineNotification";
import s from "./RematchMenu.module.scss";

const RematchMenu = () => {
  const { updateMultiplayerState, playerTurn } = useMultiplayerStore();
  const [waitingOpponent, setWaitingOpponent] = useState(false);
  const [showDeclineNotification, setShowDeclineNotification] = useState(false);
  const t = useTranslations("modals.rematch_menu");

  useEffect(() => {
    socket.on("rematch-request-rejected", () => {
      setWaitingOpponent(false);
      setShowDeclineNotification(true);
    });

    socket.on("rematch-accepted", () => {
      setWaitingOpponent(false);
      updateMultiplayerState({ isRematchMenuActive: false });
    });

    return () => {
      socket.off("rematch-request-rejected");
      socket.off("rematch-accepted");
    };
  }, [updateMultiplayerState]);

  function closeRematchMenu(event) {
    const isOverlayClick = event.target.contains(event.currentTarget);

    if (!isOverlayClick) return;

    if (!waitingOpponent) {
      updateMultiplayerState({ isRematchMenuActive: false });
    }
  }

  function handleRematch() {
    setWaitingOpponent(true);
    socket.emit("requestRematch", { playerWhoRequested: playerTurn });
  }

  if (showDeclineNotification) {
    return (
      <RematchDeclineNotification
        isVisible={showDeclineNotification}
        onHide={() => setShowDeclineNotification(false)}
      />
    );
  }

  return (
    <div className={s.overlay} onClick={closeRematchMenu}>
      <div className={s.rematchMenu}>
        {!waitingOpponent && (
          <>
            <h2>{t("ask_rematch")}</h2>

            <div className={s.buttons}>
              <button onClick={handleRematch}>{t("yes")}</button>
              <button onClick={closeRematchMenu}>{t("no")}</button>
            </div>
          </>
        )}

        {waitingOpponent && (
          <>
            <h2>{t("waiting_opponent")}</h2>
            <p>{t("waiting_message")}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default RematchMenu;
