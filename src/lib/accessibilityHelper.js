import { getPlacedSymbolCount, opponentSymbolExists } from "./gameUtility";

export function getSquareAriaLabel(squareData, t) {
  const translationKey = "aria_labels";

  if (squareData.fillWith === "") return t(`${translationKey}.empty_square`);
  if (squareData.swapSelected) return t(`${translationKey}.selected_square`);
  if (squareData.isFrozen) return t(`${translationKey}.frozen_square`);

  return t(`${translationKey}.occupied_square`, {
    symbol: squareData.fillWith,
  });
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
    return (
      powerUps.hasActivePowerUp || !available || winner || draw || !isMyTurn
    );
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
