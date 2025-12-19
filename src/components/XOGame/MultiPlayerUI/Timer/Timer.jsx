"use client";

import { CIRCLE_LENGTH, TURN_TIMER_DURATION } from "@/data/constants";
import { stopTimer } from "@/functions/helper";
import { socket } from "@/socket/socket";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useEffect, useRef } from "react";
import s from "./Timer.module.scss";

const Timer = () => {
  const { timeRemaining, timerActive, hasGameStarted, winner } =
    useMultiplayerStore();
  const intervalRef = useRef(null);

  const isTimerRunning = timerActive && hasGameStarted && !winner;

  useEffect(() => {
    if (!isTimerRunning) {
      stopTimer(intervalRef);
      return;
    }

    intervalRef.current = setInterval(() => tick(intervalRef), 1000);

    return () => {
      stopTimer(intervalRef);
    };
  }, [timerActive, hasGameStarted, winner]);

  if (!isTimerRunning) return null;

  const { isLowTime, isVeryLowTime, strokeDashoffset } =
    calculateTimerVisuals(timeRemaining);
  const timerClasses = getTimerClasses(s, isLowTime, isVeryLowTime);

  return (
    <div className={timerClasses}>
      <svg className={s.timerCircle} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" className={s.timerBg} />
        <circle
          cx="50"
          cy="50"
          r="45"
          className={s.timerProgress}
          style={{ strokeDashoffset }}
        />
      </svg>
      <div className={s.timerText}>{timeRemaining}s</div>
    </div>
  );
};

export default Timer;

function tick(intervalRef) {
  useMultiplayerStore.setState((state) => {
    const nextTime = state.timeRemaining - 1;

    if (nextTime <= 0) {
      stopTimer(intervalRef);
      socket.emit("time-up");
      return { timeRemaining: 0, timerActive: false };
    }

    return { timeRemaining: nextTime };
  });
}

function calculateTimerVisuals(timeRemaining) {
  return {
    isLowTime: timeRemaining <= 10,
    isVeryLowTime: timeRemaining <= 5,
    strokeDashoffset:
      (CIRCLE_LENGTH * (TURN_TIMER_DURATION - timeRemaining)) /
      TURN_TIMER_DURATION,
  };
}

function getTimerClasses(cssModule, isLowTime, isVeryLowTime) {
  return [
    cssModule.timerContainer,
    isLowTime && cssModule.lowTime,
    isVeryLowTime && cssModule.veryLowTime,
  ]
    .filter(Boolean)
    .join(" ");
}
