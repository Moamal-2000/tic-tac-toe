"use client";

import { MODEL_CLOSE_KEYS } from "@/data/constants";
import useFunctionOnKey from "@/hooks/useFunctionOnKey";
import { useTranslations } from "next-intl";
import s from "./QuitGameModal.module.scss";

const QuitGameModal = ({ isVisible, onConfirm, onCancel }) => {
  const t = useTranslations("modals.quit_game_modal");

  useFunctionOnKey(onCancel, MODEL_CLOSE_KEYS, 0, false, true);

  if (!isVisible) return null;

  return (
    <div className={s.overlay}>
      <div className={s.modal}>
        <div className={s.content}>
          <h2 className={s.title}>{t("title")}</h2>
          <p className={s.message}>{t("message")}</p>
          <div className={s.buttons}>
            <button
              type="button"
              className={s.button}
              onClick={onConfirm}
              autoFocus
            >
              {t("confirm")}
            </button>
            <button
              type="button"
              className={`${s.button} ${s.buttonSecondary}`}
              onClick={onCancel}
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuitGameModal;
