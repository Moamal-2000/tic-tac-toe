import { INITIAL_BOARD_SIZE, SYMBOL_O, SYMBOL_X } from "@/data/constants";
import { create } from "zustand";
import { initialPlayerPowerUps } from "../xo.store/states";

export const useMultiplayerStore = create((set, get) => ({
  boardSize: null,
  playerTurn: null,
  board: [],
  hasGameStarted: false,
  winner: null,
  draw: false,
  isWinnerPopupVisible: false,
  isRematchMenuActive: false,
  selectedBoardSize: INITIAL_BOARD_SIZE,
  stats: { p1Wins: 0, draws: 0, p2Wins: 0 },
  powerUps: {
    player1: initialPlayerPowerUps(get()?.boardSize),
    player2: initialPlayerPowerUps(get()?.boardSize),
    selectedPower: null,
    whoUsingPower: null,
    hasActivePowerUp: false,
  },

  updateGameStates: ({
    boardSize,
    playerTurn,
    board,
    hasGameStarted,
    winner,
    draw,
    isWinnerPopupVisible,
    powerUps,
  }) => {
    set({
      boardSize,
      playerTurn,
      board,
      hasGameStarted,
      winner,
      draw,
      isWinnerPopupVisible,
      powerUps,
    });
  },
  updateMultiplayerState: (state) => set(state),
  updateStatsOnResult: ({ winner, draw }) => {
    set((state) => {
      // Only update stats when we transition from no result -> ended game
      const previouslyEnded = state.winner || state.draw;
      const nowEnded = winner || draw;

      if (previouslyEnded || !nowEnded) {
        return state;
      }

      const { p1Wins, draws, p2Wins } = state.stats;
      const isDraw = !!draw;

      const updatedStats = {
        p1Wins: !isDraw && winner === SYMBOL_O ? p1Wins + 1 : p1Wins,
        draws: isDraw ? draws + 1 : draws,
        p2Wins: !isDraw && winner === SYMBOL_X ? p2Wins + 1 : p2Wins,
      };

      return { ...state, stats: updatedStats };
    });
  },
}));
