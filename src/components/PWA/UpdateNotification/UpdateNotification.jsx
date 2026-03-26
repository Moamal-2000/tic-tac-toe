"use client";

import { IS_PRODUCTION } from "@/data/env";
import { refreshPage } from "@/functions/helper";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import s from "./UpdateNotification.module.scss";

function UpdateNotification() {
  const t = useTranslations("update_notification");
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    registerSWWithUpdate(setShowNotification);
  }, []);

  function handleRefreshPage() {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ action: "skipWaiting" });
    }
    refreshPage();
  }

  return (
    <div
      className={s.updateNotification}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{ display: showNotification ? "flex" : "none" }}
    >
      <p>{t("message")}</p>
      <button
        type="button"
        className={s.refreshButton}
        onClick={handleRefreshPage}
        title={t("button_title")}
        aria-label={t("button_title")}
        autoFocus={showNotification}
      >
        {t("button")}
      </button>
    </div>
  );
}

export default UpdateNotification;

async function registerSWWithUpdate(setShowNotification) {
  if (!("serviceWorker" in navigator) || !IS_PRODUCTION) return;

  try {
    const registration = await navigator.serviceWorker.register("/sw.js");

    if (registration.waiting) setShowNotification(true);

    registration.addEventListener("updatefound", () =>
      handleUpdateFound(registration, setShowNotification),
    );
  } catch (err) {
    console.error(`Error registering service worker: ${err}`);
  }
}

function handleUpdateFound(registration, setShowNotification) {
  const newWorker = registration.installing;
  if (!newWorker) return;

  newWorker.addEventListener("statechange", () => {
    const updateRequired =
      newWorker.state === "installed" && navigator.serviceWorker.controller;

    if (updateRequired) {
      setShowNotification(true);
    }
  });
}
