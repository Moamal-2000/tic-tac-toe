import { BOARD_SIZES } from "@/data/constants";
import BoardSizeOption from "./BoardSizeOption/BoardSizeOption";
import s from "./MPBoardSelection.module.scss";

const MPBoardSelection = () => {
  return (
    <div className={s.boardSelectionWrapper}>
      <label htmlFor="boardSize">Board Size</label>

      <div className={s.boardSelection} id="boardSize">
        {BOARD_SIZES.map((size) => (
          <BoardSizeOption size={size} key={`boardSize-${size}`} />
        ))}
      </div>
    </div>
  );
};

export default MPBoardSelection;
