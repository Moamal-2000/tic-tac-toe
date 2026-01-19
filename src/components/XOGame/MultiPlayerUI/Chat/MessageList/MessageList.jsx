"use client";

import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useTranslations } from "next-intl";
import s from "./MessageList.module.scss";

const MessageList = ({ messages }) => {
  const { mySymbol } = useMultiplayerStore();
  const t = useTranslations("chat");

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (messages.length === 0) {
    return (
      <div className={s.emptyState}>
        <p>{t("no_messages_yet")}</p>
      </div>
    );
  }

  return (
    <>
      {messages.map((message, index) => (
        <div
          key={index}
          className={`${s.message} ${
            message.sender === mySymbol ? s.ownMessage : s.opponentMessage
          }`}
        >
          <div className={s.messageHeader}>
            <span className={s.sender}>
              {message.sender === mySymbol ? t("you") : t("opponent")}
            </span>
            <span className={s.timestamp}>{formatTime(message.timestamp)}</span>
          </div>
          <p className={s.messageText}>{message.text}</p>
        </div>
      ))}
    </>
  );
};

export default MessageList;
