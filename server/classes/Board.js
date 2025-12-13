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
    return !cell.owner && !cell.frozen;
  }

  hasFreeCell() {
    return this.grid.some((row) => row.some((cell) => !cell.owner));
  }

  hasOpponentSymbol(opponentSymbol) {
    return this.grid.some((row) =>
      row.some((cell) => cell.owner === opponentSymbol)
    );
  }

  getPlacedSymbolCount() {
    let count = 0;
    this.grid.forEach((row) => {
      row.forEach((cell) => {
        if (cell.owner) count++;
      });
    });
    return count;
  }
}
