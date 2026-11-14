"use client";

import { useEffect, useState } from "react";

// /?reset=1 clears saved answers on this device, for a clean demo run.
export function ResetOnQuery({ message }: { message: string }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("reset") !== "1") return;
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith("uf."))
        .forEach((k) => localStorage.removeItem(k));
    } catch {}
    url.searchParams.delete("reset");
    window.history.replaceState(null, "", url.pathname + url.search);
    setDone(true);
  }, []);
  return done ? (
    <p role="status" className="text-sm text-muted">
      {message}
    </p>
  ) : null;
}
