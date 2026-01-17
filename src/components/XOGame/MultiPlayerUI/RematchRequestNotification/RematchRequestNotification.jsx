"use client";

import { socket } from "@/socket/socket";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import s from "./RematchRequestNotification.module.scss";

const RematchRequestNotification = () => {
  const { updateMultiplayerState, rematchRequest } = useMultiplayerStore();
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations("modals.rematch_request_notification");

  useEffect(() => {
    socket.on("rematch-request-received", () => {
      updateMultiplayerState({ rematchRequest: "pending" });
      setIsVisible(true);
    });

    return () => {
      socket.off("rematch-request-received");
    };
  }, [updateMultiplayerState]);

  function handleAccept() {
    socket.emit("rematch-accepted");
    updateMultiplayerState({ rematchRequest: null });
    setIsVisible(false);
  }

  function handleReject() {
    socket.emit("rematch-rejected");
    updateMultiplayerState({ rematchRequest: null });
    setIsVisible(false);
  }

  if (!isVisible || rematchRequest !== "pending") return null;

  return (
    <div className={s.overlay}>
      <div className={s.notification}>
        <h2>{t("title")}</h2>
        <p>{t("description")}</p>

        <div className={s.buttons}>
          <button onClick={handleAccept}>{t("accept")}</button>
          <button onClick={handleReject}>{t("decline")}</button>
        </div>
      </div>
    </div>
  );
};

export default RematchRequestNotification;
