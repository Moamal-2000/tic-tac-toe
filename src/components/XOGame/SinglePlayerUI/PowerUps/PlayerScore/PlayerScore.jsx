import s from "./PlayerScore.module.scss";

const PlayerScore = ({ score, player }) => {
  const classes = `${s.playerScore} ${player === "player1" ? s.player1 : s.player2}`;
  return <div className={classes}>
    <h2>{player === "player1" ? "Player 1" : "Player 2" }</h2>
    <span>{`${score}`.padStart(3, 0)}</span>
  </div>;
};
export default PlayerScore;
