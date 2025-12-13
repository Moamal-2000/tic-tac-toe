import { Ability } from "./Ability.js";

export class Player {
  constructor(id, symbol) {
    this.id = id;
    this.symbol = symbol; // 'x' | 'o'
    this.abilities = {
      freeze: new Ability("freeze", 3),
      bomb: new Ability("bomb", 4),
      swap: new Ability("swap", 5),
    };
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
