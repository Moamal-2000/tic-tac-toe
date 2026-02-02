"use client";

import { TURN_TIMER_DURATION } from "@/data/constants";
import { socket } from "@/socket/socket";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import s from "./Timer.module.scss";

const Timer = () => {
  const t = useTranslations("global");

  const { timeRemaining, timerActive, hasGameStarted, winner, isChatOpen } =
    useMultiplayerStore();

  useEffect(() => {
    function handleTimerUpdate({ timeRemaining, timerActive }) {
      useMultiplayerStore.setState({ timeRemaining, timerActive });
    }

    socket.on("timer-update", handleTimerUpdate);

    return () => {
      socket.off("timer-update", handleTimerUpdate);
    };
  }, []);

  const isTimerRunning = timerActive && hasGameStarted && !winner;
  if (!isTimerRunning) return null;

  const isLowTime = timeRemaining <= 10;
  const isCriticalTime = timeRemaining <= 5;
  const progressLineStyles = {
    width: `${(timeRemaining / TURN_TIMER_DURATION) * 100}%`,
  };

  const timerClasses = getTimerClasses({
    cssModule: s,
    isLowTime,
    isCriticalTime,
    isChatOpen,
  });

  return (
    <div className={timerClasses}>
      <div className={s.bar}>
        <div className={s.progressLine} style={progressLineStyles} />
      </div>

      <div className={s.timerText} dir="ltr">
        {timeRemaining}
        <span className={s.word}>{t("left")}</span>
      </div>
    </div>
  );
};

export default Timer;

function getTimerClasses({
  cssModule,
  isLowTime,
  isCriticalTime,
  isChatOpen,
} = {}) {
  const classes = [
    cssModule.container,
    isLowTime && cssModule.lowTime,
    isCriticalTime && cssModule.criticalTime,
    isChatOpen && cssModule.chatOpen,
  ];
  return classes.filter(Boolean).join(" ");
}
