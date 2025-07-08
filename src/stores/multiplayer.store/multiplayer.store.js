import { INITIAL_BOARD_SIZE } from "@/data/constants";
import { create } from "zustand";

export const useMultiplayerStore = create((set, get) => ({
  boardSize: null,
  playerTurn: null,
  board: [],
  hasGameStarted: false,
  winner: null,
  draw: false,
  isWinnerPopupVisible: false,
  selectedBoardSize: INITIAL_BOARD_SIZE,
  stats: { p1Wins: 0, draws: 0, p2Wins: 0 },

  updateGameStates: ({
    boardSize,
    playerTurn,
    board,
    hasGameStarted,
    winner,
    draw,
    isWinnerPopupVisible,
  }) => {
    set({
      boardSize,
      playerTurn,
      board,
      hasGameStarted,
      winner,
      draw,
      isWinnerPopupVisible,
    });
  },
  updateMultiplayerState: (state) => set(state),
}));
