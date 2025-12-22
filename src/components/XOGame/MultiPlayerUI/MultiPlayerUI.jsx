import { SCREEN_SIZES } from "@/data/constants";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import GameStats from "../GameStats/GameStats";
import PlayerTurnIndicator from "../PlayerTurnIndicator/PlayerTurnIndicator";
import s from "./MultiPlayerUI.module.scss";
import OpponentDisconnectedModal from "./OpponentDisconnectedModal/OpponentDisconnectedModal";
import PowerUps from "./PowerUps/PowerUps";
import RematchMenu from "./RematchMenu/RematchMenu";
import RematchRequestNotification from "./RematchRequestNotification/RematchRequestNotification";
import Timer from "./Timer/Timer";
import XOBoard from "./XOBoard/XOBoard";

const MultiPlayerUI = () => {
  const { boardSize, stats, winner, playerTurn, isRematchMenuActive } =
    useMultiplayerStore((s) => s);
  const board3Class = boardSize === 3 ? s.x3 : "";

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
      <RematchRequestNotification />
      <OpponentDisconnectedModal />
    </section>
  );
};

export default MultiPlayerUI;
