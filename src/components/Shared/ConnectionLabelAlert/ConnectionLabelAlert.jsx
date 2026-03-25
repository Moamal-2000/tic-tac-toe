"use client";

import useOnlineStatus from "@/hooks/helper/useOnlineStatus";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import s from "./ConnectionLabelAlert.module.scss";

const ConnectionLabelAlert = () => {
  const [isOfflineState, setIsOfflineState] = useState(false);
  const t = useTranslations("connectionLabel");
  const isOnline = useOnlineStatus();

  const activeClass = isOnline ? s.active : "";
  const showClass = isOfflineState ? s.show : "";

  const message = t(isOnline ? "internetAvailable" : "internetUnavailable");

  function updateInternetStatus() {
    let debounceId;
    debounceId = setTimeout(() => setIsOfflineState(!isOnline), 3000);
    return () => clearTimeout(debounceId);
  }

  useEffect(() => {
    updateInternetStatus();
  }, [isOnline]);

  return (
    <p className={`${s.labelBody} ${activeClass} ${showClass}`}>{message}</p>
  );
};
export default ConnectionLabelAlert;
