import { BOMB_DELETION_DELAY_MS } from "@/data/constants";

export function updateBoard({
  board,
  rowIndex,
  columnIndex,
  playerTurn,
  powerUp,
  squaresToSwap = [],
}) {
  if (powerUp === "Select") {
    const selectedSquare = board[rowIndex][columnIndex];
    board[rowIndex][columnIndex] = { ...selectedSquare, swapSelected: true };
    return board;
  }

  if (powerUp === "swap" && squaresToSwap.length === 2) {
    return swapSymbolsOnBoard({ board, squaresToSwap });
  }

  if (powerUp === "bomb") {
    return triggerBombEffect({ board, rowIndex, columnIndex });
  }

  if (powerUp === "delete bomb") {
    return deleteBombEffect(board);
  }

  const selectedSquare = board[rowIndex][columnIndex];
  const fillWith =
    selectedSquare.fillWith === "" ? playerTurn : selectedSquare.fillWith;

  board[rowIndex][columnIndex] = {
    ...selectedSquare,
    fillWith,
    isFrozen: powerUp === "freeze",
  };

  return board;
}

export function swapSymbolsOnBoard({ board, squaresToSwap }) {
  const [[row1, col1], [row2, col2]] = squaresToSwap;
  const firstSymbol = board[row1]?.[col1]?.fillWith;
  const secondSymbol = board[row2]?.[col2]?.fillWith;

  return board.map((row, i) =>
    row.map((squareData, j) => {
      squareData.swapSelected = false;

      if (i === row1 && j === col1) {
        return { ...squareData, fillWith: secondSymbol };
      }

      if (i === row2 && j === col2) {
        return { ...squareData, fillWith: firstSymbol };
      }

      return squareData;
    })
  );
}

export function triggerBombEffect({
  rowIndex,
  columnIndex,
  board,
  radius = 1,
}) {
  const newBoard = board.map((row) => row.map((square) => ({ ...square })));
  const boardSize = board.length;

  for (let dimensionX = -radius; dimensionX <= radius; dimensionX++) {
    for (let dimensionY = -radius; dimensionY <= radius; dimensionY++) {
      const newRow = rowIndex + dimensionX;
      const newCol = columnIndex + dimensionY;

      const isOutOfBounds =
        newRow < 0 || newCol < 0 || newRow >= boardSize || newCol >= boardSize;

      if (isOutOfBounds) continue;

      const targetedSquare = newBoard[newRow][newCol];

      if (targetedSquare.isFrozen) {
        targetedSquare.isBombed = true;
        setTimeout(() => {
          targetedSquare.isFrozen = false;
        }, BOMB_DELETION_DELAY_MS);
        continue;
      }

      targetedSquare.isBombed = true;
      targetedSquare.fillWith = "";
    }
  }

  return newBoard;
}

export function deleteBombEffect(board) {
  return board.map((row) =>
    row.map((squareData) =>
      squareData.isBombed ? { ...squareData, isBombed: false } : squareData
    )
  );
}

export function unSelectAllSquares(board) {
  return board.map((row) =>
    row.map((squareData) => {
      if (squareData.swapSelected) {
        squareData.swapSelected = false;
      }

      return squareData;
    })
  );
}

export function unSelectSquare(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      const square = board[i][j];

      if (square.swapSelected) {
        square.swapSelected = false;
        return board;
      }
    }
  }

  return board;
}
