"use client";

import { SYMBOL_O, SYMBOL_X } from "@/data/constants";
import { POWER_UPS_BUTTONS } from "@/data/staticData";
import { shouldDisablePowerUp } from "@/functions/accessibilityHelper";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import PowerUpButton from "./PowerUpButton/PowerUpButton";
import s from "./PowerUps.module.scss";

const PowerUps = ({ player }) => {
  const { boardSize, board, powerUps, playerTurn, winner, draw, mySymbol } =
    useMultiplayerStore((s) => s);

  // Determine if this is the active player's panel (for styling)
  const isPlayer1Turn = playerTurn === SYMBOL_X;
  const isPlayer2Turn = playerTurn === SYMBOL_O;
  const isActivePanel =
    (player === "player1" && isPlayer1Turn) ||
    (player === "player2" && isPlayer2Turn);

  // Determine if this panel belongs to the local player
  const isMyPanel =
    (player === "player1" && mySymbol === SYMBOL_X) ||
    (player === "player2" && mySymbol === SYMBOL_O);

  // Determine if buttons should be disabled because it's not this player's turn
  const isNotMyTurn =
    (player === "player1" && !isPlayer1Turn) ||
    (player === "player2" && !isPlayer2Turn);

  const classes = [
    s.powerUps,
    boardSize === 3 ? s.hidden : "",
    player === "player1" ? s.player1 : "",
    player === "player2" ? s.player2 : "",
    !isActivePanel ? s.display : "",
  ].join(" ");

  return (
    <div className={classes}>
      {POWER_UPS_BUTTONS.map((buttonData) => {
        const powerUpData = powerUps[player]?.[buttonData.name] || {};
        const { available = false, coolDown = 0 } = powerUpData;
        const disable =
          shouldDisablePowerUp({
            available,
            powerName: buttonData.name,
            board,
            playerTurn,
            winner,
            draw,
            isNotMyTurn,
            powerUps,
            isMultiplayer: true,
          }) || !isMyPanel;

        return (
          <PowerUpButton
            key={buttonData.name}
            data={{ ...buttonData, available, coolDown, player }}
            disabled={disable}
          />
        );
      })}
    </div>
  );
};

export default PowerUps;
