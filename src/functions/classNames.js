import { SYMBOL_O, SYMBOL_X } from "@/data/constants";

export function getSquareClasses({
  cssModule,
  boardSize,
  fillWith,
  powerUps,
  swapSelected,
  playerTurn,
  hasSelectSquares,
}) {
  const isOpponent = fillWith !== playerTurn;
  const activeFreezeHover =
    powerUps.selectedPower === "freeze" && fillWith && isOpponent;
  const activeSwapHover =
    powerUps.selectedPower === "swap" && !hasSelectSquares;

  return [
    cssModule.square,
    boardSize === 4 ? cssModule.x4 : "",
    boardSize === 5 ? cssModule.x5 : "",
    fillWith === SYMBOL_X ? cssModule.playerX : "",
    fillWith === SYMBOL_O ? cssModule.playerO : "",
    activeFreezeHover ? cssModule.freezeHover : "",
    activeSwapHover && fillWith ? cssModule.swapHover : "",
    powerUps.selectedPower === "bomb" ? cssModule.bombHover : "",
    swapSelected ? cssModule.select : "",
  ].join(" ");
}

export function getExampleBoardSquareClasses({ cssModule, fillWith, type }) {
  return [
    cssModule.square,
    fillWith === SYMBOL_X ? cssModule.playerX : "",
    fillWith === SYMBOL_O ? cssModule.playerO : "",
    type?.includes("winning") ? cssModule.winning : "",
    type?.includes("frozen") ? cssModule.frozen : "",
    type?.includes("targeted") ? cssModule.targeted : "",
    type?.includes("selected") ? cssModule.selected : "",
  ].join(" ");
}
