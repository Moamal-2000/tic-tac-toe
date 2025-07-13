import { SYMBOL_X } from "@/data/constants";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import BoardRow from "./BoardRow/BoardRow";
import WinnerPopUp from "./WinnerPopUp/WinnerPopUp";
import s from "./XOBoard.module.scss";

const XOBoard = () => {
  const { board, playerTurn, draw } = useMultiplayerStore((s) => s);
  const playerTurnClass = playerTurn === SYMBOL_X ? s.xTurn : s.oTurn;
  const drawClass = draw ? s.draw : "";

  return (
    <div className={`${s.board} ${playerTurnClass} ${drawClass}`}>
      <WinnerPopUp />

      {board.map((row, rowIndex) => (
        <BoardRow key={rowIndex} row={row} rowIndex={rowIndex} />
      ))}
    </div>
  );
};

export default XOBoard;
