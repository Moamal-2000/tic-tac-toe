import { SYMBOL_X } from "@/data/constants";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import WinnerPopUp from "../../SinglePlayerUI/XOBoard/WinnerPopUp/WinnerPopUp";
import BoardRow from "./BoardRow/BoardRow";
import s from "./XOBoard.module.scss";

const XOBoard = ({
  board: previewBoard,
  boardSize: previewBoardSize,
  playerTurn: previewPlayerTurn,
  draw: previewDraw = false,
  readOnly = false,
  compact = false,
  className = "",
}) => {
  const board = useMultiplayerStore((state) => state.board);
  const boardSize = useMultiplayerStore((state) => state.boardSize);
  const playerTurn = useMultiplayerStore((state) => state.playerTurn);
  const draw = useMultiplayerStore((state) => state.draw);

  const resolvedBoard = previewBoard ?? board;
  const resolvedBoardSize = previewBoardSize ?? boardSize;
  const resolvedPlayerTurn = previewPlayerTurn ?? playerTurn;
  const resolvedDraw = previewDraw ?? draw;

  const playerTurnClass = resolvedPlayerTurn === SYMBOL_X ? s.xTurn : s.oTurn;
  const drawClass = resolvedDraw ? s.draw : "";

  return (
    <div
      className={`${s.board} ${playerTurnClass} ${drawClass} ${
        compact ? s.compact : ""
      } ${className}`}
    >
      {!readOnly && <WinnerPopUp />}

      {resolvedBoard.map((row, rowIndex) => (
        <BoardRow
          key={rowIndex}
          row={row}
          rowIndex={rowIndex}
          readOnly={readOnly}
          boardSize={resolvedBoardSize}
          playerTurn={resolvedPlayerTurn}
          compact={compact}
        />
      ))}
    </div>
  );
};

export default XOBoard;
