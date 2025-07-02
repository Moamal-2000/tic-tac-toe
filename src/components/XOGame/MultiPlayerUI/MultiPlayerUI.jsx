import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import s from "./MultiPlayerUI.module.scss";
import PlayerTurnIndicator from "./PlayerTurnIndicator/PlayerTurnIndicator";

const MultiPlayerUI = () => {
  const boardSize = useMultiplayerStore((s) => s.boardSize);
  const board3Class = boardSize === 3 ? s.x3 : "";

  return (
    <section className={`${s.game} ${board3Class}`}>
      <PlayerTurnIndicator />
    </section>
  );
};

export default MultiPlayerUI;
