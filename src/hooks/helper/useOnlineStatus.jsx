"use client";

import { isServer } from "@/functions/helper";
import { useSyncExternalStore } from "react";

const useOnlineStatus = () => {
  return useSyncExternalStore(subscribe, snapShoot, () => false);
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

function snapShoot() {
  return typeof navigator !== "undefined" ? navigator.onLine : true;
}
