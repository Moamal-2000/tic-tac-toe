import { useXOStore } from "@/stores/xo.store/xo.store";
import GameStats from "./GameStats/GameStats";
import PlayerTurnIndicator from "../PlayerTurnIndicator/PlayerTurnIndicator";
import PowerUps from "./PowerUps/PowerUps";
import s from "./SinglePlayerUI.module.scss";
import XOBoard from "./XOBoard/XOBoard";

const SinglePlayerUI = () => {
  const { playerTurn, boardSize, winner } = useXOStore((s) => s);
  const board3Class = boardSize === 3 ? s.x3 : "";

  return (
    <section className={`${s.game} ${board3Class}`}>
      <div className={s.wrapper}>
        <PowerUps player="player1" />
        <GameStats />
        <PowerUps player="player2" />
      </div>

      <XOBoard />
      <PlayerTurnIndicator
        playerTurn={playerTurn}
        boardSize={boardSize}
        winner={winner}
      />
    </section>
  );
};

export default SinglePlayerUI;
