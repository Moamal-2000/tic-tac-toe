"use client";

import { useEffect, useState } from "react";
import s from "./FloatingScore.module.scss";

const FloatingScore = ({
  startX,
  startY,
  targetX,
  targetY,
  points,
  playerColor = "player1",
  duration = 1000,
  onComplete,
}) => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  const colorClass = s[playerColor] || s.player1;
  const activeClass = isAnimating ? s.active : "";

  return (
    <div
      className={`${s.floatingScore} ${colorClass} ${activeClass}`}
      style={{
        "--duration": `${duration + 100}ms`,
        "--start-x": `${startX}px`,
        "--start-y": `${startY}px`,
        "--target-x": `${targetX}px`,
        "--target-y": `${targetY}px`,
        top: `${startY}px`,
        left: `${startX}px`,
      }}
      aria-hidden="true"
    >
      {points}
    </div>
  );
};

export default FloatingScore;
