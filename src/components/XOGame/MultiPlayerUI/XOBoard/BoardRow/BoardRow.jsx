import { BUTTON_SOUND, soundFiles } from "@/data/sounds";
import { shouldDisableSquare } from "@/functions/accessibilityHelper";
import usePreloadSounds from "@/hooks/usePreloadSounds";
import { socket } from "@/socket/socket";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import XOSquare from "../XOSquare/XOSquare";
import s from "./BoardRow.module.scss";

const BoardRow = ({ row, rowIndex }) => {
  const {
    hasGameStarted,
    playerTurn,
    winner,
    draw,
    fillSquare,
    powerUps,
    usePowerUp,
  } = useMultiplayerStore((s) => s);
  const { whoUsingPower, selectedPower, hasActivePowerUp } = powerUps;
  const playSound = usePreloadSounds(soundFiles);

  function handleSquareClick(rowIndex, columnIndex) {
    // Block interaction if game has ended (win or draw) or hasn't started
    if (!hasGameStarted || winner || draw) return;

    playSound(BUTTON_SOUND, 0.3);

    // If freeze power-up is selected, emit ability event
    if (selectedPower === "freeze") {
      socket.emit("ability", {
        ability: "freeze",
        row: rowIndex,
        col: columnIndex,
      });
      return;
    }

    // Otherwise, emit regular move
    socket.emit("move", { row: rowIndex, col: columnIndex });
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
