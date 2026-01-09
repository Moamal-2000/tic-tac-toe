import { BUTTON_SOUND, soundFiles } from "@/data/sounds";
import { shouldDisableSquare } from "@/functions/accessibilityHelper";
import usePreloadSounds from "@/hooks/usePreloadSounds";
import { useGlobalStore } from "@/stores/global.store/global.store";
import { useXOStore } from "@/stores/xo.store/xo.store";
import XOSquare from "../XOSquare/XOSquare";
import s from "./BoardRow.module.scss";

const BoardRow = ({ row, rowIndex }) => {
  const {
    hasGameStart,
    fillSquare,
    powerUps,
    usePowerUp,
    playerTurn,
    winner,
    squaresToSwap,
  } = useXOStore();
  const gameMode = useGlobalStore((s) => s.gameMode);

  const { whoUsingPower, selectedPower, hasActivePowerUp } = powerUps;
  const playSound = usePreloadSounds(soundFiles);

  const isBotTurn =
    gameMode === "computer" &&
    hasGameStart &&
    !winner &&
    playerTurn === "x" &&
    !powerUps.hasActivePowerUp &&
    squaresToSwap.length === 0;

  function handleSquareClick(rowIndex, columnIndex) {
    if (!whoUsingPower) {
      playSound(BUTTON_SOUND, 0.3);
      fillSquare(rowIndex, columnIndex);
      return;
    }

    usePowerUp({ rowIndex, columnIndex, playSound });
  }

  return (
    <div className={s.row} dir="ltr">
      {row.map((squareData, columnIndex) => {
        const disable = shouldDisableSquare({
          hasGameStart,
          squareData,
          playerTurn,
          selectedPower,
          hasActivePowerUp,
          isBotTurn,
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
