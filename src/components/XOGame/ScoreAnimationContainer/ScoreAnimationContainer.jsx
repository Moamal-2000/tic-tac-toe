"use client";

import FloatingScore from "../FloatingScore/FloatingScore";

const ScoreAnimationContainer = ({ animations, removeAnimation }) => {
  if (!animations || animations.length === 0) return null;

  return animations.map((animation) => (
    <FloatingScore
      key={animation.id}
      startX={animation.startX}
      startY={animation.startY}
      targetX={animation.targetX}
      targetY={animation.targetY}
      points={animation.points}
      playerColor={animation.playerColor}
      duration={animation.duration}
      onComplete={() => removeAnimation(animation.id)}
    />
  ));
};

export default ScoreAnimationContainer;
