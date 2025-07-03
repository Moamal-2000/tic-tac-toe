"use client";

import SvgIcon from "@/components/Shared/SvgIcon";
import { SYMBOL_O, SYMBOL_X } from "@/data/constants";
import s from "./PlayerTurnIndicator.module.scss";

const PlayerTurnIndicator = ({ playerTurn, boardSize, winner }) => {
  const p1ActiveClass = playerTurn === SYMBOL_O ? s.active : "";
  const p2ActiveClass = playerTurn === SYMBOL_X ? s.active : "";

  const containerClasses = [
    s.indicator,
    boardSize === 3 ? s.x3 : "",
    boardSize === 5 ? s.x5 : "",
    winner ? s.disable : "",
  ].join(" ");

  return (
    <div className={containerClasses}>
      <div className={`${s.player} ${s.p1} ${p1ActiveClass}`}>
        <div className={s.symbol}>
          <SvgIcon name="o-symbol" />
        </div>

        <span className={s.label}>P1</span>
      </div>

      <div className={`${s.player} ${s.p2} ${p2ActiveClass}`}>
        <div className={s.symbol}>
          <SvgIcon name="x-symbol" />
        </div>

        <span className={s.label}>P2</span>
      </div>
    </div>
  );
};

export default PlayerTurnIndicator;
