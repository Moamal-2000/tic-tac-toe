"use client";

import { useXOStore } from "@/stores/xo.store/xo.store";
import s from "./GameStats.module.scss";

const GameStats = () => {
  const { stats, boardSize } = useXOStore((s) => s);
  const board3Class = boardSize === 3 ? s.x3 : "";

  return (
    <div className={`${s.gameStats} ${board3Class}`}>
      <div className={`${s.stat} ${s.player1}`}>
        <span className={s.value}>{stats.p1Wins}</span>
        <span className={s.label}>P1 Wins</span>
      </div>

      <div className={`${s.stat} ${s.draws}`}>
        <span className={s.value}>{stats.draws}</span>
        <span className={s.label}>Draws</span>
      </div>

      <div className={`${s.stat} ${s.player2}`}>
        <span className={s.value}>{stats.p2Wins}</span>
        <span className={s.label}>P2 Wins</span>
      </div>
    </div>
  );
};

export default GameStats;
