import { MOVE_SCORES, SYMBOL_O } from "@/data/constants";
import {
  BOMB_SOUND,
  BUTTON_SOUND,
  FREEZE_SOUND,
  soundFiles,
  SWAP_SOUND,
  UNSELECT_SOUND,
} from "@/data/sounds";
import usePreloadSounds from "@/hooks/app/usePreloadSounds";
import { getAnimationPositions } from "@/hooks/app/useScoreAnimation";
import { shouldDisableSquare } from "@/lib/accessibilityHelper";
import { calculateBombScore } from "@/lib/gameUtility";
import { socket } from "@/socket/socket";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import XOSquare from "../XOSquare/XOSquare";
import s from "./BoardRow.module.scss";

const BoardRow = ({
  row,
  rowIndex,
  readOnly = false,
  boardSize: previewBoardSize,
  playerTurn: previewPlayerTurn,
  compact = false,
  animationHook,
}) => {
  const {
    hasGameStarted,
    playerTurn,
    winner,
    draw,
    powerUps,
    squaresToSwap,
    updateMultiplayerState,
    mySymbol,
    boardSize,
    board,
  } = useMultiplayerStore();

  const resolvedBoardSize = previewBoardSize ?? boardSize;
  const resolvedPlayerTurn = previewPlayerTurn ?? playerTurn;

  const { selectedPower, hasActivePowerUp } = powerUps;
  const playSound = usePreloadSounds(soundFiles);
  const isMyTurn = resolvedPlayerTurn === mySymbol;
  const { createAnimation } = animationHook || {};

  function triggerScoreAnimation(cellElement, pointsEarned, player) {
    if (!createAnimation || !cellElement) return;

    const targetPlayer = player === SYMBOL_O ? "player1" : "player2";
    const scoreElement = document.querySelector(
      `[data-score-target="${targetPlayer}"]`,
    );

    if (!scoreElement) {
      console.warn(`Score element not found for player: ${targetPlayer}`);
      return;
    }

    const positions = getAnimationPositions(cellElement, scoreElement);

    createAnimation({
      ...positions,
      points: `${pointsEarned >= 0 ? "+" : ""}${pointsEarned}`,
      playerColor: targetPlayer,
      duration: 1000,
    });
  }

  function handleSquareClick(rowIndex, columnIndex, cellElement) {
    if (!hasGameStarted || winner || draw) return;

    playSound(BUTTON_SOUND, 0.3);

    if (selectedPower === "swap") {
      const squareData = row[columnIndex];
      const isEmptySquare = squareData.owner === "" || !squareData.owner;
      const isAlreadySelected = squareData.swapSelected;
      const isFirstSelection = squaresToSwap.length === 0;
      const isSecondSelection = squaresToSwap.length === 1;

      if (isEmptySquare) return;

      // First selection
      if (isFirstSelection && !isSecondSelection) {
        playSound(BUTTON_SOUND, 0.3);
        const newSquaresToSwap = [[rowIndex, columnIndex]];

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

        triggerScoreAnimation(
          cellElement,
          MOVE_SCORES["swap-squares"],
          mySymbol,
        );

        socket.emit("ability", {
          ability: "swap",
          row: firstRow,
          col: firstCol,
          row2: rowIndex,
          col2: columnIndex,
        });
        updateMultiplayerState({
          squaresToSwap: [],
          hoveredSquare: null,
          opponentHoveredSquare: null,
          powerUps: {
            ...powerUps,
            selectedPower: null,
            whoUsingPower: null,
            hasActivePowerUp: false,
          },
        });
        socket.emit("square-hover", { row: null, col: null, power: null });
        return;
      }
    }

    if (selectedPower === "freeze") {
      playSound(FREEZE_SOUND, 0.3);
      triggerScoreAnimation(
        cellElement,
        MOVE_SCORES["freeze-square"],
        mySymbol,
      );
      socket.emit("ability", {
        ability: "freeze",
        row: rowIndex,
        col: columnIndex,
      });
      updateMultiplayerState({
        hoveredSquare: null,
        opponentHoveredSquare: null,
        powerUps: {
          ...powerUps,
          selectedPower: null,
          whoUsingPower: null,
          hasActivePowerUp: false,
        },
      });
      socket.emit("square-hover", { row: null, col: null, power: null });
      return;
    }

    if (selectedPower === "bomb") {
      playSound(BOMB_SOUND, 0.25);

      const bombScore = calculateBombScore({
        board,
        rowIndex,
        columnIndex,
        playerTurn: mySymbol,
      });
      triggerScoreAnimation(cellElement, bombScore, mySymbol);

      socket.emit("ability", {
        ability: "bomb",
        row: rowIndex,
        col: columnIndex,
      });
      updateMultiplayerState({
        hoveredSquare: null,
        opponentHoveredSquare: null,
        powerUps: {
          ...powerUps,
          selectedPower: null,
          whoUsingPower: null,
          hasActivePowerUp: false,
        },
      });
      socket.emit("square-hover", { row: null, col: null, power: null });
      return;
    }

    triggerScoreAnimation(cellElement, MOVE_SCORES.fill, mySymbol);
    // Otherwise, emit regular move
    socket.emit("move", { row: rowIndex, col: columnIndex });
  }

  return (
    <div className={s.row} dir="ltr">
      {row.map((squareData, columnIndex) => {
        if (!squareData) return null;

        const compatibleSquareData = {
          fillWith: squareData.owner,
          isFrozen: squareData.isFrozen,
          isBombed: squareData.isBombed,
          swapSelected: squareData.swapSelected,
        };

        const disable = readOnly
          ? shouldDisableSquare({
              hasGameStart: hasGameStarted,
              squareData: compatibleSquareData,
              playerTurn: resolvedPlayerTurn,
              selectedPower,
              hasActivePowerUp,
            })
          : shouldDisableSquare({
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
            rowIndex={rowIndex}
            columnIndex={columnIndex}
            disabled={readOnly ? true : !disable || !isMyTurn}
            onClick={
              readOnly
                ? undefined
                : (e) =>
                    handleSquareClick(rowIndex, columnIndex, e.currentTarget)
            }
            boardSize={resolvedBoardSize}
            playerTurn={resolvedPlayerTurn}
            readOnly={readOnly}
            compact={compact}
          />
        );
      })}
    </div>
  );
};

export default BoardRow;
