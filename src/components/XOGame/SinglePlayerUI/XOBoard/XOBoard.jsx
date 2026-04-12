import { useXOStore } from "@/stores/xo.store/xo.store";
import BoardRow from "./BoardRow/BoardRow";
import WinnerPopUp from "./WinnerPopUp/WinnerPopUp";
import s from "./XOBoard.module.scss";

const XOBoard = () => {
  const board = useXOStore((s) => s.board);

  return (
    <div className={s.board}>
      <WinnerPopUp />

      {board.map((row, rowIndex) => (
        <BoardRow key={rowIndex} row={row} rowIndex={rowIndex} />
      ))}
    </div>
  );
};

export default XOBoard;
