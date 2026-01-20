import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useTranslations } from "next-intl";
import s from "./Message.module.scss";

const Message = ({ message: { sender, timestamp, text } }) => {
  const mySymbol = useMultiplayerStore((s) => s.mySymbol);
  const t = useTranslations("chat");

  const messageClasses = `${s.message} ${
    sender === mySymbol ? s.ownMessage : s.opponentMessage
  }`;

  const senderName = sender === mySymbol ? t("you") : t("opponent");

  return (
    <div className={messageClasses}>
      <div className={s.messageHeader}>
        <span className={s.sender}>{senderName}</span>
        <span className={s.timestamp}>{formatTime(timestamp)}</span>
      </div>
      <p className={s.messageText}>{text}</p>
    </div>
  );
};

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default Message;
