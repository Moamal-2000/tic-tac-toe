import {
  FIRST_PLAYER,
  INITIAL_BOARD_SIZE,
  INITIAL_PLAY_MODE,
  INITIAL_SQUARE_HIDDEN_TIME,
} from "@/data/constants";

export const initialGameStates = ({
  boardSize = INITIAL_BOARD_SIZE,
  playMode = INITIAL_PLAY_MODE,
  squareHiddenTime = InitialHiddenTimeByBoardSize(boardSize),
  stats,
} = {}) => ({
  hasGameStart: true,
  playerTurn: FIRST_PLAYER,
  boardSize,
  playMode,
  squareHiddenTime,
  winner: "",
  board: createBoardBySize(boardSize, playMode, squareHiddenTime),
  isWinnerPopupVisible: false,
  squaresToSwap: [],
  stats: initialStats(stats),
  powerUps: {
    player1: initialPlayerPowerUps(boardSize),
    player2: initialPlayerPowerUps(boardSize),
    selectedPower: null,
    whoUsingPower: null,
    hasActivePowerUp: false,
  },
});

export const initialStats = ({ p1Wins = 0, draws = 0, p2Wins = 0 } = {}) => ({
  p1Wins,
  draws,
  p2Wins,
});

export const initialPlayerPowerUps = (boardSize = INITIAL_BOARD_SIZE) => ({
  freeze: {
    available: true,
    coolDown: getInitialCoolDown(boardSize),
  },
  bomb: {
    available: true,
    coolDown: getInitialCoolDown(boardSize),
  },
  swap: {
    available: true,
    coolDown: getInitialCoolDown(boardSize),
  },
});

export function getInitialCoolDown(boardSize) {
  if (boardSize === 4) return 11;
  if (boardSize === 5) return 16;
  return 16;
}

export function createBoardBySize(
  size = INITIAL_BOARD_SIZE,
  playMode,
  squareHiddenTime
) {
  const InitialSquare = {
    fillWith: "",
    isFrozen: false,
    isBombed: false,
    swapSelected: false,
  };

  if (playMode === "autoHideMode") {
    InitialSquare.hiddenTime = squareHiddenTime;
  }

  const row = Array.from({ length: size }, () => InitialSquare);
  const board = Array.from({ length: size }, () => [...row]);

  return board;
}

export function InitialHiddenTimeByBoardSize(boardSize = INITIAL_BOARD_SIZE) {
  if (boardSize === 4) return 10;
  if (boardSize === 5) return 15;
  return INITIAL_SQUARE_HIDDEN_TIME;
}
