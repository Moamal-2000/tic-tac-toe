import { useTranslations } from "next-intl";
import s from "./PlayerScore.module.scss";

const PlayerScore = ({ score, player }) => {
  const t = useTranslations("global");

  const classes = `${s.playerScore} ${player === "player1" ? s.player1 : s.player2}`;

  return (
    <div className={classes}>
      <h2>
        {t("player")} {player === "player1" ? 1 : 2}
      </h2>
      <span>{`${score}`.padStart(3, 0)}</span>
    </div>
  );
};
export default PlayerScore;
