import { applyAction, getWinner, otherPlayer } from "@/ai/engine";
import { SYMBOL_O, SYMBOL_X } from "@/data/constants";
import { whoWins } from "@/lib/gameUtility";

function hashGameState(state) {
  const parts = [state.boardSize, state.playerTurn];
  for (const row of state.board) {
    for (const cell of row) {
      const fillWith = cell.fillWith || "_";
      let frozenMarker = "_";
      if (cell.isFrozen) {
        frozenMarker = "F";
      }

      parts.push(fillWith);
      parts.push(frozenMarker);
    }
  }
  const powerUps = state.powerUps;
  for (const symbol of [SYMBOL_O, SYMBOL_X]) {
    for (const powerUpType of ["freeze", "bomb", "swap"]) {
      const powerUp = powerUps[symbol][powerUpType];
      let availableFlag = "0";
      if (powerUp.available) {
        availableFlag = "1";
      }
      parts.push(symbol, powerUpType, availableFlag, String(powerUp.coolDown));
    }
  }

  // simple string hash to uint32
  let hashValue = 2166136261;
  const serialized = parts.join("|");
  for (let index = 0; index < serialized.length; index++) {
    hashValue ^= serialized.charCodeAt(index);
    hashValue = Math.imul(hashValue, 16777619);
  }
  return hashValue >>> 0;
}

function createSeededRng(seed) {
  let rngState = seed;
  if (!rngState) {
    rngState = 1;
  }

  return () => {
    // xorshift32
    rngState ^= rngState << 13;
    rngState ^= rngState >>> 17;
    rngState ^= rngState << 5;
    return (rngState >>> 0) / 4294967296;
  };
}

let callNonce = 0;

function randomUint32() {
  const cryptoApi = globalThis.crypto;
  if (cryptoApi && typeof cryptoApi.getRandomValues === "function") {
    const randomBuffer = new Uint32Array(1);
    cryptoApi.getRandomValues(randomBuffer);
    return randomBuffer[0] >>> 0;
  }
  return (Math.floor(Math.random() * 4294967296) >>> 0) >>> 0;
}

function getAvailable3x3Placements(board) {
  const actions = [];
  for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
    for (let colIndex = 0; colIndex < 3; colIndex++) {
      if (!board[rowIndex][colIndex].fillWith) {
        actions.push({ type: "place", row: rowIndex, col: colIndex });
      }
    }
  }
  return actions;
}

function apply3x3Placement(board, action, symbol) {
  const next = board.map((row) => row.map((cell) => ({ ...cell })));
  next[action.row][action.col].fillWith = symbol;
  return next;
}

function hasEmptyCellOn3x3Board(board) {
  for (const row of board) {
    for (const cell of row) {
      if (!cell.fillWith) return true;
    }
  }
  return false;
}

function score3x3MinimaxPosition(board, turn, me, ply, alpha, beta) {
  const winner = whoWins(board);
  if (winner === me) return 10 - ply;
  if (winner !== "None") return ply - 10;
  if (!hasEmptyCellOn3x3Board(board)) return 0;

  const actions = getAvailable3x3Placements(board);
  const maximizing = turn === me;
  let bestScore = -Infinity;
  if (!maximizing) {
    bestScore = Infinity;
  }

  for (const action of actions) {
    const next = apply3x3Placement(board, action, turn);
    const score = score3x3MinimaxPosition(
      next,
      otherPlayer(turn),
      me,
      ply + 1,
      alpha,
      beta,
    );

    if (maximizing) {
      bestScore = Math.max(bestScore, score);
      alpha = Math.max(alpha, bestScore);
    } else {
      bestScore = Math.min(bestScore, score);
      beta = Math.min(beta, bestScore);
    }

    if (beta <= alpha) break;
  }

  return bestScore;
}

function choose3x3Action(state, rng) {
  const me = state.playerTurn;
  const opponent = otherPlayer(me);
  const actions = getAvailable3x3Placements(state.board);

  if (!actions.length) {
    return { action: null, debug: { reason: "3x3_no_legal_actions" } };
  }

  const scored = actions
    .map((action) => {
      const next = apply3x3Placement(state.board, action, me);
      const score = score3x3MinimaxPosition(
        next,
        opponent,
        me,
        1,
        -Infinity,
        Infinity,
      );
      return { action, score };
    })
    .sort((left, right) => right.score - left.score);

  const bestScore = scored[0].score;
  const bestActions = scored
    .filter((entry) => entry.score === bestScore)
    .map((entry) => entry.action);
  const pickBest = () => bestActions[Math.floor(rng() * bestActions.length)];

  return { action: pickBest(), debug: { reason: "3x3_hard_perfect" } };
}

function getWinningLinesForBoard(board) {
  const boardSize = board.length;
  const lines = [];

  for (let rowIndex = 0; rowIndex < boardSize; rowIndex++) {
    lines.push(board[rowIndex].map((_, colIndex) => [rowIndex, colIndex]));
  }

  for (let colIndex = 0; colIndex < boardSize; colIndex++) {
    lines.push(board.map((_, rowIndex) => [rowIndex, colIndex]));
  }

  lines.push(
    Array.from({ length: boardSize }, (_, diagonalIndex) => [
      diagonalIndex,
      diagonalIndex,
    ]),
  );
  lines.push(
    Array.from({ length: boardSize }, (_, diagonalIndex) => [
      diagonalIndex,
      boardSize - 1 - diagonalIndex,
    ]),
  );

  return lines;
}

function countOccupiedCells(board) {
  let placed = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell.fillWith) placed++;
    }
  }
  return placed;
}

function getCrowdedBoardThreshold(boardSize) {
  if (boardSize <= 3) return 0.78;
  return 0.65;
}

function isCrowdedBoard(state) {
  const total = state.boardSize * state.boardSize;
  const placed = countOccupiedCells(state.board);
  const crowdedRatio = getCrowdedBoardThreshold(state.boardSize);
  return placed >= Math.ceil(total * crowdedRatio);
}

function scoreBombRemoval(state, me, action) {
  let removed = 0;
  let oppRemoved = 0;
  let myRemoved = 0;

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const rowIndex = action.row + dx;
      const colIndex = action.col + dy;
      if (
        rowIndex < 0 ||
        colIndex < 0 ||
        rowIndex >= state.boardSize ||
        colIndex >= state.boardSize
      )
        continue;
      const cell = state.board[rowIndex][colIndex];
      // Frozen squares are only unfrozen by bomb, not removed.
      if (cell.isFrozen || !cell.fillWith) continue;
      removed++;
      if (cell.fillWith === me) myRemoved++;
      else oppRemoved++;
    }
  }

  return {
    removed,
    score: removed * 100 + oppRemoved * 12 - myRemoved * 8,
  };
}

function pickCrowdedBoardBomb(state, me, legalActions) {
  if (!isCrowdedBoard(state)) return null;

  const bombActions = legalActions.filter(
    (candidateAction) => candidateAction.type === "bomb",
  );
  if (!bombActions.length) return null;

  let best = null;
  let bestScore = -Infinity;
  let bestRemoved = 0;

  for (const action of bombActions) {
    const { removed, score } = scoreBombRemoval(state, me, action);
    if (score > bestScore) {
      best = action;
      bestScore = score;
      bestRemoved = removed;
    }
  }

  if (bestRemoved >= 2) {
    return best;
  }
  return null;
}

function getHardSearchConfig(boardSize) {
  if (boardSize <= 3) {
    return {
      depth: 8,
      actionCap: 64,
      candidateCap: 9,
    };
  }

  return {
    depth: 4,
    actionCap: 50,
    candidateCap: 8,
  };
}

function evaluateLineControl(board, coords, me) {
  let meCount = 0;
  let opponentCount = 0;
  let emptyCount = 0;
  let frozenCount = 0;

  for (const [rowIndex, colIndex] of coords) {
    const cell = board[rowIndex][colIndex];
    if (cell.isFrozen) {
      frozenCount++;
      continue;
    }
    if (!cell.fillWith) emptyCount++;
    else if (cell.fillWith === me) meCount++;
    else opponentCount++;
  }

  // Any frozen in a line makes it impossible to win by that line (per rules)
  // but it can still matter as a blockade, so we treat it as neutral/blocked.
  if (frozenCount > 0) {
    return 0;
  }

  if (meCount > 0 && opponentCount > 0) return 0;

  // Threats: size-1 and 1 empty
  const lineLength = coords.length;
  if (meCount === lineLength - 1 && emptyCount === 1) return 500;
  if (opponentCount === lineLength - 1 && emptyCount === 1) return -550;

  // Preference for building uncontested lines
  if (opponentCount === 0) return meCount * meCount * 12;
  if (meCount === 0) return -(opponentCount * opponentCount * 12);

  return 0;
}

export function evaluateState(state, me) {
  if (state.forcedDraw) return 0;

  const winner = getWinner(state);
  if (winner === me) return 100000;
  if (winner === "Draw!") return 0;
  if (winner !== "None" && winner !== me) return -100000;

  const board = state.board;
  let score = 0;

  for (const line of getWinningLinesForBoard(board)) {
    score += evaluateLineControl(board, line, me);
  }

  // Mild preference for center control on odd boards
  const boardSize = board.length;
  if (boardSize % 2 === 1) {
    const middleIndex = Math.floor(boardSize / 2);
    const center = board[middleIndex][middleIndex];
    if (!center.isFrozen) {
      if (center.fillWith === me) score += 10;
      if (center.fillWith === otherPlayer(me)) score -= 10;
    }
  }

  // Power-up availability is valuable (more so on larger boards)
  const myPowerUps = state.powerUps[me];
  const availableCount = (powerUpType) => {
    if (myPowerUps[powerUpType].available) {
      return 1;
    }
    return 0;
  };
  score +=
    8 * availableCount("freeze") +
    10 * availableCount("bomb") +
    14 * availableCount("swap");

  return score;
}

export function getLegalActions(state) {
  const boardSize = state.boardSize;
  const me = state.playerTurn;
  const opponent = otherPlayer(me);
  const actions = [];

  // Place
  for (let rowIndex = 0; rowIndex < boardSize; rowIndex++) {
    for (let colIndex = 0; colIndex < boardSize; colIndex++) {
      if (!state.board[rowIndex][colIndex].fillWith) {
        actions.push({ type: "place", row: rowIndex, col: colIndex });
      }
    }
  }

  const myPowerUps = state.powerUps[me];

  // Freeze
  if (myPowerUps.freeze.available) {
    for (let rowIndex = 0; rowIndex < boardSize; rowIndex++) {
      for (let colIndex = 0; colIndex < boardSize; colIndex++) {
        const cell = state.board[rowIndex][colIndex];
        if (cell.fillWith === opponent && !cell.isFrozen) {
          actions.push({ type: "freeze", row: rowIndex, col: colIndex });
        }
      }
    }
  }

  // Bomb
  if (myPowerUps.bomb.available) {
    for (let rowIndex = 0; rowIndex < boardSize; rowIndex++) {
      for (let colIndex = 0; colIndex < boardSize; colIndex++) {
        let hasEffect = false;
        for (let dx = -1; dx <= 1 && !hasEffect; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const targetRowIndex = rowIndex + dx;
            const targetColIndex = colIndex + dy;
            if (
              targetRowIndex < 0 ||
              targetColIndex < 0 ||
              targetRowIndex >= boardSize ||
              targetColIndex >= boardSize
            ) {
              continue;
            }
            const cell = state.board[targetRowIndex][targetColIndex];
            if (cell.isFrozen || cell.fillWith) {
              hasEffect = true;
              break;
            }
          }
        }
        if (hasEffect) {
          actions.push({ type: "bomb", row: rowIndex, col: colIndex });
        }
      }
    }
  }

  // Swap (only occupied squares)
  if (myPowerUps.swap.available) {
    const occupiedSquares = [];
    for (let rowIndex = 0; rowIndex < boardSize; rowIndex++) {
      for (let colIndex = 0; colIndex < boardSize; colIndex++) {
        if (state.board[rowIndex][colIndex].fillWith) {
          occupiedSquares.push([rowIndex, colIndex]);
        }
      }
    }

    if (occupiedSquares.length >= 2) {
      for (
        let firstSquareIndex = 0;
        firstSquareIndex < occupiedSquares.length;
        firstSquareIndex++
      ) {
        for (
          let secondSquareIndex = firstSquareIndex + 1;
          secondSquareIndex < occupiedSquares.length;
          secondSquareIndex++
        ) {
          const [firstRowIndex, firstColIndex] =
            occupiedSquares[firstSquareIndex];
          const [secondRowIndex, secondColIndex] =
            occupiedSquares[secondSquareIndex];
          const firstValue = state.board[firstRowIndex][firstColIndex].fillWith;
          const secondValue =
            state.board[secondRowIndex][secondColIndex].fillWith;
          if (firstValue !== secondValue) {
            actions.push({
              type: "swap",
              a: occupiedSquares[firstSquareIndex],
              b: occupiedSquares[secondSquareIndex],
            });
          }
        }
      }
    }
  }

  return actions;
}

function prioritizeActions(state, me, actions, cap) {
  // Lightweight ordering: immediate win > block immediate loss > best heuristic delta.
  const scored = actions.map((action) => {
    const nextState = applyAction(state, action);

    // swap special-case: if both win => forced draw
    if (action.type === "swap") {
      const bothWon =
        whoWins(nextState.board, SYMBOL_O) !== "None" &&
        whoWins(nextState.board, SYMBOL_X) !== "None";
      if (bothWon) {
        nextState.forcedDraw = true;
      }
    }

    const winner = getWinner(nextState);
    let score = 0;
    if (winner === me) score = 1e9;
    else if (winner !== "None" && winner !== "Draw!") score = -1e9;
    else if (winner === "Draw!") score = 0;
    else {
      score = evaluateState(nextState, me);
      if (action.type === "freeze") score -= 20;
      if (action.type === "swap") score -= 15;
      if (action.type === "bomb") {
        score -= 25;
        let myHit = 0;
        let opponentHit = 0;
        let frozenHit = 0;
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const rowIndex = action.row + dx;
            const colIndex = action.col + dy;
            if (
              rowIndex < 0 ||
              colIndex < 0 ||
              rowIndex >= state.boardSize ||
              colIndex >= state.boardSize
            )
              continue;
            const cell = state.board[rowIndex][colIndex];
            if (cell.isFrozen) frozenHit++;
            if (cell.fillWith === me) myHit++;
            if (cell.fillWith === otherPlayer(me)) opponentHit++;
          }
        }
        if (opponentHit === 0 && frozenHit === 0) score -= 80;
        score -= myHit * 10;
      }
    }

    return { action, score };
  });

  scored.sort((left, right) => right.score - left.score);
  return scored.slice(0, cap).map((entry) => entry.action);
}

function minimax(state, me, depth, alpha, beta, actionCap) {
  const winner = getWinner(state);
  if (state.forcedDraw) return { score: 0, action: null };
  if (winner !== "None") {
    if (winner === me) return { score: 100000, action: null };
    if (winner === "Draw!") return { score: 0, action: null };
    return { score: -100000, action: null };
  }

  if (depth === 0) return { score: evaluateState(state, me), action: null };

  const maximizing = state.playerTurn === me;
  const actions = prioritizeActions(
    state,
    me,
    getLegalActions(state),
    actionCap,
  );

  let bestAction = actions[0] || null;

  if (maximizing) {
    let bestScore = -Infinity;
    for (const action of actions) {
      const nextState = applyAction(state, action);
      const { score } = minimax(
        nextState,
        me,
        depth - 1,
        alpha,
        beta,
        actionCap,
      );
      if (score > bestScore) {
        bestScore = score;
        bestAction = action;
      }
      alpha = Math.max(alpha, bestScore);
      if (beta <= alpha) break;
    }
    return { score: bestScore, action: bestAction };
  }

  let bestScore = Infinity;
  for (const action of actions) {
    const nextState = applyAction(state, action);
    const { score } = minimax(nextState, me, depth - 1, alpha, beta, actionCap);
    if (score < bestScore) {
      bestScore = score;
      bestAction = action;
    }
    beta = Math.min(beta, bestScore);
    if (beta <= alpha) break;
  }
  return { score: bestScore, action: bestAction };
}

function wouldActionLeadToLoss(state, me, action) {
  // Check if this action would lead to an unavoidable loss
  const nextState = applyAction(state, action);
  const opponent = otherPlayer(me);

  // Check if opponent has immediate winning move
  const opponentLegalActions = getLegalActions(nextState);
  const opponentWinningMove = opponentLegalActions.find((oppAction) => {
    const afterOppMove = applyAction(nextState, oppAction);
    return getWinner(afterOppMove) === opponent;
  });

  if (opponentWinningMove) {
    return true; // This action allows opponent to win immediately
  }

  // Check if opponent would have unblockable multiple threats
  const opponentThreats = findOpponentThreats(nextState, opponent);
  if (opponentThreats.length > 1) {
    // Multiple threats: check if we can block all of them with one move
    const blockingActions = findOpponentBlockingActions(
      nextState,
      opponent,
      opponentThreats,
    );

    // If we have fewer unique block positions than threats, it's unblockable
    const uniqueBlockPositions = new Set();
    for (const action of blockingActions) {
      if (action.type === "place") {
        uniqueBlockPositions.add(`${action.row},${action.col}`);
      }
    }

    if (uniqueBlockPositions.size < opponentThreats.length) {
      return true; // Can't block all threats with one move
    }
  }

  return false;
}

function findOpponentThreats(state, opponent) {
  // Find cells where opponent has 3 symbols that can lead to a win
  const threats = [];
  const boardSize = state.boardSize;
  const board = state.board;

  for (const line of getWinningLinesForBoard(board)) {
    let opponentCount = 0;
    let emptyCount = 0;
    let emptyCells = [];
    let frozenCount = 0;

    for (const [rowIndex, colIndex] of line) {
      const cell = board[rowIndex][colIndex];
      if (cell.isFrozen) {
        frozenCount++;
      } else if (!cell.fillWith) {
        emptyCount++;
        emptyCells.push([rowIndex, colIndex]);
      } else if (cell.fillWith === opponent) {
        opponentCount++;
      }
    }

    // A threat is: opponent has (lineLength - 1) symbols, 1 empty cell, and no frozen cells
    const lineLength = line.length;
    if (
      opponentCount === lineLength - 1 &&
      emptyCount === 1 &&
      frozenCount === 0
    ) {
      threats.push({
        emptyCells,
        opponentCount,
      });
    }
  }

  return threats;
}

function findOpponentBlockingActions(state, opponent, threats) {
  // Find power-up or placement actions that block opponent threats
  const me = state.playerTurn;
  const blockingActions = [];
  const myPowerUps = state.powerUps[me];

  // Check power-up based blocking first
  if (threats.length > 0) {
    // Freeze power-up: freeze opponent's symbols to break the threat
    if (myPowerUps.freeze.available) {
      for (let rowIndex = 0; rowIndex < state.boardSize; rowIndex++) {
        for (let colIndex = 0; colIndex < state.boardSize; colIndex++) {
          const cell = state.board[rowIndex][colIndex];
          if (cell.fillWith === opponent && !cell.isFrozen) {
            blockingActions.push({
              type: "freeze",
              row: rowIndex,
              col: colIndex,
              isUsingPowerUp: true,
            });
          }
        }
      }
    }

    // Bomb power-up: remove opponent's symbols to break the threat
    if (myPowerUps.bomb.available) {
      for (let rowIndex = 0; rowIndex < state.boardSize; rowIndex++) {
        for (let colIndex = 0; colIndex < state.boardSize; colIndex++) {
          let hasEffect = false;
          for (let dx = -1; dx <= 1 && !hasEffect; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              const targetRowIndex = rowIndex + dx;
              const targetColIndex = colIndex + dy;
              if (
                targetRowIndex < 0 ||
                targetColIndex < 0 ||
                targetRowIndex >= state.boardSize ||
                targetColIndex >= state.boardSize
              ) {
                continue;
              }
              const cell = state.board[targetRowIndex][targetColIndex];
              if (cell.fillWith === opponent && !cell.isFrozen) {
                hasEffect = true;
                break;
              }
            }
          }
          if (hasEffect) {
            blockingActions.push({
              type: "bomb",
              row: rowIndex,
              col: colIndex,
              isUsingPowerUp: true,
            });
          }
        }
      }
    }

    // Swap power-up: swap opponent's symbol with one of ours to break the threat
    if (myPowerUps.swap.available) {
      const occupiedSquares = [];
      for (let rowIndex = 0; rowIndex < state.boardSize; rowIndex++) {
        for (let colIndex = 0; colIndex < state.boardSize; colIndex++) {
          if (state.board[rowIndex][colIndex].fillWith) {
            occupiedSquares.push([rowIndex, colIndex]);
          }
        }
      }

      if (occupiedSquares.length >= 2) {
        for (
          let firstSquareIndex = 0;
          firstSquareIndex < occupiedSquares.length;
          firstSquareIndex++
        ) {
          const [firstRowIndex, firstColIndex] =
            occupiedSquares[firstSquareIndex];
          const firstValue = state.board[firstRowIndex][firstColIndex].fillWith;

          // Only consider swaps where we swap an opponent symbol with one of ours
          if (firstValue === opponent) {
            for (
              let secondSquareIndex = firstSquareIndex + 1;
              secondSquareIndex < occupiedSquares.length;
              secondSquareIndex++
            ) {
              const [secondRowIndex, secondColIndex] =
                occupiedSquares[secondSquareIndex];
              const secondValue =
                state.board[secondRowIndex][secondColIndex].fillWith;

              if (secondValue === me) {
                blockingActions.push({
                  type: "swap",
                  a: [firstRowIndex, firstColIndex],
                  b: [secondRowIndex, secondColIndex],
                  isUsingPowerUp: true,
                });
              }
            }
          }
        }
      }
    }
  }

  // If power-ups available, return them first (higher priority)
  if (blockingActions.length > 0) {
    return blockingActions;
  }

  // If no power-ups, place symbols to block the threat
  if (threats.length > 0) {
    const blockPlacements = [];
    for (const threat of threats) {
      for (const [rowIndex, colIndex] of threat.emptyCells) {
        blockPlacements.push({
          type: "place",
          row: rowIndex,
          col: colIndex,
          isBlocking: true,
        });
      }
    }
    return blockPlacements;
  }

  return [];
}

export function chooseBotAction(state) {
  const me = state.playerTurn;
  callNonce = (callNonce + 1) >>> 0;
  const seed = (hashGameState(state) ^ randomUint32() ^ callNonce) >>> 0;
  const rng = createSeededRng(seed);

  if (state.boardSize === 3) {
    return choose3x3Action(state, rng);
  }

  let legal = getLegalActions(state);
  if (!legal.length)
    return { action: null, debug: { reason: "no_legal_actions" } };

  // Filter out actions that would lead to unavoidable loss
  const safeLegalActions = legal.filter(
    (action) => !wouldActionLeadToLoss(state, me, action),
  );

  // If all actions lead to loss, keep the original legal actions
  if (safeLegalActions.length > 0) {
    legal = safeLegalActions;
  }

  // Check for opponent threats and handle them first
  const opponent = otherPlayer(me);
  const opponentThreats = findOpponentThreats(state, opponent);
  if (opponentThreats.length > 0) {
    const blockingActions = findOpponentBlockingActions(
      state,
      opponent,
      opponentThreats,
    );
    if (blockingActions.length > 0) {
      // Filter to only legal actions
      const legalBlockingActions = blockingActions.filter((action) =>
        legal.some((la) => {
          if (la.type === "swap" && action.type === "swap") {
            return (
              (la.a[0] === action.a[0] &&
                la.a[1] === action.a[1] &&
                la.b[0] === action.b[0] &&
                la.b[1] === action.b[1]) ||
              (la.a[0] === action.b[0] &&
                la.a[1] === action.b[1] &&
                la.b[0] === action.a[0] &&
                la.b[1] === action.a[1])
            );
          }
          return (
            la.type === action.type &&
            la.row === action.row &&
            la.col === action.col
          );
        }),
      );

      if (legalBlockingActions.length > 0) {
        // Prefer power-ups over placement
        const powerUpActions = legalBlockingActions.filter(
          (a) => a.isUsingPowerUp,
        );
        const actionToTake =
          powerUpActions.length > 0
            ? powerUpActions[0]
            : legalBlockingActions[0];

        const resultAction =
          actionToTake.type === "swap"
            ? {
                type: actionToTake.type,
                a: actionToTake.a,
                b: actionToTake.b,
              }
            : {
                type: actionToTake.type,
                row: actionToTake.row,
                col: actionToTake.col,
              };

        return {
          action: resultAction,
          debug: {
            reason: actionToTake.isUsingPowerUp
              ? "hard_block_threat_with_powerup"
              : "hard_block_threat",
          },
        };
      }
    }
  }

  const immediateWin = legal.find((action) => {
    const next = applyAction(state, action);
    return getWinner(next) === me;
  });
  if (immediateWin) {
    return { action: immediateWin, debug: { reason: "hard_immediate_win" } };
  }

  const crowdedBomb = pickCrowdedBoardBomb(state, me, legal);
  if (crowdedBomb) {
    return { action: crowdedBomb, debug: { reason: "hard_crowded_bomb" } };
  }

  const { depth, actionCap, candidateCap } = getHardSearchConfig(
    state.boardSize,
  );
  const candidates = prioritizeActions(
    state,
    me,
    legal,
    Math.min(candidateCap, legal.length),
  );
  let bestScore = -Infinity;
  const best = [];
  for (const candidateAction of candidates) {
    const next = applyAction(state, candidateAction);
    const { score } = minimax(
      next,
      me,
      depth - 1,
      -Infinity,
      Infinity,
      actionCap,
    );
    if (score > bestScore) {
      bestScore = score;
      best.length = 0;
      best.push(candidateAction);
    } else if (score === bestScore) {
      best.push(candidateAction);
    }
  }
  let pick = null;
  if (best.length) {
    pick = best[Math.floor(rng() * best.length)];
  }
  if (pick) return { action: pick, debug: { reason: "hard_minimax_d4" } };
  const res = minimax(state, me, depth, -Infinity, Infinity, actionCap);
  return { action: res.action, debug: { reason: "hard_minimax_d4" } };
}
