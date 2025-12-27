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
        actions.push({ type: "bomb", row: r, col: c });
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
          actions.push({ type: "swap", a: occ[i], b: occ[j] });
        }
      }
    }
  }

  return actions;
}

function prioritizeActions(state, me, actions, cap, rng) {
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
    else s = evaluateState(next, me);

    const jitter = rng ? (rng() - 0.5) * 1e-3 : 0;
    return { a, s: s + jitter };
  });

  scored.sort((x, y) => y.s - x.s);
  return scored.slice(0, cap).map((x) => x.a);
}

function minimax(state, me, depth, alpha, beta, actionCap, rng) {
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
    rng
  );

  let bestAction = actions[0] || null;

  if (maximizing) {
    let bestScore = -Infinity;
    for (const a of actions) {
      const next = applyAction(state, a);
      const { score } = minimax(
        next,
        me,
        depth - 1,
        alpha,
        beta,
        actionCap,
        rng
      );
      if (score > bestScore) {
        bestScore = score;
        bestAction = a;
      }
      if (score === bestScore && rng && rng() < 0.5) {
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
    const { score } = minimax(next, me, depth - 1, alpha, beta, actionCap, rng);
    if (score < bestScore) {
      bestScore = score;
      bestAction = a;
    }
    if (score === bestScore && rng && rng() < 0.5) {
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

  const legal = getLegalActions(state);
  if (!legal.length)
    return { action: null, debug: { reason: "no_legal_actions" } };

  if (difficulty === "easy") {
    const mistakeProb = 0.3;
    if (rng() < mistakeProb) {
      const places = legal.filter((a) => a.type === "place");
      const pick = (places.length ? places : legal)[
        Math.floor(rng() * (places.length ? places.length : legal.length))
      ];
      return { action: pick, debug: { reason: "easy_random" } };
    }

    const top = prioritizeActions(state, me, legal, 8, rng);
    const pick =
      top[
        Math.min(top.length - 1, Math.floor(rng() * Math.min(2, top.length)))
      ];
    return { action: pick, debug: { reason: "easy_topk" } };
  }

  if (difficulty === "medium") {
    const depth = 1;
    const actionCap = 18;
    const res = minimax(state, me, depth, -Infinity, Infinity, actionCap, rng);

    const noiseProb = 0.25;
    if (rng() < noiseProb) {
      const top = prioritizeActions(state, me, legal, 6, rng);
      const pick =
        top[
          Math.min(
            top.length - 1,
            1 + Math.floor(rng() * Math.min(2, top.length - 1))
          )
        ];
      return { action: pick, debug: { reason: "medium_noise" } };
    }

    return { action: res.action, debug: { reason: "medium_minimax_d1" } };
  }

  const depth = 4;
  const actionCap = 50;
  const res = minimax(state, me, depth, -Infinity, Infinity, actionCap, rng);

  return { action: res.action, debug: { reason: "hard_minimax_d4" } };
}
