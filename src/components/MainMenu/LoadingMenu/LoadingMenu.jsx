"use client";

import BackButton from "@/components/Shared/BackButton/BackButton";
import SvgIcon from "@/components/Shared/SvgIcon";
import { useGlobalStore } from "@/stores/global.store/global.store";
import s from "./LoadingMenu.module.scss";

const LoadingMenu = () => {
  const updateGlobalState = useGlobalStore((s) => s.updateGlobalState);

  function handleBackButton() {
    updateGlobalState({ key: "isWaitingForOpponent", value: false });
  }

  return (
    <div className={s.loadingMenu}>
      <BackButton onClick={handleBackButton} />

      <div className={s.content}>
        <div className={s.loader}>
          <SvgIcon name="spinner" />
        </div>

        <h2>Finding Match...</h2>
        <p>Please wait while we connect you with another player</p>
        <p className={s.note}>
          This feature is still in development and not ready for use yet
        </p>
      </div>
    </div>
  );
};

export default LoadingMenu;
