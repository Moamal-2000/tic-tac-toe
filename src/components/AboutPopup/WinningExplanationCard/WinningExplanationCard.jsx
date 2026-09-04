import ExampleBoard from "@/components/Shared/ExampleBoard/ExampleBoard";
import InfoCard from "@/components/Shared/InfoCard/InfoCard";
import { BOARD_EXAMPLES } from "@/constants/boardExamples";
import { SYMBOL_O_TEXT } from "@/constants/global";
import { useTranslations } from "next-intl";

const WinningExplanationCard = () => {
  const t = useTranslations("about.winning_example");

  return (
    <InfoCard title={t("title")}>
      <p>{t("description", { symbol: SYMBOL_O_TEXT })}</p>

      <ExampleBoard boardData={BOARD_EXAMPLES.winningBoard} />

      <p style={{ marginTop: "20px" }}>
        {t("scenario", { symbol: SYMBOL_O_TEXT })}
      </p>
    </InfoCard>
  );
};

export default WinningExplanationCard;
