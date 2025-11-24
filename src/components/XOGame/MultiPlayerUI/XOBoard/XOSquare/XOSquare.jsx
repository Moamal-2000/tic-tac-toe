import { getSquareAriaLabel } from "@/functions/accessibilityHelper";
import { getSquareClasses } from "@/functions/classNames";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useXOStore } from "@/stores/xo.store/xo.store";
import s from "./XOSquare.module.scss";

const XOSquare = ({ squareData, disabled, onClick }) => {
  const { powerUps, squaresToSwap, playerTurn } = useXOStore((s) => s);
  const { boardSize } = useMultiplayerStore((s) => s);
  const { owner, isFrozen, isBombed, swapSelected } = squareData;
  const hasSelectSquares = squaresToSwap.length >= 2;
  const shouldSwap = hasSelectSquares && swapSelected;

  const classes = getSquareClasses({
    cssModule: s,
    boardSize,
    powerUps,
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
      aria-label={getSquareAriaLabel(squareData)}
    >
      {fillWith && (
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
