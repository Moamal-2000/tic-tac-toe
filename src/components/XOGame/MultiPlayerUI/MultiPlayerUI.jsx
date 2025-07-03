import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import s from "./MultiPlayerUI.module.scss";
import PlayerTurnIndicator from "./PlayerTurnIndicator/PlayerTurnIndicator";
import XOBoard from "./XOBoard/XOBoard";

const MultiPlayerUI = () => {
  const { boardSize, winner, playerTurn } = useMultiplayerStore((s) => s);
  const board3Class = boardSize === 3 ? s.x3 : "";

  return (
    <section className={`${s.game} ${board3Class}`}>
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
