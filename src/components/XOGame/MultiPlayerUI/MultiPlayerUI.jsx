import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import GameStats from "../GameStats/GameStats";
import PlayerTurnIndicator from "../PlayerTurnIndicator/PlayerTurnIndicator";
import s from "./MultiPlayerUI.module.scss";
import XOBoard from "./XOBoard/XOBoard";

const MultiPlayerUI = () => {
  const { boardSize, stats, winner, playerTurn } = useMultiplayerStore(
    (s) => s
  );
  const board3Class = boardSize === 3 ? s.x3 : "";

  return (
    <section className={`${s.game} ${board3Class}`}>
      <div className={s.wrapper}>
        <GameStats boardSize={boardSize} stats={stats} />
      </div>

      <XOBoard />
      <PlayerTurnIndicator
        boardSize={boardSize}
        winner={winner}
        playerTurn={playerTurn}
      />
    </section>
  );
};

export default MultiPlayerUI;
