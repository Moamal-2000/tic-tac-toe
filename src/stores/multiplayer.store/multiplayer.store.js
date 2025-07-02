import { create } from "zustand";

export const useMultiplayerStore = create((set, get) => ({
  boardSize: null,
  playerTurn: null,
  board: [],
  hasGameStarted: false,
  winner: null,
  isWinnerPopupVisible: false,

  getGameStates: ({
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
}));
