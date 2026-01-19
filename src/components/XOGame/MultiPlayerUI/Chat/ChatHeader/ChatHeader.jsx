"use client";

import { useTranslations } from "next-intl";
import s from "./ChatHeader.module.scss";

const ChatHeader = ({ isChatOpen, unseenCount, onToggle }) => {
  const t = useTranslations("chat");

  return (
    <button
      className={s.chatHeader}
      onClick={onToggle}
      aria-label={isChatOpen ? t("close_chat") : t("open_chat")}
      aria-expanded={isChatOpen}
    >
      <span>{t("title")}</span>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {unseenCount > 0 && (
          <span className={s.notificationBadge}>
            {unseenCount > 99 ? "99+" : unseenCount}
          </span>
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
