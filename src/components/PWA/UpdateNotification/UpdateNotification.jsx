"use client";

import Button from "@/components/Shared/Button/Button";
import { IS_PRODUCTION } from "@/data/env";
import { refreshPage } from "@/functions/helper";
import { useEffect, useState } from "react";
import s from "./UpdateNotification.module.scss";

export default function UpdateNotification() {
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
    showNotification && (
      <div className={s.updateNotification}>
        <span>A new version is available!</span>
        <Button onClick={handleRefreshPage}>Refresh</Button>
      </div>
    )
  );
}
async function registerSWWithUpdate(setShowNotification) {
  if (!("serviceWorker" in navigator) || !IS_PRODUCTION) return;

  try {
    const registration = await navigator.serviceWorker.register("/sw.js");

    if (registration.waiting) setShowNotification(true);

    registration.addEventListener("updatefound", () =>
      handleUpdateFound(registration, setShowNotification)
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
