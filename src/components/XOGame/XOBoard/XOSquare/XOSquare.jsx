import SvgIcon from "@/components/Shared/SvgIcon";
import { getSquareAriaLabel } from "@/functions/accessibilityHelper";
import { getSquareClasses } from "@/functions/classNames";
import { useXOStore } from "@/stores/xo.store/xo.store";
import s from "./XOSquare.module.scss";

const XOSquare = ({ squareData, disabled, onClick }) => {
  const { boardSize, powerUps, squaresToSwap, playerTurn } = useXOStore(
    (s) => s
  );
  const { fillWith, isFrozen, isBombed, swapSelected } = squareData;
  const hasSelectSquares = squaresToSwap.length >= 2;
  const shouldSwap = hasSelectSquares && squareData.swapSelected;

  const classes = getSquareClasses({
    cssModule: s,
    boardSize,
    fillWith,
    powerUps,
    swapSelected,
    playerTurn,
    hasSelectSquares,
  });

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={getSquareAriaLabel(squareData)}
    >
      {fillWith && <SvgIcon name={`${fillWith}-symbol`} />}
      {isFrozen && <span className={s.freeze} />}
      {isBombed && <span className={s.bomb} />}
      {shouldSwap && <span className={s.swap} />}
    </button>
  );
};

export default XOSquare;
