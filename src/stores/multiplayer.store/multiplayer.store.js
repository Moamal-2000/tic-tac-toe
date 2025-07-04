import { INITIAL_BOARD_SIZE } from "@/data/constants";
import { create } from "zustand";

export const useMultiplayerStore = create((set, get) => ({
  boardSize: null,
  playerTurn: null,
  board: [],
  hasGameStarted: false,
  winner: null,
  isWinnerPopupVisible: false,
  selectedBoardSize: INITIAL_BOARD_SIZE,

  updateGameStates: ({
    boardSize,
    playerTurn,
    board,
    hasGameStarted,
    winner,
    isWinnerPopupVisible,
  }) => {
    set({
      boardSize,
      playerTurn,
      board,
      hasGameStarted,
      winner,
      isWinnerPopupVisible,
    });
  },
  updateMultiplayerState: (state) => set(state),
}));
