import { BOARD_SIZES } from "@/data/constants";
import s from "./MPBoardSelection.module.scss";

const MPBoardSelection = ({
  selectedBoardSize,
  setSelectedBoardSize,
  playClickSound,
}) => {
  return (
    <div className={s.boardSelectionWrapper}>
      <label htmlFor="boardSize">Board Size</label>

      <div className={s.boardSelection} id="boardSize">
        {BOARD_SIZES.map((size) => {
          function handleChange(event) {
            setSelectedBoardSize(+event.target.value);
            playClickSound?.();
          }

          return (
            <div className={s.option} key={`boardSize-${size}`}>
              <input
                type="radio"
                name="boardSize"
                id={`boardSize-${size}`}
                value={size}
                checked={size === selectedBoardSize}
                onChange={(event) => handleChange(event)}
              />
              <label htmlFor={`boardSize-${size}`}>
                {size}x{size}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MPBoardSelection;
