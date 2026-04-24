"use client";

import { useEffect, useState } from "react";
import s from "./PowerUpsScoreAnimation.module.scss";

const PowerUpsScoreAnimation = ({ animations, removeAnimation }) => {
  const [groupedScores, setGroupedScores] = useState({});

  useEffect(() => {
    if (!animations || animations.length === 0) return;

    const newGrouped = { ...groupedScores };

    animations.forEach((animation) => {
      const playerColor = animation.playerColor;

      if (!newGrouped[playerColor]) {
        newGrouped[playerColor] = {
          totalScore: 0,
          animationIds: [],
          isVisible: true,
          timerRef: null,
        };
      }

      // Only add if this animation ID is not already tracked
      if (!newGrouped[playerColor].animationIds.includes(animation.id)) {
        const [, sign, number] = animation.points.match(/^([+-])(\d+)$/);
        const scoreValue = sign === "+" ? parseInt(number) : -parseInt(number);
        newGrouped[playerColor].totalScore += scoreValue;
        newGrouped[playerColor].animationIds.push(animation.id);

        // Clear existing timer and set new one
        if (newGrouped[playerColor].timerRef) {
          clearTimeout(newGrouped[playerColor].timerRef);
        }

        newGrouped[playerColor].timerRef = setTimeout(() => {
          setGroupedScores((prev) => {
            const updated = { ...prev };
            delete updated[playerColor];
            return updated;
          });
          // Remove all animations for this player
          newGrouped[playerColor].animationIds.forEach((id) =>
            removeAnimation(id),
          );
        }, 2000);
      }
    });

    setGroupedScores(newGrouped);
  }, [animations, removeAnimation]);

  return (
    <div className={s.scoresContainer}>
      {Object.entries(groupedScores).map(([playerColor, scoreData]) => (
        <ScoreDisplay
          key={playerColor}
          playerColor={playerColor}
          totalScore={scoreData.totalScore}
        />
      ))}
    </div>
  );
};

const ScoreDisplay = ({ playerColor, totalScore }) => {
  const colorClass = s[playerColor] || s.player1;
  const sign = totalScore >= 0 ? "+" : "";

  return (
    <div className={`${s.scoreDisplay} ${colorClass}`}>
      <span>{`${sign}${totalScore}`.padStart(4, " ")}</span>
    </div>
  );
};

export default PowerUpsScoreAnimation;
