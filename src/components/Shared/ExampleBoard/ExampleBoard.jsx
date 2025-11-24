import { getExampleBoardSquareClasses } from "@/functions/classNames";
import s from "./ExampleBoard.module.scss";

const ExampleBoard = ({ boardData }) => {
  return (
    <div className={s.board}>
      {boardData.map((row, rowIndex) => (
        <div key={rowIndex} className={s.row}>
          {row.map(({ fillWith, type }, columnIndex) => {
            const classes = getExampleBoardSquareClasses({
              cssModule: s,
              fillWith,
              type,
            });

            return (
              <button
                type="button"
                disabled={true}
                key={`${rowIndex}-${columnIndex}`}
                className={classes}
              >
                {fillWith && (
                  <svg aria-hidden="true">
                    <use href={`/icons-sprite.svg#${fillWith}-symbol`} />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default ExampleBoard;
