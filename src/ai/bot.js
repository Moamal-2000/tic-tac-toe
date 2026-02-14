import { applyAction, getWinner, otherPlayer } from "@/ai/engine";
import { SYMBOL_O, SYMBOL_X } from "@/data/constants";
import { whoWins } from "@/functions/gameUtility";

function hashState(state) {
  const parts = [state.boardSize, state.playerTurn];
  for (const row of state.board) {
    for (const c of row) {
      parts.push(c.fillWith || "_");
      parts.push(c.isFrozen ? "F" : "_");
    }
  }
  const pu = state.powerUps;
  for (const p of [SYMBOL_O, SYMBOL_X]) {
    for (const k of ["freeze", "bomb", "swap"]) {
      const v = pu[p][k];
      parts.push(p, k, v.available ? "1" : "0", String(v.coolDown));
    }
  }
  // simple string hash to uint32
  let h = 2166136261;
  const s = parts.join("|");
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function makeRng(seed) {
  let x = seed || 1;
  return () => {
    // xorshift32
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}

let callNonce = 0;

function randomUint32() {
  const c = globalThis.crypto;
  if (c && typeof c.getRandomValues === "function") {
    const a = new Uint32Array(1);
    c.getRandomValues(a);
    return a[0] >>> 0;
  }
  return (Math.floor(Math.random() * 4294967296) >>> 0) >>> 0;
}

function get3x3PlaceActions(board) {
  const actions = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (!board[r][c].fillWith) {
        actions.push({ type: "place", row: r, col: c });
      }
    }
  }
  return actions;
}

function apply3x3Place(board, action, symbol) {
  const next = board.map((row) => row.map((cell) => ({ ...cell })));
  next[action.row][action.col].fillWith = symbol;
  return next;
}

function has3x3Empty(board) {
  for (const row of board) {
    for (const cell of row) {
      if (!cell.fillWith) return true;
    }
  }
  return false;
}

function findWinningPlace3x3(board, player) {
  const actions = get3x3PlaceActions(board);
  for (const action of actions) {
    const next = apply3x3Place(board, action, player);
    if (whoWins(next) === player) return action;
  }
  return null;
}

function minimax3x3(board, turn, me, ply, alpha, beta) {
  const winner = whoWins(board);
  if (winner === me) return 10 - ply;
  if (winner !== "None") return ply - 10;
  if (!has3x3Empty(board)) return 0;

  const actions = get3x3PlaceActions(board);
  const maximizing = turn === me;
  let bestScore = maximizing ? -Infinity : Infinity;

  for (const action of actions) {
    const next = apply3x3Place(board, action, turn);
    const score = minimax3x3(next, otherPlayer(turn), me, ply + 1, alpha, beta);

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

function choose3x3Action(state, difficulty, rng) {
  const me = state.playerTurn;
  const opp = otherPlayer(me);
  const actions = get3x3PlaceActions(state.board);

  if (!actions.length) {
    return { action: null, debug: { reason: "3x3_no_legal_actions" } };
  }

  const immediateWin = findWinningPlace3x3(state.board, me);
  const immediateBlock = findWinningPlace3x3(state.board, opp);

  const scored = actions
    .map((action) => {
      const next = apply3x3Place(state.board, action, me);
      const score = minimax3x3(next, opp, me, 1, -Infinity, Infinity);
      return { action, score };
    })
    .sort((a, b) => b.score - a.score);

  const bestScore = scored[0].score;
  const bestActions = scored
    .filter((entry) => entry.score === bestScore)
    .map((entry) => entry.action);
  const pickBest = () => bestActions[Math.floor(rng() * bestActions.length)];
  const pickAny = () => actions[Math.floor(rng() * actions.length)];

  if (difficulty === "hard") {
    return { action: pickBest(), debug: { reason: "3x3_hard_perfect" } };
  }

  if (difficulty === "medium") {
    if (immediateWin) {
      return { action: immediateWin, debug: { reason: "3x3_medium_win" } };
    }
    if (immediateBlock && rng() < 0.9) {
      return { action: immediateBlock, debug: { reason: "3x3_medium_block" } };
    }
    if (rng() < 0.72) {
      return { action: pickBest(), debug: { reason: "3x3_medium_best" } };
    }
    return { action: pickAny(), debug: { reason: "3x3_medium_noise" } };
  }

  if (immediateWin && rng() < 0.65) {
    return { action: immediateWin, debug: { reason: "3x3_easy_win" } };
  }
  if (immediateBlock && rng() < 0.35) {
    return { action: immediateBlock, debug: { reason: "3x3_easy_block" } };
  }
  if (rng() < 0.25) {
    return { action: pickBest(), debug: { reason: "3x3_easy_best" } };
  }
  return { action: pickAny(), debug: { reason: "3x3_easy_random" } };
}

function linesForBoard(board) {
  const n = board.length;
  const lines = [];

  for (let r = 0; r < n; r++) {
    lines.push(board[r].map((_, c) => [r, c]));
  }

  for (let c = 0; c < n; c++) {
    lines.push(board.map((_, r) => [r, c]));
  }

  lines.push(Array.from({ length: n }, (_, i) => [i, i]));
  lines.push(Array.from({ length: n }, (_, i) => [i, n - 1 - i]));

  return lines;
}

function countPlacedOnBoard(board) {
  let placed = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell.fillWith) placed++;
    }
  }
  return placed;
}

function getCrowdedRatioByBoardSize(boardSize) {
  if (boardSize <= 3) return 0.78;
  return 0.65;
}

function isCrowdedBoard(state) {
  const total = state.boardSize * state.boardSize;
  const placed = countPlacedOnBoard(state.board);
  const crowdedRatio = getCrowdedRatioByBoardSize(state.boardSize);
  return placed >= Math.ceil(total * crowdedRatio);
}

function scoreBombRemoval(state, me, action) {
  let removed = 0;
  let oppRemoved = 0;
  let myRemoved = 0;

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const r = action.row + dx;
      const c = action.col + dy;
      if (r < 0 || c < 0 || r >= state.boardSize || c >= state.boardSize)
        continue;
      const cell = state.board[r][c];
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

  const bombActions = legalActions.filter((a) => a.type === "bomb");
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

  return bestRemoved >= 2 ? best : null;
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

function evalLine(board, coords, me) {
  const opp = otherPlayer(me);
  let meCount = 0;
  let oppCount = 0;
  let emptyCount = 0;
  let frozenCount = 0;

  for (const [r, c] of coords) {
    const cell = board[r][c];
    if (cell.isFrozen) {
      frozenCount++;
      continue;
    }
    if (!cell.fillWith) emptyCount++;
    else if (cell.fillWith === me) meCount++;
    else oppCount++;
  }

  // Any frozen in a line makes it impossible to win by that line (per rules)
  // but it can still matter as a blockade, so we treat it as neutral/blocked.
  if (frozenCount > 0) {
    return 0;
  }

  if (meCount > 0 && oppCount > 0) return 0;

  // Threats: size-1 and 1 empty
  const n = coords.length;
  if (meCount === n - 1 && emptyCount === 1) return 500;
  if (oppCount === n - 1 && emptyCount === 1) return -550;

  // Preference for building uncontested lines
  if (oppCount === 0) return meCount * meCount * 12;
  if (meCount === 0) return -(oppCount * oppCount * 12);

  return 0;
}

export function evaluateState(state, me) {
  if (state.forcedDraw) return 0;

  const wAny = getWinner(state);
  if (wAny === me) return 100000;
  if (wAny === "Draw!") return 0;
  if (wAny !== "None" && wAny !== me) return -100000;

  const board = state.board;
  let score = 0;

  for (const line of linesForBoard(board)) {
    score += evalLine(board, line, me);
  }

  // Mild preference for center control on odd boards
  const n = board.length;
  if (n % 2 === 1) {
    const mid = Math.floor(n / 2);
    const center = board[mid][mid];
    if (!center.isFrozen) {
      if (center.fillWith === me) score += 10;
      if (center.fillWith === otherPlayer(me)) score -= 10;
    }
  }

  // Power-up availability is valuable (more so on larger boards)
  const pu = state.powerUps[me];
  const avail = (k) => (pu[k].available ? 1 : 0);
  score += 8 * avail("freeze") + 10 * avail("bomb") + 14 * avail("swap");

  return score;
}

export function getLegalActions(state) {
  const n = state.boardSize;
  const me = state.playerTurn;
  const opp = otherPlayer(me);
  const actions = [];

  // Place
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (!state.board[r][c].fillWith)
        actions.push({ type: "place", row: r, col: c });
    }
  }

  const pu = state.powerUps[me];

  // Freeze
  if (pu.freeze.available) {
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const cell = state.board[r][c];
        if (cell.fillWith === opp && !cell.isFrozen) {
          actions.push({ type: "freeze", row: r, col: c });
        }
      }
    }
  }

  // Bomb
  if (pu.bomb.available) {
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        let hasEffect = false;
        for (let dx = -1; dx <= 1 && !hasEffect; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const rr = r + dx;
            const cc = c + dy;
            if (rr < 0 || cc < 0 || rr >= n || cc >= n) continue;
            const cell = state.board[rr][cc];
            if (cell.isFrozen || cell.fillWith) {
              hasEffect = true;
              break;
            }
          }
        }
        if (hasEffect) actions.push({ type: "bomb", row: r, col: c });
      }
    }
  }

  // Swap (only occupied squares)
  if (pu.swap.available) {
    const occ = [];
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (state.board[r][c].fillWith) occ.push([r, c]);
      }
    }

    if (occ.length >= 2) {
      for (let i = 0; i < occ.length; i++) {
        for (let j = i + 1; j < occ.length; j++) {
          const [r1, c1] = occ[i];
          const [r2, c2] = occ[j];
          const v1 = state.board[r1][c1].fillWith;
          const v2 = state.board[r2][c2].fillWith;
          if (v1 !== v2) actions.push({ type: "swap", a: occ[i], b: occ[j] });
        }
      }
    }
  }

  return actions;
}

function prioritizeActions(state, me, actions, cap) {
  // Lightweight ordering: immediate win > block immediate loss > best heuristic delta.
  const scored = actions.map((a) => {
    const next = applyAction(state, a);

    // swap special-case: if both win => forced draw
    if (a.type === "swap") {
      const bothWon =
        whoWins(next.board, SYMBOL_O) !== "None" &&
        whoWins(next.board, SYMBOL_X) !== "None";
      if (bothWon) {
        next.forcedDraw = true;
      }
    }

    const w = getWinner(next);
    let s = 0;
    if (w === me) s = 1e9;
    else if (w !== "None" && w !== "Draw!") s = -1e9;
    else if (w === "Draw!") s = 0;
    else {
      s = evaluateState(next, me);
      if (a.type === "freeze") s -= 20;
      if (a.type === "swap") s -= 15;
      if (a.type === "bomb") {
        s -= 25;
        let myHit = 0;
        let oppHit = 0;
        let frozenHit = 0;
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const r = a.row + dx;
            const c = a.col + dy;
            if (r < 0 || c < 0 || r >= state.boardSize || c >= state.boardSize)
              continue;
            const cell = state.board[r][c];
            if (cell.isFrozen) frozenHit++;
            if (cell.fillWith === me) myHit++;
            if (cell.fillWith === otherPlayer(me)) oppHit++;
          }
        }
        if (oppHit === 0 && frozenHit === 0) s -= 80;
        s -= myHit * 10;
      }
    }

    return { a, s };
  });

  scored.sort((x, y) => y.s - x.s);
  return scored.slice(0, cap).map((x) => x.a);
}

function minimax(state, me, depth, alpha, beta, actionCap) {
  const w = getWinner(state);
  if (state.forcedDraw) return { score: 0, action: null };
  if (w !== "None") {
    if (w === me) return { score: 100000, action: null };
    if (w === "Draw!") return { score: 0, action: null };
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
    for (const a of actions) {
      const next = applyAction(state, a);
      const { score } = minimax(next, me, depth - 1, alpha, beta, actionCap);
      if (score > bestScore) {
        bestScore = score;
        bestAction = a;
      }
      alpha = Math.max(alpha, bestScore);
      if (beta <= alpha) break;
    }
    return { score: bestScore, action: bestAction };
  }

  let bestScore = Infinity;
  for (const a of actions) {
    const next = applyAction(state, a);
    const { score } = minimax(next, me, depth - 1, alpha, beta, actionCap);
    if (score < bestScore) {
      bestScore = score;
      bestAction = a;
    }
    beta = Math.min(beta, bestScore);
    if (beta <= alpha) break;
  }
  return { score: bestScore, action: bestAction };
}

export function chooseBotAction(state, difficulty) {
  const me = state.playerTurn;
  callNonce = (callNonce + 1) >>> 0;
  const seed = (hashState(state) ^ randomUint32() ^ callNonce) >>> 0;
  const rng = makeRng(seed);

  if (state.boardSize === 3) {
    return choose3x3Action(state, difficulty, rng);
  }

  const legal = getLegalActions(state);
  if (!legal.length)
    return { action: null, debug: { reason: "no_legal_actions" } };

  if (difficulty === "easy") {
    const is4x4 = state.boardSize === 4;
    const mistakeProb = is4x4 ? 0.12 : 0.18;
    if (rng() < mistakeProb) {
      const places = legal.filter((a) => a.type === "place");
      const pick = (places.length ? places : legal)[
        Math.floor(rng() * (places.length ? places.length : legal.length))
      ];
      return { action: pick, debug: { reason: "easy_random" } };
    }

    const top = prioritizeActions(state, me, legal, 10);
    const r = rng();
    const idx =
      r < (is4x4 ? 0.8 : 0.7)
        ? 0
        : r < (is4x4 ? 0.95 : 0.9)
          ? Math.min(1, top.length - 1)
          : Math.min(2, top.length - 1);
    const pick = top[idx];
    return { action: pick, debug: { reason: "easy_topk" } };
  }

  if (difficulty === "medium") {
    const depth = 1;
    const actionCap = 18;
    const res = minimax(state, me, depth, -Infinity, Infinity, actionCap);

    const noiseProb = 0.25;
    if (rng() < noiseProb) {
      const top = prioritizeActions(state, me, legal, 6);
      const pick =
        top[
          Math.min(
            top.length - 1,
            1 + Math.floor(rng() * Math.min(2, top.length - 1)),
          )
        ];
      return { action: pick, debug: { reason: "medium_noise" } };
    }

    return { action: res.action, debug: { reason: "medium_minimax_d1" } };
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
  for (const a of candidates) {
    const next = applyAction(state, a);
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
      best.push(a);
    } else if (score === bestScore) {
      best.push(a);
    }
  }
  const pick = best.length ? best[Math.floor(rng() * best.length)] : null;
  if (pick) return { action: pick, debug: { reason: "hard_minimax_d4" } };
  const res = minimax(state, me, depth, -Infinity, Infinity, actionCap);
  return { action: res.action, debug: { reason: "hard_minimax_d4" } };
}
