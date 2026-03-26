"use client";

import { useGlobalStore } from "@/stores/global.store/global.store";
import "@/styles/global.scss";
import { useEffect } from "react";
import s from "./notFoundPage.module.scss";

export default function NotFound() {
  const updateGlobalState = useGlobalStore((s) => s.updateGlobalState);

  useEffect(() => {
    updateGlobalState({ is404: true });
    return () => updateGlobalState({ is404: false });
  }, []);

  return (
    <main className={s.notFoundPage}>
      <section className={s.content}>
        <code className={s.code}>404</code>
        <h1 className={s.title}>Page not found</h1>
      </section>
    </main>
  );
}
