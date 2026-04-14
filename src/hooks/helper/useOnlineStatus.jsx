"use client";

import { isServer } from "@/lib/helper";
import { useSyncExternalStore } from "react";

const useOnlineStatus = () => {
  return useSyncExternalStore(subscribe, getSnapShot, () => false);
};

export default useOnlineStatus;

function subscribe(callback) {
  if (isServer) return () => {};

  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);

  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getSnapShot() {
  return typeof navigator !== "undefined" ? navigator.onLine : true;
}
