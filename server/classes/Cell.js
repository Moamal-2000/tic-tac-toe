export class Cell {
  constructor() {
    this.owner = null; // 'x' | 'o' | null
    this.frozen = false;
    this.bombed = false;
    this.swapSelected = false;
  }
}
