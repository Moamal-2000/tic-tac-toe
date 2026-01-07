import ExampleBoard from "@/components/Shared/ExampleBoard/ExampleBoard";
import InfoCard from "@/components/Shared/InfoCard/InfoCard";
import { SYMBOL_O_TEXT, SYMBOL_X_TEXT } from "@/data/constants";
import { BOARD_EXAMPLES } from "@/data/staticData";
import { useTranslations } from "next-intl";

const BombExplanationCard = () => {
  const t = useTranslations("about.power_ups.bomb");
  return (
    <InfoCard title={t("title")} isNested={true}>
      <p>{t("description")}</p>

      <ExampleBoard boardData={BOARD_EXAMPLES.bombBoard} />

      <p style={{ marginTop: "20px" }}>
        {t("example_before", { symbol: SYMBOL_O_TEXT, symbol2: SYMBOL_X_TEXT })}
      </p>

      <ExampleBoard boardData={BOARD_EXAMPLES.afterBombBoard} />

      <p style={{ marginTop: "20px" }}>
        {t("example_after", { symbol2: SYMBOL_X_TEXT })}
      </p>
    </InfoCard>
  );
};

export default BombExplanationCard;
