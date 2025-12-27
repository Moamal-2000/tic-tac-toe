import { getPlacedSymbolCount, opponentSymbolExists } from "./gameUtility";

export function getSquareAriaLabel(squareData) {
  if (squareData.fillWith === "") return "Empty square, click to make a move";

  if (squareData.swapSelected)
    return "Selected square, click on opponent square to swap";

  if (squareData.isFrozen) return "Frozen square, cannot make a move";

  return `${squareData.fillWith} symbol, occupied square`;
}

export function shouldDisableSquare({
  hasGameStart,
  squareData,
  playerTurn,
  selectedPower,
  hasActivePowerUp,
  isBotTurn = false,
}) {
  const { fillWith, isBombed, isFrozen } = squareData;

  const isEmpty = fillWith === "";
  const isPlayerSymbol = fillWith === playerTurn;
  const isOpponentSymbol = !isEmpty && !isPlayerSymbol;
  const noPowerAndFilled = !selectedPower && !isEmpty;

  if (
    !hasGameStart ||
    noPowerAndFilled ||
    isBombed ||
    hasActivePowerUp ||
    isBotTurn
  ) {
    return true;
  }

  if (selectedPower === "freeze") {
    return !isOpponentSymbol || isFrozen;
  }

  if (selectedPower === "swap") {
    return isEmpty;
  }

  return false;
}

export function shouldDisablePowerUp({
  available,
  powerName,
  board,
  playerTurn,
  winner,
  draw,
  isMyTurn,
  powerUps,
  isMultiplayer = false,
}) {
  if (isMultiplayer) {
    return powerUps.hasActivePowerUp || !available || winner || draw;
  }

  // For single player, calculate locally
  const numberOfPlacedSymbols = getPlacedSymbolCount(board);
  const hasOpponentSymbol = opponentSymbolExists(board, playerTurn);
  const hasTwoSymbols = numberOfPlacedSymbols < 2;

  const swapCondition = powerName === "swap" && hasTwoSymbols;
  const freezeCondition = powerName === "freeze" && !hasOpponentSymbol;

  return (
    powerUps.hasActivePowerUp ||
    !available ||
    !isMyTurn ||
    winner ||
    draw ||
    swapCondition ||
    freezeCondition
  );
}
