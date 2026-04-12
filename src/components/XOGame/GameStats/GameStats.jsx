"use client";

import { SCREEN_SIZES } from "@/data/constants";
import { useGlobalStore } from "@/stores/global.store/global.store";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useXOStore } from "@/stores/xo.store/xo.store";
import { useTranslations } from "next-intl";
import PlayerTurnIndicator from "../PlayerTurnIndicator/PlayerTurnIndicator";
import s from "./GameStats.module.scss";

const GameStats = ({ stats }) => {
  const t = useTranslations("game_stats");

  const gameMode = useGlobalStore((s) => s.gameMode);

  const isSinglePlayerMode = gameMode === "local" || gameMode === "computer";

  const { boardSize, playerTurn, winner } = isSinglePlayerMode
    ? useXOStore()
    : useMultiplayerStore();

  const board3Class = boardSize === 3 ? s.x3 : "";

  return (
    <div className={`${s.gameStats} ${board3Class}`}>
      <header className={s.header}>
        <h2>Game Statistics</h2>
      </header>

      <PlayerTurnIndicator
        playerTurn={playerTurn}
        boardSize={boardSize}
        winner={winner}
        showOn={SCREEN_SIZES.medium.size}
        hideUntilShow={true}
      />

      <div className={s.stats}>
        <div className={`${s.stat} ${s.player1}`}>
          <span className={s.value}>{stats.p1Wins}</span>
          <span className={s.label}>{t("p1_wins")}</span>
        </div>

        <div className={`${s.stat} ${s.draws}`}>
          <span className={s.value}>{stats.draws}</span>
          <span className={s.label}>{t("draws")}</span>
        </div>

        <div className={`${s.stat} ${s.player2}`}>
          <span className={s.value}>{stats.p2Wins}</span>
          <span className={s.label}>{t("p2_wins")}</span>
        </div>
      </div>
    </div>
  );
};

export default GameStats;
