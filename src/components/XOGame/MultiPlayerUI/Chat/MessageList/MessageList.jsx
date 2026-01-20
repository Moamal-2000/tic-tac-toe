"use client";

import { useTranslations } from "next-intl";
import Message from "./Message/Message";
import s from "./MessageList.module.scss";

const MessageList = ({ messages }) => {
  const t = useTranslations("chat");

  if (messages.length === 0) {
    return <p className={s.emptyState}>{t("no_messages_yet")}</p>;
  }

  return messages.map((message) => (
    <Message key={message.timestamp} message={message} />
  ));
};

export default MessageList;
