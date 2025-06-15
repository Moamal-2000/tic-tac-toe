"use client";

import { useXOStore } from "@/stores/xo.store/xo.store";
import GameStats from "./GameStats/GameStats";
import PlayerTurnIndicator from "./PlayerTurnIndicator/PlayerTurnIndicator";
import PowerUps from "./PowerUps/PowerUps";
import s from "./XOGame.module.scss";

const XOGame = () => {
  const boardSize = useXOStore((s) => s.boardSize);
  const board3Class = boardSize === 3 ? s.x3 : "";

  return (
    <section className={`${s.game} ${board3Class}`}>
      <div className={s.wrapper}>
        <PowerUps player="player1" />
        <GameStats />
        <PowerUps player="player2" />
      </div>

      <div className={s.wrapper}>
        <PowerUps player="player1" />
        <GameStats />
        <PowerUps player="player2" />
      </div>

      <div className={s.wrapper}>
        <PowerUps player="player1" />
        <GameStats />
        <PowerUps player="player2" />
      </div>

      <div className={s.wrapper}>
        <PowerUps player="player1" />
        <GameStats />
        <PowerUps player="player2" />
      </div>

      {/* <XOBoard /> */}
      <PlayerTurnIndicator />
    </section>
  );
};

export default XOGame;
