import { INITIAL_BOARD_SIZE } from "@/data/constants";
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
