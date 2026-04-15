import { MOVE_SCORES } from "@/data/constants";
import { BUTTON_SOUND, soundFiles } from "@/data/sounds";
import usePreloadSounds from "@/hooks/app/usePreloadSounds";
import { getAnimationPositions } from "@/hooks/app/useScoreAnimation";
import { shouldDisableSquare } from "@/lib/accessibilityHelper";
import { calculateBombScore } from "@/lib/gameUtility";
import { useGlobalStore } from "@/stores/global.store/global.store";
import { useXOStore } from "@/stores/xo.store/xo.store";
import XOSquare from "../XOSquare/XOSquare";
import s from "./BoardRow.module.scss";

const BoardRow = ({ row, rowIndex, animationHook }) => {
  const {
    hasGameStart,
    fillSquare,
    powerUps,
    usePowerUp,
    playerTurn,
    winner,
    squaresToSwap,
    board,
  } = useXOStore();
  const gameMode = useGlobalStore((s) => s.gameMode);

  const { whoUsingPower, selectedPower, hasActivePowerUp } = powerUps;
  const playSound = usePreloadSounds(soundFiles);
  const createAnimation = animationHook?.createAnimation || {};

  const isBotTurn =
    gameMode === "computer" &&
    hasGameStart &&
    !winner &&
    playerTurn === "x" &&
    !powerUps.hasActivePowerUp &&
    squaresToSwap.length === 0;

  function triggerScoreAnimation(cellElement, pointsEarned, player) {
    if (!createAnimation || !cellElement) return;

    const targetPlayer = player === "o" ? "player1" : "player2";
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
    });
  }

  function handleSquareClick(rowIndex, columnIndex, cellElement) {
    if (!whoUsingPower) {
      playSound(BUTTON_SOUND, 0.3);
      triggerScoreAnimation(cellElement, MOVE_SCORES.fill, playerTurn);
      fillSquare(rowIndex, columnIndex);
      return;
    }

    const squareData = row[columnIndex];
    const isAlreadySelected = squareData?.swapSelected;

    const shouldAnimate =
      selectedPower === "freeze" ||
      selectedPower === "bomb" ||
      (selectedPower === "swap" &&
        squaresToSwap.length === 1 &&
        !isAlreadySelected);

    if (shouldAnimate) {
      const powerPoints = calculatePowerPoints(rowIndex, columnIndex);
      triggerScoreAnimation(cellElement, powerPoints, playerTurn);
    }

    usePowerUp({ rowIndex, columnIndex, playSound });
  }

  function calculatePowerPoints(rowIndex, columnIndex) {
    let pointsForPower;

    if (selectedPower === "freeze") {
      pointsForPower = MOVE_SCORES["freeze-square"];
    }

    if (selectedPower === "swap") {
      pointsForPower = MOVE_SCORES["swap-squares"];
    }

    if (selectedPower === "bomb") {
      pointsForPower = calculateBombScore({
        board,
        rowIndex,
        columnIndex,
        playerTurn,
      });
    }

    return pointsForPower;
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
            onClick={(event) =>
              handleSquareClick(rowIndex, columnIndex, event.currentTarget)
            }
          />
        );
      })}
    </div>
  );
};

export default BoardRow;
