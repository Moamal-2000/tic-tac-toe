"use client";

import { MODEL_CLOSE_KEYS } from "@/data/constants";
import useFunctionOnKey from "@/hooks/useFunctionOnKey";
import s from "./QuitGameModal.module.scss";

const QuitGameModal = ({ isVisible, onConfirm, onCancel }) => {
  useFunctionOnKey(onCancel, MODEL_CLOSE_KEYS, 0, false, true);

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
