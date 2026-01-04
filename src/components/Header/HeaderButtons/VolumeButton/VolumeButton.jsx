"use client";

import { useLocalStorageStore } from "@/stores/localStorage.store/localStorage.store";
import { useTranslations } from "next-intl";
import s from "./VolumeButton.module.scss";

const VolumeButton = () => {
  const t = useTranslations("header");
  const { updateLocalStorageState, isVolumeOn } = useLocalStorageStore();

  const title = t(`volume.${isVolumeOn ? "mute" : "unmute"}`);

  function toggleVolume() {
    updateLocalStorageState({ isVolumeOn: !isVolumeOn });
  }

  return (
    <button
      type="button"
      className={`${s.volumeBtn} ${isVolumeOn ? "" : s.muted}`}
      title={title}
      onClick={toggleVolume}
    >
      <svg aria-hidden="true">
        <use href="/icons-sprite.svg#volume" />
      </svg>
    </button>
  );
};

export default VolumeButton;
