"use client";

import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useEffect } from "react";
import s from "./RematchDeclineNotification.module.scss";

const RematchDeclineNotification = ({ isVisible, onHide }) => {
  const { updateMultiplayerState } = useMultiplayerStore();

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
        <h3>Rematch Declined</h3>
        <p>Your opponent declined the rematch request.</p>
      </div>
    </div>
  );
};

export default RematchDeclineNotification;
