"use client";

import { IS_PRODUCTION } from "@/data/constants";
import { useEffect } from "react";

async function registerServiceWorker() {
  try {
    if (!("serviceWorker" in navigator)) {
      console.info("Service Worker is not supported in this browser");
      return null;
    }

    const registration = await navigator.serviceWorker.register("/sw.js");
    return registration;
  } catch (error) {
    console.error("Service Worker registration failed:", error.message);
    return null;
  }
}

async function initializePWA() {
  if (!IS_PRODUCTION) return;
  const isPageFullyLoaded = document.readyState === "complete";

  if (isPageFullyLoaded) {
    await registerServiceWorker();
  } else {
    window.addEventListener("load", async () => {
      await registerServiceWorker();
    });
  }
}

export default function PWAInit() {
  useEffect(() => {
    initializePWA();
  }, []);

  return null;
}
