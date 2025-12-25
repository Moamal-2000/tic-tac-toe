import { SYMBOL_O, SYMBOL_X } from "@/data/constants";
import { hasNoSquaresAvailable, whoWins } from "@/functions/gameUtility";
import { getInitialCoolDown } from "@/stores/xo.store/states";

export function createInitialPowerUps(boardSize) {
  const coolDown = getInitialCoolDown(boardSize);
  const initial = () => ({ available: true, coolDown });
  return {
    [SYMBOL_O]: { freeze: initial(), bomb: initial(), swap: initial() },
    [SYMBOL_X]: { freeze: initial(), bomb: initial(), swap: initial() },
  };
}

export function createEmptyBoard(boardSize) {
  return Array.from({ length: boardSize }, () =>
    Array.from({ length: boardSize }, () => ({
      fillWith: "",
      isFrozen: false,
    }))
  );
}

export function createInitialState({ boardSize = 4 } = {}) {
  return {
    boardSize,
    playerTurn: SYMBOL_O,
    board: createEmptyBoard(boardSize),
    powerUps: createInitialPowerUps(boardSize),
  };
}

export function cloneBoard(board) {
  return board.map((row) => row.map((cell) => ({ ...cell })));
}

export function otherPlayer(player) {
  return player === SYMBOL_X ? SYMBOL_O : SYMBOL_X;
}

export function countPlacedSymbols(board) {
  return board.flat().filter((c) => c.fillWith).length;
}

export function updateCoolDownStatusPure(playerPowerUps) {
  const next = {
    freeze: { ...playerPowerUps.freeze },
    bomb: { ...playerPowerUps.bomb },
    swap: { ...playerPowerUps.swap },
  };

  for (const key of Object.keys(next)) {
    const powerUp = next[key];
    if (!powerUp.available) powerUp.coolDown -= 1;
    if (powerUp.coolDown <= 0) {
      powerUp.available = true;
      powerUp.coolDown = 10;
    }
  }

  return next;
}

export function tickCooldowns(state) {
  return {
    ...state,
    powerUps: {
      ...state.powerUps,
      [SYMBOL_O]: updateCoolDownStatusPure(state.powerUps[SYMBOL_O]),
      [SYMBOL_X]: updateCoolDownStatusPure(state.powerUps[SYMBOL_X]),
    },
  };
}

export function getWinner(state) {
  if (state.forcedDraw) return "Draw!";

  const winner = whoWins(state.board);
  const full = hasNoSquaresAvailable(state.board);

  if (winner !== "None") return winner;
  if (full) return "Draw!";
  return "None";
}

function applyPlace(state, { row, col }) {
  const board = cloneBoard(state.board);
  const cell = board[row]?.[col];
  if (!cell || cell.fillWith) return state;

  cell.fillWith = state.playerTurn;

  const nextState = { ...state, board };
  const winnerForCurrent = whoWins(board, state.playerTurn);
  const isFull = hasNoSquaresAvailable(board);
  const isTerminal = winnerForCurrent !== "None" || isFull;

  return {
    ...nextState,
    playerTurn: isTerminal ? state.playerTurn : otherPlayer(state.playerTurn),
  };
}

function applyFreeze(state, { row, col }) {
  const board = cloneBoard(state.board);
  const cell = board[row]?.[col];
  if (!cell || !cell.fillWith || cell.isFrozen) return state;

  const opponent = otherPlayer(state.playerTurn);
  if (cell.fillWith !== opponent) return state;

  cell.isFrozen = true;

  return {
    ...state,
    board,
    playerTurn: opponent,
  };
}

function applyBomb(state, { row, col }) {
  const board = cloneBoard(state.board);
  const size = board.length;

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const r = row + dx;
      const c = col + dy;
      if (r < 0 || c < 0 || r >= size || c >= size) continue;

      const cell = board[r][c];
      if (cell.isFrozen) {
        cell.isFrozen = false;
        continue;
      }
      cell.fillWith = "";
    }
  }

  return {
    ...state,
    board,
    playerTurn: otherPlayer(state.playerTurn),
  };
}

function applySwap(state, { a, b }) {
  const board = cloneBoard(state.board);
  const [r1, c1] = a;
  const [r2, c2] = b;
  const cell1 = board[r1]?.[c1];
  const cell2 = board[r2]?.[c2];
  if (!cell1 || !cell2) return state;
  if (!cell1.fillWith || !cell2.fillWith) return state;

  const tmp = cell1.fillWith;
  cell1.fillWith = cell2.fillWith;
  cell2.fillWith = tmp;

  return {
    ...state,
    board,
    playerTurn: otherPlayer(state.playerTurn),
  };
}

export function applyAction(state, action) {
  const current = {
    boardSize: state.boardSize,
    board: state.board,
    playerTurn: state.playerTurn,
    powerUps: state.powerUps,
  };

  const me = current.playerTurn;
  const powerUpsForMe = current.powerUps[me];

  let next = current;

  if (action.type === "place") {
    next = applyPlace(current, action);
  }

  if (action.type === "freeze") {
    if (!powerUpsForMe.freeze.available) return state;
    next = applyFreeze(current, action);
    next = {
      ...next,
      powerUps: {
        ...next.powerUps,
        [me]: {
          ...next.powerUps[me],
          freeze: { ...powerUpsForMe.freeze, available: false },
        },
      },
    };
  }

  if (action.type === "bomb") {
    if (!powerUpsForMe.bomb.available) return state;
    next = applyBomb(current, action);
    next = {
      ...next,
      powerUps: {
        ...next.powerUps,
        [me]: {
          ...next.powerUps[me],
          bomb: { ...powerUpsForMe.bomb, available: false },
        },
      },
    };
  }

  if (action.type === "swap") {
    if (!powerUpsForMe.swap.available) return state;
    if (countPlacedSymbols(current.board) < 2) return state;
    next = applySwap(current, action);

    const bothWon =
      whoWins(next.board, SYMBOL_O) !== "None" &&
      whoWins(next.board, SYMBOL_X) !== "None";

    next = {
      ...next,
      powerUps: {
        ...next.powerUps,
        [me]: {
          ...next.powerUps[me],
          swap: { ...powerUpsForMe.swap, available: false },
        },
      },
      forcedDraw: bothWon,
    };
  }

  next = tickCooldowns(next);

  return next;
}

export function normalizeFromStore({ board, boardSize, playerTurn, powerUps }) {
  return {
    boardSize,
    playerTurn,
    board: board.map((row) =>
      row.map((cell) => ({
        fillWith: cell.fillWith,
        isFrozen: !!cell.isFrozen,
      }))
    ),
    powerUps: {
      [SYMBOL_O]: {
        freeze: { ...powerUps.player1.freeze },
        bomb: { ...powerUps.player1.bomb },
        swap: { ...powerUps.player1.swap },
      },
      [SYMBOL_X]: {
        freeze: { ...powerUps.player2.freeze },
        bomb: { ...powerUps.player2.bomb },
        swap: { ...powerUps.player2.swap },
      },
    },
  };
}
