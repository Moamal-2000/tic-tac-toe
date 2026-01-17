import { SCREEN_SIZES } from "@/data/constants";
import { socket } from "@/socket/socket";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useEffect } from "react";
import GameStats from "../GameStats/GameStats";
import PlayerTurnIndicator from "../PlayerTurnIndicator/PlayerTurnIndicator";
import MatchAbortedModal from "../../Shared/Modals/MatchAbortedModal/MatchAbortedModal";
import s from "./MultiPlayerUI.module.scss";
import PowerUps from "./PowerUps/PowerUps";
import RematchMenu from "../../Shared/Modals/RematchMenu/RematchMenu";
import RematchPrompt from "../../Shared/Modals/RematchPrompt/RematchPrompt";
import Timer from "./Timer/Timer";
import XOBoard from "./XOBoard/XOBoard";

const MultiPlayerUI = () => {
  const {
    boardSize,
    stats,
    winner,
    playerTurn,
    isRematchMenuActive,
    updateMultiplayerState,
    updateGameStates,
    updateStatsOnResult,
  } = useMultiplayerStore();

  const board3Class = boardSize === 3 ? s.x3 : "";

  function syncGameState(state) {
    const {
      turn,
      board,
      winner,
      draw,
      hasGameStarted,
      isWinnerPopupVisible,
      timeRemaining,
      timerActive,
    } = state;

    // If the game has ended (winner or draw), update multiplayer stats
    if (winner || draw) {
      updateStatsOnResult({ winner, draw });
    }

    // Extract squaresToSwap from the board state
    const squaresToSwap = [];
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell.swapSelected) {
          squaresToSwap.push([rowIndex, colIndex]);
        }
      });
    });

    updateGameStates({
      boardSize: state.board[0].length,
      playerTurn: turn,
      board,
      winner,
      draw,
      hasGameStarted,
      isWinnerPopupVisible,
      powerUps: state.powerUps,
      mySymbol: state.me,
      squaresToSwap,
      timeRemaining,
      timerActive,
    });

    // Clear hover effects when game state updates (power used)
    updateMultiplayerState({
      hoveredSquare: null,
      opponentHoveredSquare: null,
    });
  }

  useEffect(() => {
    socket.on("room-update", (state) => {
      syncGameState(state);
    });

    socket.on("square-hover", ({ row, col, power }) => {
      if (row !== null && col !== null) {
        updateMultiplayerState({ opponentHoveredSquare: { row, col, power } });
      } else {
        updateMultiplayerState({ opponentHoveredSquare: null });
      }
    });

    socket.on("opponent-disconnected", () => {
      updateMultiplayerState({ isOpponentDisconnected: true });
    });

    return () => {
      socket.off("room-update");
      socket.off("square-hover");
      socket.off("opponent-disconnected");
    };
  }, [updateMultiplayerState, updateGameStates, updateStatsOnResult]);

  return (
    <section className={`${s.game} ${board3Class}`}>
      <Timer />
      <div className={s.wrapper}>
        <PowerUps player="player1" />
        <GameStats boardSize={boardSize} stats={stats} />
        <PowerUps player="player2" />
      </div>

      <XOBoard />
      <PlayerTurnIndicator
        playerTurn={playerTurn}
        boardSize={boardSize}
        winner={winner}
        hideOn={SCREEN_SIZES.medium.size}
      />
      {isRematchMenuActive && <RematchMenu />}
      <RematchPrompt />
      <MatchAbortedModal />
    </section>
  );
};

export default MultiPlayerUI;
