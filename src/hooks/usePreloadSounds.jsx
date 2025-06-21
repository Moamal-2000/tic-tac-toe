import { useEffect, useRef } from "react";

const usePreloadSounds = (soundFiles) => {
  const soundsRef = useRef({});

  useEffect(() => {
    for (const [key, src] of Object.entries(soundFiles)) {
      const audio = new Audio(src);
      audio.preload = "auto";
      soundsRef.current[key] = audio;
    }
  }, []);

  const play = (name) => {
    const sound = soundsRef.current[name];
    if (!sound) return;

    sound.currentTime = 0;
    sound.play().catch((e) => {
      console.warn(`Failed to play ${name}:`, e);
    });
  };

  return play;
};

export default usePreloadSounds;
