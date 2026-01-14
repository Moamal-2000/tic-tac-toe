import useOnlinePlayersCount from "@/hooks/app/useOnlinePlayersCount";
import { useTranslations } from "next-intl";
import s from "./MPHeader.module.scss";

const MPHeader = () => {
  const t = useTranslations("main_menu");

  const onlinePlayers = useOnlinePlayersCount();

  return (
    <header className={s.header}>
      <div className={s.playerCount}>
        <span className={s.playerCountDot} />
        <span className={s.playerCountLabel}>
          {t("multiplayer.setup.online_players")}
        </span>
        <span className={s.playerCountValue}>{onlinePlayers}</span>
      </div>

      <div className={s.headerText}>
        <h1>{t("multiplayer.setup.title")}</h1>
        <p>{t("multiplayer.setup.subtitle")}</p>
      </div>
    </header>
  );
};
export default MPHeader;
