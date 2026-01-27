import { INITIAL_BOARD_SIZE, SYMBOL_O, SYMBOL_X } from "@/data/constants";
import { create } from "zustand";
import { initialPlayerPowerUps } from "../xo.store/states";

export const useMultiplayerStore = create((set, get) => ({
  boardSize: null,
  playerTurn: null,
  board: [],
  mySymbol: null,
  hasGameStarted: false,
  winner: null,
  draw: false,
  isWinnerPopupVisible: false,
  isRematchMenuActive: false,
  isOpponentDisconnected: false,
  rematchRequest: null, // Can be null, 'pending', 'accepted', 'rejected'
  selectedBoardSize: INITIAL_BOARD_SIZE,
  stats: { p1Wins: 0, draws: 0, p2Wins: 0 },
  squaresToSwap: [],
  timeRemaining: 30,
  timerActive: false,
  opponentHoveredSquare: null,
  powerUps: {
    player1: initialPlayerPowerUps(get()?.boardSize),
    player2: initialPlayerPowerUps(get()?.boardSize),
    selectedPower: null,
    whoUsingPower: null,
    hasActivePowerUp: false,
  },
  isChatOpen: true,
  unreadMessagesCount: 0,
  exploreMode: false,

  updateGameStates: ({
    boardSize,
    playerTurn,
    board,
    hasGameStarted,
    winner,
    draw,
    isWinnerPopupVisible,
    powerUps,
    mySymbol,
    squaresToSwap = [],
    timeRemaining = 30,
    timerActive = true,
  }) => {
    set({
      boardSize,
      playerTurn,
      board,
      mySymbol,
      hasGameStarted,
      winner,
      draw,
      isWinnerPopupVisible,
      powerUps,
      squaresToSwap,
      timeRemaining,
      timerActive,
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
  resetMultiplayerState: () => {
    set({
      boardSize: null,
      playerTurn: null,
      board: [],
      mySymbol: null,
      hasGameStarted: false,
      winner: null,
      draw: false,
      isWinnerPopupVisible: false,
      isRematchMenuActive: false,
      isOpponentDisconnected: false,
      rematchRequest: null,
      squaresToSwap: [],
      timeRemaining: 30,
      timerActive: false,
      opponentHoveredSquare: null,
      powerUps: {
        player1: {},
        player2: {},
        selectedPower: null,
        whoUsingPower: null,
        hasActivePowerUp: false,
      },
      exploreMode: false,
    });
  },
}));
