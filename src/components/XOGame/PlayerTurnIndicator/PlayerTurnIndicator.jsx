"use client";

import { SYMBOL_O, SYMBOL_X } from "@/data/constants";
import { getPlayerIndicatorClasses } from "@/functions/classNames";
import { useTranslations } from "next-intl";
import s from "./PlayerTurnIndicator.module.scss";

const PlayerTurnIndicator = ({
  playerTurn,
  boardSize,
  winner,
  hideOn,
  showOn,
  hideUntilShow,
}) => {
  const t = useTranslations("global");

  const p1ActiveClass = playerTurn === SYMBOL_O ? s.active : "";
  const p2ActiveClass = playerTurn === SYMBOL_X ? s.active : "";
  const containerClasses = getPlayerIndicatorClasses({
    cssModule: s,
    boardSize,
    winner,
    hideOn,
    showOn,
    hideUntilShow,
  });

  return (
    <div className={containerClasses}>
      <div className={`${s.player} ${s.p1} ${p1ActiveClass}`}>
        <div className={s.symbol}>
          <svg aria-hidden="true">
            <use href="/icons-sprite.svg#o-symbol" />
          </svg>
        </div>

        <span className={s.label}>{t("player")} 1</span>
      </div>

      <div className={`${s.player} ${s.p2} ${p2ActiveClass}`}>
        <div className={s.symbol}>
          <svg aria-hidden="true">
            <use href="/icons-sprite.svg#x-symbol" />
          </svg>
        </div>

        <span className={s.label}>{t("player")} 2</span>
      </div>
    </div>
  );
};

export default PlayerTurnIndicator;
