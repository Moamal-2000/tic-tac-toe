import InfoCard from "@/components/Shared/InfoCard/InfoCard";
import { SYMBOL_O_TEXT, SYMBOL_X_TEXT } from "@/data/constants";
import { useTranslations } from "next-intl";
import s from "./HowToPlayCard.module.scss";

const HowToPlayCard = () => {
  const t = useTranslations("about.how_to_play");

  return (
    <InfoCard title={t("title")}>
      <ul className={s.howToPlayList}>
        {HOW_TO_PLAY_LIST(t).map((content, index) => (
          <li key={index}>{content}</li>
        ))}
      </ul>
    </InfoCard>
  );
};

export default HowToPlayCard;

const HOW_TO_PLAY_LIST = (t) => [
  t("player1_starts", { symbol: SYMBOL_O_TEXT, symbol2: SYMBOL_X_TEXT }),
  t("click_to_place"),
  t("get_in_row"),
  t("draw_if_full"),
];
