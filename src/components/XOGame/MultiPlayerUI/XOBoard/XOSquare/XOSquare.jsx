import { SYMBOL_O, SYMBOL_X } from "@/data/constants";
import { getSquareAriaLabel } from "@/functions/accessibilityHelper";
import { getSquareClasses } from "@/functions/classNames";
import { socket } from "@/socket/socket";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import s from "./XOSquare.module.scss";

const XOSquare = ({ squareData, disabled, onClick, rowIndex, columnIndex }) => {
  const {
    boardSize,
    playerTurn,
    powerUps,
    mySymbol,
    squaresToSwap,
    opponentHoveredSquare,
    updateMultiplayerState,
  } = useMultiplayerStore();

  const { owner, isFrozen, isBombed, swapSelected } = squareData;
  const hasSelectSquares = squaresToSwap.length >= 2;
  const shouldSwap = hasSelectSquares && swapSelected;

  // Create a compatibility object for accessibility functions
  const compatibleSquareData = {
    fillWith: owner,
    isFrozen,
    isBombed,
    swapSelected,
  };

  // Only show power-up hover effects for the current player
  const isMyTurn =
    (playerTurn === SYMBOL_O && mySymbol === SYMBOL_O) ||
    (playerTurn === SYMBOL_X && mySymbol === SYMBOL_X);

  const powerUpsForClasses = isMyTurn
    ? powerUps
    : { selectedPower: null, whoUsingPower: null };

  // Handle hover events to broadcast to opponent
  const handleMouseEnter = () => {
    const { selectedPower } = powerUps;
    if (selectedPower && isMyTurn) {
      updateMultiplayerState({
        hoveredSquare: { row: rowIndex, col: columnIndex },
      });
      socket.emit("square-hover", {
        row: rowIndex,
        col: columnIndex,
        power: selectedPower,
      });
    }
  };

  const handleMouseLeave = () => {
    const { selectedPower } = powerUps;
    if (selectedPower && isMyTurn) {
      updateMultiplayerState({ hoveredSquare: null });
      socket.emit("square-hover", { row: null, col: null, power: null });
    }
  };

  // Check if this square is being hovered by opponent
  const isOpponentHovering =
    opponentHoveredSquare &&
    opponentHoveredSquare.row === rowIndex &&
    opponentHoveredSquare.col === columnIndex;

  const classes = getSquareClasses({
    cssModule: s,
    boardSize,
    powerUps: powerUpsForClasses,
    fillWith: owner,
    playerTurn,
    hasSelectSquares,
    swapSelected,
  });

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
      aria-label={getSquareAriaLabel(compatibleSquareData)}
      data-opponent-hover={isOpponentHovering}
    >
      {owner && (
        <svg aria-hidden="true">
          <use href={`/icons-sprite.svg#${owner}-symbol`} />
        </svg>
      )}
      {isFrozen && <span className={s.freeze} />}
      {isBombed && <span className={s.bomb} />}
      {shouldSwap && <span className={s.swap} />}
      {isOpponentHovering && opponentHoveredSquare.power === "freeze" && (
        <span className={s.opponentFreezePreview} />
      )}
      {isOpponentHovering && opponentHoveredSquare.power === "bomb" && (
        <span className={s.opponentBombPreview} />
      )}
      {isOpponentHovering && opponentHoveredSquare.power === "swap" && (
        <span className={s.opponentSwapPreview} />
      )}
    </button>
  );
};

export default XOSquare;
