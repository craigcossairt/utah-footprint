"use client";

import { useEffect, useState } from "react";

// /?reset=1 clears saved answers on this device, for a clean demo run.
export function ResetOnQuery() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("reset") !== "1") return;
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith("uf."))
        .forEach((k) => localStorage.removeItem(k));
    } catch {}
    window.history.replaceState(null, "", "/");
    setDone(true);
  }, []);
  return done ? (
    <p role="status" className="text-sm text-muted">
      Saved answers on this device were cleared.
    </p>
  ) : null;
}
