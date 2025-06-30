export class Ability {
  constructor(type, initialCooldown) {
    this.type = type; // 'freeze', 'bomb', 'swap'
    this.cooldown = 0;
    this.initialCooldown = initialCooldown;
  }

  use() {
    if (this.cooldown > 0) return false;
    this.cooldown = this.initialCooldown;
    return true;
  }

  decrementCooldown() {
    if (this.cooldown > 0) this.cooldown -= 1;
  }

  getState() {
    return {
      type: this.type,
      cooldown: this.cooldown,
    };
  }
}
