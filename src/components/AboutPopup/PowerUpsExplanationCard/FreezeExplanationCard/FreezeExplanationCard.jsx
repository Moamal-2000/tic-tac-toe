import ExampleBoard from "@/components/Shared/ExampleBoard/ExampleBoard";
import InfoCard from "@/components/Shared/InfoCard/InfoCard";
import { SYMBOL_O_TEXT, SYMBOL_X_TEXT } from "@/data/constants";
import { BOARD_EXAMPLES } from "@/data/staticData";
import { useTranslations } from "next-intl";
import s from "./FreezeExplanationCard.module.scss";

const FreezeExplanationCard = () => {
  const t = useTranslations("about.power_ups.freeze");

  return (
    <InfoCard title={t("title")} isNested={true}>
      <p className={s.freezeDescription}>{t("description")}</p>

      <ul className={s.freezeList}>
        <li>{t("list_item_1")}</li>
        <li>{t("list_item_2")}</li>
        <li>{t("list_item_3")}</li>
        <li>{t("list_item_4")}</li>
      </ul>

      <p>
        {t("defensive_tool", { symbol: SYMBOL_O_TEXT, symbol2: SYMBOL_X_TEXT })}
      </p>

      <ExampleBoard boardData={BOARD_EXAMPLES.freezeBoard} />

      <p className={s.freezeExampleDescription}>
        {t("example", { symbol: SYMBOL_O_TEXT, symbol2: SYMBOL_X_TEXT })}
      </p>
    </InfoCard>
  );
};

export default FreezeExplanationCard;
