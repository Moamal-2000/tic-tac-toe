import { useGlobalStore } from "@/stores/global.store/global.store";
import { useEffect, useRef } from "react";

const usePreloadSounds = (soundFiles) => {
  const isVolumeOn = useGlobalStore((s) => s.isVolumeOn);
  const soundsRef = useRef({});

  useEffect(() => {
    for (const [key, src] of Object.entries(soundFiles)) {
      const audio = new Audio(src);
      audio.preload = "auto";
      soundsRef.current[key] = audio;
    }
  }, []);

  const playSound = (name, volume = 1) => {
    if (!isVolumeOn) return;

    const sound = soundsRef.current[name];
    if (!sound) return;

    sound.currentTime = 0;
    sound.volume = volume;
    sound.play().catch((e) => {
      console.warn(`Failed to play ${name}:`, e);
    });
  };

  return playSound;
};

export default usePreloadSounds;
