import { SCREEN_SIZES, SYMBOL_O, SYMBOL_X } from "@/data/constants";
import useComputerBot from "@/hooks/app/useComputerBot";
import { useXOStore } from "@/stores/xo.store/xo.store";
import GameStats from "../GameStats/GameStats";
import PlayerTurnIndicator from "../PlayerTurnIndicator/PlayerTurnIndicator";
import PowerUps from "./PowerUps/PowerUps";
import s from "./SinglePlayerUI.module.scss";
import XOBoard from "./XOBoard/XOBoard";

const SinglePlayerUI = () => {
  const { playerTurn, boardSize, stats, winner } = useXOStore();
  const board3Class = boardSize === 3 ? s.x3 : "";

  useComputerBot();

  return (
    <section className={`${s.game} ${board3Class}`}>
      <div className={s.wrapper}>
        <PowerUps player="player1" />
        <GameStats stats={stats} boardSize={boardSize} />
        <PowerUps player="player2" />
      </div>

      <Scores />

      <XOBoard />
      <PlayerTurnIndicator
        playerTurn={playerTurn}
        boardSize={boardSize}
        winner={winner}
        hideOn={SCREEN_SIZES.medium.size}
      />
    </section>
  );
};

export default SinglePlayerUI;

function Scores() {
  const { scores } = useXOStore();

  return (
    <div className={s.scores} style={{ display: "flex", gap: "10px" }}>
      <div className={s.score} style={{ color: "red" }}>
        {scores[SYMBOL_O]}
      </div>
      <div className={s.score} style={{ color: "cyan" }}>
        {scores[SYMBOL_X]}
      </div>
    </div>
  );
}
