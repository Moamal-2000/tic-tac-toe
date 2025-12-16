import { SYMBOL_O, SYMBOL_X } from "@/data/constants";
import { getSquareAriaLabel } from "@/functions/accessibilityHelper";
import { getSquareClasses } from "@/functions/classNames";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import s from "./XOSquare.module.scss";

const XOSquare = ({ squareData, disabled, onClick }) => {
  const { boardSize, playerTurn, powerUps, mySymbol, squaresToSwap } =
    useMultiplayerStore((s) => s);
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
      disabled={disabled}
      aria-label={getSquareAriaLabel(compatibleSquareData)}
    >
      {owner && (
        <svg aria-hidden="true">
          <use href={`/icons-sprite.svg#${owner}-symbol`} />
        </svg>
      )}
      {isFrozen && <span className={s.freeze} />}
      {isBombed && <span className={s.bomb} />}
      {shouldSwap && <span className={s.swap} />}
    </button>
  );
};

export default XOSquare;
