import InfoCard from "@/components/Shared/InfoCard/InfoCard";
import { useTranslations } from "next-intl";

const GameObjectiveCard = () => {
  const t = useTranslations("about.game_objective");

  return (
    <InfoCard title={t("title")}>
      <p>{t("description")}</p>
    </InfoCard>
  );
};

export default GameObjectiveCard;
