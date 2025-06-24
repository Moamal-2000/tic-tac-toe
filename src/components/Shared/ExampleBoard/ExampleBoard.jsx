import { getExampleBoardSquareClasses } from "@/functions/classNames";
import SvgIcon from "../SvgIcon";
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
                {fillWith && <SvgIcon name={`${fillWith}-symbol`} />}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default ExampleBoard;
