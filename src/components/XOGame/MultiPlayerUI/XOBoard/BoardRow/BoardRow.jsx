import { shouldDisableSquare } from "@/functions/accessibilityHelper";
import usePreloadSounds from "@/hooks/usePreloadSounds";
import { socket } from "@/socket/socket";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useXOStore } from "@/stores/xo.store/xo.store";
import { BUTTON_SOUND, soundFiles } from "../../../../../data/sounds";
import XOSquare from "../XOSquare/XOSquare";
import s from "./BoardRow.module.scss";

const BoardRow = ({ row, rowIndex }) => {
  const { fillSquare, powerUps, usePowerUp } = useXOStore((s) => s);
  const { hasGameStarted, playerTurn } = useMultiplayerStore((s) => s);
  const { whoUsingPower, selectedPower, hasActivePowerUp } = powerUps;
  const playSound = usePreloadSounds(soundFiles);

  function handleSquareClick(rowIndex, columnIndex) {
    // if (!whoUsingPower) {
    playSound(BUTTON_SOUND, 0.3);
    // fillSquare(rowIndex, columnIndex);
    // return;
    socket.emit("move", { row: rowIndex, col: columnIndex });
    // }

    // usePowerUp({ rowIndex, columnIndex, playSound });
  }

  return (
    <div className={s.row}>
      {row.map((squareData, columnIndex) => {
        const disable = shouldDisableSquare({
          hasGameStarted,
          squareData,
          playerTurn,
          selectedPower,
          hasActivePowerUp,
        });

        return (
          <XOSquare
            key={columnIndex}
            squareData={squareData}
            disabled={!disable}
            onClick={() => handleSquareClick(rowIndex, columnIndex)}
          />
        );
      })}
    </div>
  );
};

export default BoardRow;
