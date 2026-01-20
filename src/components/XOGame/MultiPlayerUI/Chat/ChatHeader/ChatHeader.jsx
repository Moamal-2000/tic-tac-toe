"use client";

import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useTranslations } from "next-intl";
import s from "./ChatHeader.module.scss";

const ChatHeader = () => {
  const { isChatOpen, unreadMessagesCount, updateMultiplayerState } =
    useMultiplayerStore();

  const t = useTranslations("chat");
  const label = t(`${isChatOpen ? "close_chat" : "open_chat"}`);
  const badgeText = unreadMessagesCount > 99 ? "99+" : unreadMessagesCount;
  const iconHref = `/icons-sprite.svg#${isChatOpen ? "x-symbol" : "message"}`;

  function toggleChat() {
    updateMultiplayerState({ isChatOpen: !isChatOpen });

    if (isChatOpen) return;

    setTimeout(() => {
      updateMultiplayerState({ unreadMessagesCount: 0 });
      document.querySelector('[class*="messageInput"]')?.focus();
    }, 100);
  }

  return (
    <button
      className={s.chatHeader}
      onClick={toggleChat}
      aria-label={label}
      aria-expanded={isChatOpen}
    >
      {t("title")}

      <div className={s.wrapper}>
        {unreadMessagesCount > 0 && (
          <span className={s.notificationBadge}>{badgeText}</span>
        )}

        <svg strokeWidth="2" fill="currentColor" aria-hidden="true">
          <use href={iconHref} />
        </svg>
      </div>
    </button>
  );
};

export default ChatHeader;
