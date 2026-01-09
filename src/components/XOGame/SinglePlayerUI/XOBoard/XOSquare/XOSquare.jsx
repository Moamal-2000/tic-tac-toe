import { getSquareAriaLabel } from "@/functions/accessibilityHelper";
import { getSquareClasses } from "@/functions/classNames";
import { useXOStore } from "@/stores/xo.store/xo.store";
import { useTranslations } from "next-intl";
import s from "./XOSquare.module.scss";

const XOSquare = ({ squareData, disabled, onClick }) => {
  const { boardSize, powerUps, squaresToSwap, playerTurn, playMode } =
    useXOStore();
  const t = useTranslations();

  const { fillWith, isFrozen, isBombed, swapSelected } = squareData;
  const hasSelectSquares = squaresToSwap.length >= 2;
  const shouldSwap = hasSelectSquares && swapSelected;

  const classes = getSquareClasses({
    cssModule: s,
    boardSize,
    powerUps,
    playerTurn,
    hasSelectSquares,
    squareData,
    playMode,
    fillWith,
    swapSelected,
    hiddenTime: squareData?.hiddenTime,
  });

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={getSquareAriaLabel(squareData, t)}
    >
      {fillWith && (
        <svg aria-hidden="true">
          <use href={`/icons-sprite.svg#${fillWith}-symbol`} />
        </svg>
      )}
      {isFrozen && <span className={s.freeze} />}
      {isBombed && <span className={s.bomb} />}
      {shouldSwap && <span className={s.swap} />}
    </button>
  );
};

export default XOSquare;
