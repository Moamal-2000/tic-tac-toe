import { applyAction, createInitialState, getWinner } from "@/ai/engine";

export function createHeadlessEnv({ boardSize = 4 } = {}) {
  let state = createInitialState({ boardSize });

  function reset() {
    state = createInitialState({ boardSize });
    return state;
  }

  function step(action) {
    state = applyAction(state, action);

    const winner = getWinner(state);
    const done = winner !== "None" || !!state.forcedDraw;

    return { state, winner: state.forcedDraw ? "Draw!" : winner, done };
  }

  function getState() {
    return state;
  }

  return { reset, step, getState };
}
