"use client";

import SvgIcon from "@/components/Shared/SvgIcon";
import { useLocalStorageStore } from "@/stores/localStorage.store/localStorage.store";
import s from "./VolumeButton.module.scss";

const VolumeButton = () => {
  const { updateLocalStorageState, isVolumeOn } = useLocalStorageStore(
    (s) => s
  );

  function toggleVolume() {
    updateLocalStorageState({ isVolumeOn: !isVolumeOn });
  }

  return (
    <button
      type="button"
      className={`${s.volumeBtn} ${isVolumeOn ? "" : s.muted}`}
      title={`${isVolumeOn ? "Mute" : "Unmute"} Sound`}
      onClick={toggleVolume}
    >
      <SvgIcon name="volume" />
    </button>
  );
};

export default VolumeButton;
