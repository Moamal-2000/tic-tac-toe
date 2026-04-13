"use client";

import { useCallback, useState } from "react";

export const useScoreAnimation = () => {
  const [animations, setAnimations] = useState([]);

  function createAnimation({
    startX,
    startY,
    targetX,
    targetY,
    points,
    playerColor = "player1",
    duration = 1000,
  }) {
    const id = `${Date.now()}-${Math.random()}`;

    const newAnimation = {
      id,
      startX,
      startY,
      targetX,
      targetY,
      points,
      playerColor,
      duration,
    };

    setAnimations((prev) => [...prev, newAnimation]);

    return id;
  }

  const removeAnimation = useCallback((id) => {
    setAnimations((prev) => prev.filter((anim) => anim.id !== id));
  }, []);

  return { animations, createAnimation, removeAnimation };
};

export const getAnimationPositions = (startElement, targetElement) => {
  if (!startElement || !targetElement) {
    console.warn("Unable to calculate animation positions: missing elements");
    return { startX: 0, startY: 0, targetX: 0, targetY: 0 };
  }

  const startRect = startElement.getBoundingClientRect();
  const targetRect = targetElement.getBoundingClientRect();

  const startX = startRect.left + startRect.width / 2;
  const startY = startRect.top + startRect.height / 2;
  const targetX = targetRect.left + targetRect.width / 2;
  const targetY = targetRect.top + targetRect.height / 2;

  return { startX, startY, targetX, targetY };
};
