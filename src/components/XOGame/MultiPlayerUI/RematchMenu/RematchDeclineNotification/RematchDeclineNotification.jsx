"use client";

import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import s from "./RematchDeclineNotification.module.scss";

const RematchDeclineNotification = ({ isVisible, onHide }) => {
  const { updateMultiplayerState } = useMultiplayerStore();
  const t = useTranslations("modals.rematch_decline_notification");

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      onHide();
      updateMultiplayerState({ isRematchMenuActive: false });
    }, 3000);

    return () => clearTimeout(timer);
  }, [isVisible, onHide, updateMultiplayerState]);

  if (!isVisible) return null;

  return (
    <div className={s.notificationOverlay}>
      <div className={s.notification}>
        <h3>{t("title")}</h3>
        <p>{t("message")}</p>
      </div>
    </div>
  );
};

export default RematchDeclineNotification;
