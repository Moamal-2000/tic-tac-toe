"use client";

import { useEffect, useState } from "react";
import useEventListener from "./useEventListener";

const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(true);

  const windowElement = typeof window !== "undefined" ? window : null;

  useEffect(() => {
    setIsOnline(navigator.onLine);
  }, []);

  useEventListener(windowElement, "online", () => setIsOnline(true));
  useEventListener(windowElement, "offline", () => setIsOnline(false));

  return isOnline;
};

export default useOnlineStatus;
