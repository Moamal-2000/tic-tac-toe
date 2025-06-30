import { BOARD_SIZES } from "@/data/constants";
import s from "./MPBoardSelection.module.scss";

const MPBoardSelection = ({ selectedBoardSize, setSelectedBoardSize }) => {
  return (
    <div className={s.boardSelectionWrapper}>
      <label htmlFor="boardSize">Board Size</label>

      <div className={s.boardSelection} id="boardSize">
        {BOARD_SIZES.map((size) => (
          <div className={s.option} key={`boardSize-${size}`}>
            <input
              type="radio"
              name="boardSize"
              id={`boardSize-${size}`}
              value={size}
              checked={size === selectedBoardSize}
              onChange={(e) => setSelectedBoardSize(+e.target.value)}
            />
            <label htmlFor={`boardSize-${size}`}>
              {size}x{size}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MPBoardSelection;
