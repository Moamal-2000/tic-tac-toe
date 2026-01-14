import { socket } from "@/socket/socket";
import { useEffect, useState } from "react";

const useOnlinePlayersCount = () => {
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

  return onlinePlayers;
};
export default useOnlinePlayersCount;
