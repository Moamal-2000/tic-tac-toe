import { SCREEN_SIZES } from "@/data/constants";
import useComputerBot from "@/hooks/app/useComputerBot";
import { useScoreAnimation } from "@/hooks/app/useScoreAnimation";
import { useXOStore } from "@/stores/xo.store/xo.store";
import GameStats from "../GameStats/GameStats";
import PlayerTurnIndicator from "../PlayerTurnIndicator/PlayerTurnIndicator";
import ScoreAnimationContainer from "../ScoreAnimationContainer/ScoreAnimationContainer";
import PowerUps from "./PowerUps/PowerUps";
import s from "./SinglePlayerUI.module.scss";
import XOBoard from "./XOBoard/XOBoard";

const SinglePlayerUI = () => {
  const { playerTurn, boardSize, stats, winner } = useXOStore();
  const board3Class = boardSize === 3 ? s.x3 : "";
  const { animations, removeAnimation, createAnimation } = useScoreAnimation();

  useComputerBot({ createAnimation });

  return (
    <section className={`${s.game} ${board3Class}`}>
      <ScoreAnimationContainer
        animations={animations}
        removeAnimation={removeAnimation}
      />

      <div className={s.gameBody}>
        <PowerUps player="player1" />

        <div className={s.gameBoardArea}>
          <GameStats stats={stats} boardSize={boardSize} />
          <XOBoard animationHook={{ createAnimation, removeAnimation }} />
        </div>

        <PowerUps player="player2" />
      </div>

      <PlayerTurnIndicator
        playerTurn={playerTurn}
        boardSize={boardSize}
        winner={winner}
        hideOn={SCREEN_SIZES.medium.size}
      />
    </section>
  );
};

export default SinglePlayerUI;
