import { Player } from "./Player.js";
import { Board } from "./Board.js";

export class Game {
  constructor(id, socketA, socketB, boardSize) {
    this.id = id;
    this.board = new Board(boardSize);
    this.players = {
      A: new Player(socketA.id, "A"),
      B: new Player(socketB.id, "B"),
    };
    this.turn = "A";
    this.winner = null;
    this.moveCount = 0;
  }

  getCurrentPlayer() {
    return this.players[this.turn];
  }

  getOpponentSymbol() {
    return this.turn === "A" ? "B" : "A";
  }

  applyMove(row, col) {
    if (!this.board.isCellFree(row, col)) return false;
    this.board.setCell(row, col, this.turn);
    this.players[this.turn].decrementCooldowns();
    this.moveCount++;
    if (this.checkWin(row, col)) {
      this.winner = this.turn;
    } else {
      this.turn = this.getOpponentSymbol();
    }
    return true;
  }

  useAbility(ability, row, col, row2, col2) {
    const player = this.getCurrentPlayer();
    const cell = this.board.getCell(row, col);

    if (!player.abilities[ability] || !player.abilities[ability].use()) {
      return false;
    }

    switch (ability) {
      case "freeze":
        cell.freezed = true;
        break;
      case "bomb":
        if (cell.owner) cell.owner = null;
        break;
      case "swap":
        const cell2 = this.board.getCell(row2, col2);
        const cellOwner = cell.owner;
        cell.owner = cell2.owner;
        cell2.owner = cellOwner;
        break;
    }

    return true;
  }

  checkWin(row, col) {
    const symbol = this.turn;
    const size = this.board.size;

    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];

    for (const [dr, dc] of directions) {
      if (this.countAligned(row, col, dr, dc, symbol) >= size) {
        return true;
      }
    }

    return false;
  }

  countAligned(row, col, dr, dc, symbol) {
    let count = 1;

    for (const dir of [-1, 1]) {
      let r = row + dr * dir;
      let c = col + dc * dir;

      while (this.inBounds(r, c) && this.board.getCell(r, c).owner === symbol) {
        count++;
        r += dr * dir;
        c += dc * dir;
      }
    }

    return count;
  }

  inBounds(row, col) {
    const n = this.board.size;
    return row >= 0 && col >= 0 && row < n && col < n;
  }

  getState() {
    return {
      board: this.board.grid.map((row) =>
        row.map((cell) => ({
          owner: cell.owner,
          freezed: cell.freezed,
        }))
      ),
      abilities: {
        A: this.players.A.getAbilitiesState(),
        B: this.players.B.getAbilitiesState(),
      },
      turn: this.turn,
      winner: this.winner,
    };
  }
}
