"use client";

import { useEffect } from "react";
import s from "./QuitGameModal.module.scss";

const QuitGameModal = ({ isVisible, onConfirm, onCancel }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isVisible) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isVisible, onCancel]);

  if (!isVisible) return null;

  return (
    <div className={s.overlay}>
      <div className={s.modal}>
        <div className={s.content}>
          <h2 className={s.title}>Active Match</h2>
          <p className={s.message}>
            You are in an active match, would you like to quit?
          </p>
          <div className={s.buttons}>
            <button
              type="button"
              className={s.button}
              onClick={onConfirm}
              autoFocus
            >
              Yes
            </button>
            <button
              type="button"
              className={`${s.button} ${s.buttonSecondary}`}
              onClick={onCancel}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuitGameModal;
