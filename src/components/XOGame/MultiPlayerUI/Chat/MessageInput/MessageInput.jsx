"use client";

import { useTranslations } from "next-intl";
import { useRef } from "react";
import s from "./MessageInput.module.scss";

const MessageInput = ({ inputMessage, onInputChange, onSendMessage }) => {
  const inputRef = useRef(null);
  const t = useTranslations("chat");

  return (
    <form className={s.inputContainer} onSubmit={onSendMessage}>
      <input
        ref={inputRef}
        type="text"
        value={inputMessage}
        onChange={onInputChange}
        placeholder={t("type_message")}
        className={s.messageInput}
        aria-label={t("send")}
        maxLength={200}
      />
      <button
        type="submit"
        className={s.sendButton}
        aria-label={t("send")}
        disabled={!inputMessage.trim()}
      >
        <svg fill="currentColor" aria-hidden="true">
          <use href="/icons-sprite.svg#paper-plane"></use>
        </svg>
      </button>
    </form>
  );
};

export default MessageInput;
