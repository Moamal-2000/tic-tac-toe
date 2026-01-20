"use client";

import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useTranslations } from "next-intl";
import s from "./ChatHeader.module.scss";

const ChatHeader = ({ unseenCount, onToggle }) => {
  const isChatOpen = useMultiplayerStore((s) => s.isChatOpen);
  const t = useTranslations("chat");

  const label = t(`${isChatOpen ? "close_chat" : "open_chat"}`);
  const badgeText = unseenCount > 99 ? "99+" : unseenCount;
  const iconHref = `/icons-sprite.svg#${isChatOpen ? "x-symbol" : "message"}`;

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

        <svg strokeWidth="2" fill="currentColor" aria-hidden="true">
          <use href={iconHref} />
        </svg>
      </div>
    </button>
  );
};

export default ChatHeader;
