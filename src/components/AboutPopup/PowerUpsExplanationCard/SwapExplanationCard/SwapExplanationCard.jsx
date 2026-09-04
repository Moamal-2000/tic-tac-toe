import ExampleBoard from "@/components/Shared/ExampleBoard/ExampleBoard";
import InfoCard from "@/components/Shared/InfoCard/InfoCard";
import { BOARD_EXAMPLES } from "@/constants/boardExamples";
import { SYMBOL_O_TEXT, SYMBOL_X_TEXT } from "@/constants/global";
import { useTranslations } from "next-intl";

const SwapExplanationCard = () => {
  const t = useTranslations("about.power_ups.swap");
  return (
    <InfoCard title={t("title")} isNested={true} disableMarginBottom={true}>
      <p>{t("description")}</p>

      <ExampleBoard boardData={BOARD_EXAMPLES.selectSwapBoard} />

      <p style={{ marginTop: "20px" }}>
        {t("example_before", { symbol2: SYMBOL_X_TEXT, symbol: SYMBOL_O_TEXT })}
      </p>

      <ExampleBoard boardData={BOARD_EXAMPLES.afterSwapBoard} />

      <p style={{ marginTop: "20px" }}>
        {t("example_after", { symbol: SYMBOL_O_TEXT, symbol2: SYMBOL_X_TEXT })}
      </p>
    </InfoCard>
  );
};

export default SwapExplanationCard;
