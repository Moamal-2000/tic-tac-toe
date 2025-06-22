import { soundFiles } from "@/data/staticData";
import { shouldDisableSquare } from "@/functions/accessibilityHelper";
import usePreloadSounds from "@/hooks/usePreloadSounds";
import { useXOStore } from "@/stores/xo.store/xo.store";
import XOSquare from "../XOSquare/XOSquare";
import s from "./BoardRow.module.scss";

const BoardRow = ({ row, rowIndex }) => {
  const { hasGameStart, fillSquare, powerUps, usePowerUp, playerTurn } =
    useXOStore((s) => s);
  const { whoUsingPower } = powerUps;
  const playSound = usePreloadSounds(soundFiles);

  function handleSquareClick(rowIndex, columnIndex) {
    if (!whoUsingPower) {
      playSound("click4", 0.2);
      fillSquare(rowIndex, columnIndex);
      return;
    }

    usePowerUp({ rowIndex, columnIndex, playSound });
  }

  return (
    <div className={s.row}>
      {row.map((squareData, columnIndex) => {
        const disable = shouldDisableSquare({
          hasGameStart,
          squareData,
          playerTurn,
          powerUps,
        });

        return (
          <XOSquare
            key={columnIndex}
            squareData={squareData}
            disabled={disable}
            onClick={() => handleSquareClick(rowIndex, columnIndex)}
          />
        );
      })}
    </div>
  );
};

export default BoardRow;
