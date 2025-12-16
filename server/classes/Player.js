import { Ability } from "./Ability.js";

export class Player {
  constructor(id, symbol, boardSize = 3) {
    this.id = id;
    this.symbol = symbol; // 'x' | 'o'
    const cooldown = this.getInitialCoolDown(boardSize);
    this.abilities = {
      freeze: new Ability("freeze", cooldown),
      bomb: new Ability("bomb", cooldown),
      swap: new Ability("swap", cooldown),
    };
  }

  getInitialCoolDown(boardSize) {
    if (boardSize === 4) return 11;
    if (boardSize === 5) return 16;
    return 16;
  }

  decrementCooldowns() {
    Object.values(this.abilities).forEach((ability) =>
      ability.decrementCooldown()
    );
  }

  getAbilitiesState(board, opponentSymbol) {
    const state = {};
    for (const [key, ability] of Object.entries(this.abilities)) {
      const baseState = ability.getState();
      let available = baseState.available;

      // Additional validation for freeze and swap
      if (board && opponentSymbol) {
        if (key === "freeze" && available) {
          available = board.hasOpponentSymbol(opponentSymbol);
        }
        if (key === "swap" && available) {
          available = board.getPlacedSymbolCount() >= 2;
        }
      }

      state[key] = {
        ...baseState,
        available,
      };
    }
    return state;
  }
}
