import InfoCard from "@/components/Shared/InfoCard/InfoCard";
import { useTranslations } from "next-intl";
import BombExplanationCard from "./BombExplanationCard/BombExplanationCard";
import FreezeExplanationCard from "./FreezeExplanationCard/FreezeExplanationCard";
import SwapExplanationCard from "./SwapExplanationCard/SwapExplanationCard";

const PowerUpsExplanationCard = () => {
  const t = useTranslations("about.power_ups");

  return (
    <InfoCard title={t("title")} disableMarginBottom={true}>
      <p>{t("description")}</p>

      <FreezeExplanationCard />
      <BombExplanationCard />
      <SwapExplanationCard />
    </InfoCard>
  );
};

export default PowerUpsExplanationCard;
