import { SCREEN_SIZES, SYMBOL_O, SYMBOL_X } from "@/data/constants";

export function getSquareClasses({
  cssModule,
  boardSize,
  powerUps,
  playerTurn,
  hasSelectSquares,
  playMode,
  fillWith,
  swapSelected,
  hiddenTime,
}) {
  const isOpponent = fillWith !== playerTurn;
  const isAutoHideMode = playMode === "autoHideMode";
  const shouldTransparent = isAutoHideMode && hiddenTime === 1;

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
    shouldTransparent ? cssModule.transparent : "",
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

export function getPlayerIndicatorClasses({
  cssModule,
  boardSize,
  winner,
  hideOn,
  showOn,
  hideUntilShow,
}) {
  return [
    cssModule.indicator,
    boardSize === 3 ? cssModule.x3 : "",
    boardSize === 5 ? cssModule.x5 : "",
    winner ? cssModule.disable : "",
    hideUntilShow ? cssModule.hideUntilShow : "",
    getScreenSizeClass(cssModule, hideOn, "hideOn"),
    getScreenSizeClass(cssModule, showOn, "showOn"),
  ].join(" ");
}

export function getScreenSizeClass(cssModule, screenSize, prefix) {
  const screenEntries = Object.entries(SCREEN_SIZES);

  const screenEntry = screenEntries.find((screenEntries) => {
    const screen = screenEntries[1];
    return screen.size === screenSize;
  });

  if (!screenEntry) return "";

  const screenName = screenEntry[0];

  const camelCasedClassName =
    prefix + screenName[0].toUpperCase() + screenName.slice(1);

  return cssModule[camelCasedClassName] || "";
}
