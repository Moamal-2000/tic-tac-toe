import { Ability } from "./Ability.js";

export class Player {
  constructor(id, symbol) {
    this.id = id;
    this.symbol = symbol; // 'A' | 'B'
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

  getAbilitiesState() {
    const state = {};
    for (const [key, ability] of Object.entries(this.abilities)) {
      state[key] = ability.getState();
    }
    return state;
  }
}
