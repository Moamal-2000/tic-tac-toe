"use client";

import { SYMBOL_O, SYMBOL_X } from "@/data/constants";
import { POWER_UPS_BUTTONS } from "@/data/staticData";
import { shouldDisablePowerUp } from "@/functions/accessibilityHelper";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import PowerUpButton from "./PowerUpButton/PowerUpButton";
import s from "./PowerUps.module.scss";

const PowerUps = ({ player }) => {
  const { boardSize, board, powerUps, playerTurn, winner, draw } =
    useMultiplayerStore((s) => s);
  const playerPowerUps = Object.entries(powerUps[player]);
  const isPlayer1 = playerTurn !== SYMBOL_O && player === "player1";
  const isPlayer2 = playerTurn !== SYMBOL_X && player === "player2";

  const classes = [
    s.powerUps,
    boardSize === 3 ? s.hidden : "",
    player === "player1" ? s.player1 : "",
    player === "player2" ? s.player2 : "",
    !(isPlayer1 || isPlayer2) ? s.display : "",
  ].join(" ");

  return (
    <div className={classes}>
      {POWER_UPS_BUTTONS.map((buttonData, index) => {
        const { available, coolDown } = playerPowerUps[index][1];
        const disable = shouldDisablePowerUp({
          available,
          powerName: buttonData.name,
          board,
          playerTurn,
          winner,
          draw,
          isPlayer1,
          isPlayer2,
          powerUps,
        });

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
