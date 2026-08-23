"use client";

import { useEffect } from "react";

const RECOVERY_PARAMETER = "portfolio-recovered";
const RECOVERY_VERSION = "20260823";

export default function ServiceWorkerCleanup() {
  useEffect(() => {
    const recover = async () => {
      if (!("serviceWorker" in navigator) || !("caches" in window)) {
        if (window.location.pathname === "/refresh") {
          window.location.replace("/");
        }
        return;
      }

      const registrations = await navigator.serviceWorker.getRegistrations();
      const cacheNames = await caches.keys();
      const portfolioCaches = cacheNames.filter((name) => name.startsWith("portfolio-"));
      const needsRecovery =
        window.location.pathname === "/refresh" ||
        Boolean(navigator.serviceWorker.controller) ||
        registrations.length > 0 ||
        portfolioCaches.length > 0;

      await Promise.allSettled(registrations.map((registration) => registration.unregister()));
      await Promise.allSettled(portfolioCaches.map((cacheName) => caches.delete(cacheName)));

      if (needsRecovery) {
        const destination = new URL(
          window.location.pathname === "/refresh" ? "/" : window.location.href,
          window.location.origin,
        );
        destination.searchParams.set(RECOVERY_PARAMETER, RECOVERY_VERSION);
        window.location.replace(destination.toString());
        return;
      }

      const currentUrl = new URL(window.location.href);
      if (currentUrl.searchParams.has(RECOVERY_PARAMETER)) {
        currentUrl.searchParams.delete(RECOVERY_PARAMETER);
        window.history.replaceState(null, "", currentUrl.toString());
      }
    };

    void recover();
  }, []);

  return null;
}
