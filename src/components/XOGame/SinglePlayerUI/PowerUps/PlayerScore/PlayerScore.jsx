import StatCounter from "@/components/Shared/StatCounter/StatCounter";
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
      <StatCounter
        value={score}
        color={player === "player1" ? "red" : "green"}
        target={player}
        padNumber={3}
        className={s.score}
      />
    </div>
  );
};
export default PlayerScore;
