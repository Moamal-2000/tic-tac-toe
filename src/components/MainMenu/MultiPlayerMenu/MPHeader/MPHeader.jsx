import { socket } from "@/socket/socket";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import s from "./MPHeader.module.scss";

const MPHeader = () => {
  const t = useTranslations("main_menu");

  const [onlinePlayers, setOnlinePlayers] = useState(0);

  useEffect(() => {
    socket.emit("get-online-players");

    function handleOnlinePlayersCount({ count }) {
      setOnlinePlayers(count);
    }

    socket.on("online-players-count", handleOnlinePlayersCount);

    return () => {
      socket.off("online-players-count", handleOnlinePlayersCount);
    };
  }, []);

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
