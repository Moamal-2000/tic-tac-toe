import {
  EMPTY_SCORES,
  MOVE_SCORES,
  SYMBOL_O,
  SYMBOL_X,
} from "@/data/constants";

export function hasNoSquaresAvailable(board) {
  return board.every((row) => row.every(({ fillWith }) => fillWith));
}

export function isUniform(row, player) {
  const isEmptySquare = row[0]?.fillWith === "";
  if (isEmptySquare) return false;

  const confirmed = row.every((squareData) => {
    const isUniform = squareData?.fillWith === row[0]?.fillWith;

    return (
      isUniform &&
      !squareData.isFrozen &&
      (player === squareData?.fillWith || !player)
    );
  });

  return confirmed ? row[0]?.fillWith : false;
}

export function isWinByLine(board, player) {
  const size = board.length;

  for (let i = 0; i < size; i++) {
    const row = board[i];
    const column = board.map((row) => row[i]);
    const rowWinner = isUniform(row, player);
    const colWinner = isUniform(column, player);

    // If checking a specific player
    if (player && (rowWinner || colWinner)) {
      return player;
    }

    // If checking for any winner
    if (!player && (rowWinner || colWinner)) {
      return rowWinner || colWinner;
    }
  }

  return false;
}

export function isWinDiagonally(board, player) {
  const size = board.length;

  const diagonal1 = [];
  const diagonal2 = [];

  for (let i = 0; i < size; i++) {
    diagonal1.push(board[i][i]);
    diagonal2.push(board[i][size - 1 - i]);
  }

  return isUniform(diagonal1, player) || isUniform(diagonal2, player);
}

export function whoWins(board, player) {
  const winnerByLine = isWinByLine(board, player);
  const winnerByDiagonal = isWinDiagonally(board, player);

  const winner = winnerByLine || winnerByDiagonal;

  if (winner) {
    return player ? player : winner;
  }

  return "None";
}

export function updateCoolDownStatus(powerUps) {
  for (const key in powerUps) {
    const powerUp = powerUps[key];

    if (!powerUp.available) powerUp.coolDown -= 1;
    if (powerUp.coolDown <= 0) {
      powerUp.available = true;
      powerUp.coolDown = 10;
    }
  }
}

export function bothPlayersWonWithSwap({ newBoard, usedPowerUp }) {
  const isFirstPlayerWon = whoWins(newBoard, SYMBOL_O);
  const isSecondPlayerWon = whoWins(newBoard, SYMBOL_X);

  const bothWon = isFirstPlayerWon !== "None" && isSecondPlayerWon !== "None";
  const usedSwap = usedPowerUp === "swap";

  return usedSwap && bothWon;
}

export function opponentSymbolExists(board, playerTurn) {
  const opponent = playerTurn === SYMBOL_X ? SYMBOL_O : SYMBOL_X;
  let symbols = "";

  for (let i = 0; i < board.length; i++) {
    const row = board[i];

    for (let j = 0; j < row.length; j++) {
      const square = row[j];
      if (square.fillWith && !square.isFrozen) symbols += square.fillWith;
    }
  }

  return symbols.includes(opponent);
}

export function getPlacedSymbolCount(board) {
  return board.flat().filter((square) => square.fillWith).length;
}

export function getUpdatedScores({
  scores,
  winner,
  playerTurn,
  type,
  board,
  rowIndex,
  columnIndex,
} = {}) {
  if (!scores) return EMPTY_SCORES;

  const updatedScores = { ...scores };

  if (type && MOVE_SCORES[type]) {
    if (type.startsWith("win-by")) updatedScores[winner] += MOVE_SCORES.win;
    updatedScores[playerTurn] += MOVE_SCORES[type];

    if (type === "bomb-squares")
      applyBombScores({
        board,
        rowIndex,
        columnIndex,
        playerTurn,
        updatedScores,
      });

    return updatedScores;
  }

  if (winner === "Draw!") {
    updatedScores[SYMBOL_X] += MOVE_SCORES.draw;
    updatedScores[SYMBOL_O] += MOVE_SCORES.draw;
    return updatedScores;
  }

  if (winner) {
    updatedScores[winner] += MOVE_SCORES.win;
  }

  return updatedScores;
}

export function getBombSquareStates({
  board,
  rowIndex,
  columnIndex,
  radius = 1,
}) {
  const bombSquareStates = [];
  const boardSize = board.length;

  for (let rowOffset = -radius; rowOffset <= radius; rowOffset += 1) {
    for (let colOffset = -radius; colOffset <= radius; colOffset += 1) {
      const currentRow = rowIndex + rowOffset;
      const currentCol = columnIndex + colOffset;

      const isOutOfBounds =
        currentRow < 0 ||
        currentCol < 0 ||
        currentRow >= boardSize ||
        currentCol >= boardSize;

      if (isOutOfBounds) continue;

      const squareData = board[currentRow][currentCol];

      if (squareData.isFrozen) {
        bombSquareStates.push("unfreeze");
        continue;
      }

      if (squareData.fillWith === SYMBOL_X) {
        bombSquareStates.push("bomb-player-square");
        continue;
      }

      if (squareData.fillWith === SYMBOL_O) {
        bombSquareStates.push("bomb-opponent-square");
        continue;
      }
    }
  }

  return bombSquareStates;
}

export function applyBombScores({
  board,
  rowIndex,
  columnIndex,
  playerTurn,
  updatedScores,
}) {
  const squaresStats = getBombSquareStates({ board, rowIndex, columnIndex });

  for (let i = 0; i < squaresStats.length; i++) {
    updatedScores[playerTurn] += MOVE_SCORES[squaresStats[i]];
  }
}
