"use client";

import { socket } from "@/socket/socket";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useEffect, useRef } from "react";
import s from "./Timer.module.scss";

const Timer = () => {
  const { timeRemaining, timerActive, hasGameStarted, winner } =
    useMultiplayerStore((s) => s);
  const updateMultiplayerState = useMultiplayerStore(
    (s) => s.updateMultiplayerState
  );
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!timerActive || !hasGameStarted || winner) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      useMultiplayerStore.setState((state) => {
        const newTime = state.timeRemaining - 1;

        if (newTime <= 0) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          // Time is up, emit timeout event to server
          socket.emit("time-up");
          return {
            timeRemaining: 0,
            timerActive: false,
          };
        }

        return { timeRemaining: newTime };
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timerActive, hasGameStarted, winner, updateMultiplayerState]);

  if (!hasGameStarted || !timerActive || winner) {
    return null;
  }

  const isLowTime = timeRemaining <= 10;
  const isVeryLowTime = timeRemaining <= 5;

  return (
    <div
      className={`${s.timerContainer} ${isLowTime ? s.lowTime : ""} ${
        isVeryLowTime ? s.veryLowTime : ""
      }`}
    >
      <svg className={s.timerCircle} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" className={s.timerBg} />
        <circle
          cx="50"
          cy="50"
          r="45"
          className={s.timerProgress}
          style={{
            strokeDashoffset: `${(282.743 * (30 - timeRemaining)) / 30}`,
          }}
        />
      </svg>
      <div className={s.timerText}>{timeRemaining}s</div>
    </div>
  );
};

export default Timer;
