import {
  BOMB_SOUND,
  BUTTON_SOUND,
  soundFiles,
  SWAP_SOUND,
  UNSELECT_SOUND,
} from "@/data/sounds";
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
    squaresToSwap,
    updateMultiplayerState,
    mySymbol,
  } = useMultiplayerStore((s) => s);
  const { whoUsingPower, selectedPower, hasActivePowerUp } = powerUps;
  const playSound = usePreloadSounds(soundFiles);
  const isMyTurn = playerTurn === mySymbol;

  function handleSquareClick(rowIndex, columnIndex) {
    // Block interaction if game has ended (win or draw) or hasn't started
    if (!hasGameStarted || winner || draw) return;

    playSound(BUTTON_SOUND, 0.3);

    // If swap power-up is selected, handle swap selection logic
    if (selectedPower === "swap") {
      const squareData = row[columnIndex];
      const isEmptySquare = squareData.owner === "" || !squareData.owner;
      const isAlreadySelected = squareData.swapSelected;
      const isFirstSelection = squaresToSwap.length === 0;
      const isSecondSelection = squaresToSwap.length === 1;

      // Invalid: can't swap empty squares
      if (isEmptySquare) {
        return;
      }

      // First selection
      if (isFirstSelection && !isSecondSelection) {
        playSound(BUTTON_SOUND, 0.3);
        const newSquaresToSwap = [[rowIndex, columnIndex]];

        // Update the local state immediately
        updateMultiplayerState({ squaresToSwap: newSquaresToSwap });
        socket.emit("ability", {
          ability: "swap",
          row: rowIndex,
          col: columnIndex,
          action: "select",
        });
        return;
      }

      // Unselect if clicking the same square
      if (isAlreadySelected) {
        playSound(UNSELECT_SOUND, 0.3);
        updateMultiplayerState({ squaresToSwap: [] });
        socket.emit("ability", {
          ability: "swap",
          row: rowIndex,
          col: columnIndex,
          action: "unselect",
        });
        return;
      }

      // Second selection - perform swap
      if (isSecondSelection) {
        playSound(SWAP_SOUND, 0.3);
        const [firstRow, firstCol] = squaresToSwap[0];
        socket.emit("ability", {
          ability: "swap",
          row: firstRow,
          col: firstCol,
          row2: rowIndex,
          col2: columnIndex,
        });
        updateMultiplayerState({ squaresToSwap: [] });
        return;
      }
    }

    // If freeze power-up is selected, emit ability event
    if (selectedPower === "freeze") {
      socket.emit("ability", {
        ability: "freeze",
        row: rowIndex,
        col: columnIndex,
      });
      return;
    }

    // If bomb power-up is selected, emit ability event
    if (selectedPower === "bomb") {
      playSound(BOMB_SOUND, 0.25);
      socket.emit("ability", {
        ability: "bomb",
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
        // Create compatible squareData for shouldDisableSquare
        const compatibleSquareData = {
          fillWith: squareData.owner,
          isFrozen: squareData.isFrozen,
          isBombed: squareData.isBombed,
          swapSelected: squareData.swapSelected,
        };

        const disable = shouldDisableSquare({
          hasGameStarted,
          squareData: compatibleSquareData,
          playerTurn,
          selectedPower,
          hasActivePowerUp,
        });

        return (
          <XOSquare
            key={columnIndex}
            squareData={squareData}
            disabled={!disable || !isMyTurn}
            onClick={() => handleSquareClick(rowIndex, columnIndex)}
          />
        );
      })}
    </div>
  );
};

export default BoardRow;
