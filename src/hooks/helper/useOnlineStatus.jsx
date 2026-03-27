"use client";

import { isServer } from "@/functions/helper";
import { useEffect, useState } from "react";
import useEventListener from "./useEventListener";

const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
  }, []);

  useEventListener(isServer ? null : window, "online", () => setIsOnline(true));
  useEventListener(isServer ? null : window, "offline", () => setIsOnline(false));

  return isOnline;
};

export default useOnlineStatus;
