import { Cell } from "./Cell.js";

export class Board {
  constructor(size) {
    this.size = size;
    this.grid = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => new Cell())
    );
  }

  getCell(row, col) {
    return this.grid[row][col];
  }

  setCell(row, col, symbol) {
    this.grid[row][col].owner = symbol;
  }

  isCellFree(row, col) {
    const cell = this.getCell(row, col);
    return !cell.owner && !cell.freezed;
  }
}
