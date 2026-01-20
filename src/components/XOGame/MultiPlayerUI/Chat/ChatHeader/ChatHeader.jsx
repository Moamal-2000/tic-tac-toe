"use client";

import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useTranslations } from "next-intl";
import s from "./ChatHeader.module.scss";

const ChatHeader = ({ unseenCount, onToggle }) => {
  const isChatOpen = useMultiplayerStore((s) => s.isChatOpen);
  const t = useTranslations("chat");

  const label = t(`${isChatOpen ? "close_chat" : "open_chat"}`);
  const badgeText = unseenCount > 99 ? "99+" : unseenCount;

  return (
    <button
      className={s.chatHeader}
      onClick={onToggle}
      aria-label={label}
      aria-expanded={isChatOpen}
    >
      {t("title")}

      <div className={s.wrapper}>
        {unseenCount > 0 && (
          <span className={s.notificationBadge}>{badgeText}</span>
        )}

        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isChatOpen ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          )}
        </svg>
      </div>
    </button>
  );
};

export default ChatHeader;
