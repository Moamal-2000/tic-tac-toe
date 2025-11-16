"use client";

import SvgIcon from "@/components/Shared/SvgIcon";
import { useGlobalStore } from "@/stores/global.store/global.store";
import s from "./VolumeButton.module.scss";

const VolumeButton = () => {
  const { updateGlobalState, isVolumeOn } = useGlobalStore((s) => s);

  function toggleVolume() {
    updateGlobalState({ isVolumeOn: !isVolumeOn });
  }

  return (
    <button
      type="button"
      className={s.volumeBtn}
      title={`${isVolumeOn ? "Mute" : "Unmute"} Sound`}
      onClick={toggleVolume}
    >
      <SvgIcon name={"expand"} />
    </button>
  );
};

export default VolumeButton;
