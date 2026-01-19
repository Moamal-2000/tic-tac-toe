"use client";

import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useTranslations } from "next-intl";
import s from "./TypingIndicator.module.scss";

const TypingIndicator = ({ isVisible }) => {
  const { mySymbol } = useMultiplayerStore();
  const t = useTranslations("chat");

  if (!isVisible) return null;

  return (
    <div className={s.typingIndicator}>
      <span className={s.typingText}>{t("opponent_typing")}</span>
      <div className={s.typingDots}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default TypingIndicator;
