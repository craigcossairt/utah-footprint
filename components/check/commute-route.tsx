"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ErrorNote, Skeleton } from "@/components/ui/feedback";
import type { Lang } from "@/lib/contract";

// The addresses live only in this component's state. They are never written to the draft,
// localStorage, the URL or a log.

const COPY = {
  en: {
    open: "Work it out from my addresses",
    close: "Hide the addresses",
    from: "Home address",
    to: "Work or school address",
    measure: "Measure my drive",
    measuring: "Measuring the route",
    privacy: "Your addresses go to Google Maps to measure the route. We don't keep them.",
    need: "Enter both addresses.",
    fail: "We couldn't measure that route. Set the miles yourself.",
    line: (a: string, b: string, n: number) => `${a} to ${b}: ${n} ${n === 1 ? "mile" : "miles"} one way by road`,
    adjust: "You can still move the slider.",
    capped: (n: number) => `The slider stops at ${n} miles.`,
  },
  es: {
    open: "Calcularlo con mis direcciones",
    close: "Ocultar las direcciones",
    from: "Dirección de su casa",
    to: "Dirección del trabajo o la escuela",
    measure: "Medir mi recorrido",
    measuring: "Midiendo la ruta",
    privacy: "Sus direcciones se envían a Google Maps para medir la ruta. No las guardamos.",
    need: "Escriba las dos direcciones.",
    fail: "No pudimos medir esa ruta. Ponga las millas usted mismo.",
    line: (a: string, b: string, n: number) => `De ${a} a ${b}: ${n} ${n === 1 ? "milla" : "millas"} de ida por carretera`,
    adjust: "Todavía puede mover el control.",
    capped: (n: number) => `El control llega hasta ${n} millas.`,
  },
};

type Label = { en: string; es: string };
type Result = { miles: number; from: Label; to: Label };

const field = "mt-1 block min-h-12 w-full rounded-control border-2 border-ink bg-surface px-3 py-2 text-base";

export function CommuteRoute({
  lang,
  disabled,
  max,
  onMiles,
}: {
  lang: Lang;
  disabled?: boolean;
  max: number;
  onMiles: (miles: number) => void;
}) {
  const c = COPY[lang];
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  async function measure() {
    if (busy) return;
    const a = from.trim();
    const b = to.trim();
    setResult(null);
    if (a.length < 3 || b.length < 3) return setError(c.need);
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/distance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from: a, to: b }),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error("unmeasured");
      const data = (await res.json()) as { miles: number; from?: Label; to?: Label };
      if (!Number.isFinite(data.miles) || data.miles < 1) throw new Error("unmeasured");
      setResult({ miles: data.miles, from: data.from ?? { en: a, es: a }, to: data.to ?? { en: b, es: b } });
      onMiles(Math.min(max, data.miles));
    } catch {
      setError(c.fail);
    } finally {
      setBusy(false);
    }
  }

  const onEnter = (e: React.KeyboardEvent) => {
    if (e.key !== "Enter") return;
    e.preventDefault(); // Enter here measures the route; it must not send the person to the next question.
    void measure();
  };

  return (
    <div className="mt-4">
      <button
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-controls="commute-route"
        onClick={() => setOpen(!open)}
        className="min-h-12 text-left font-semibold underline underline-offset-4 disabled:cursor-not-allowed"
      >
        {open ? c.close : c.open}
      </button>
      {open && !disabled && (
        <div id="commute-route" className="mt-2 grid gap-3">
          <div>
            <label htmlFor="route-from" className="text-sm font-semibold">
              {c.from}
            </label>
            <input id="route-from" autoComplete="off" value={from} maxLength={200} onChange={(e) => setFrom(e.target.value)} onKeyDown={onEnter} className={field} />
          </div>
          <div>
            <label htmlFor="route-to" className="text-sm font-semibold">
              {c.to}
            </label>
            <input id="route-to" autoComplete="off" value={to} maxLength={200} onChange={(e) => setTo(e.target.value)} onKeyDown={onEnter} className={field} />
          </div>
          <p className="text-sm text-muted">{c.privacy}</p>
          <div>
            <Button type="button" variant="secondary" disabled={busy} onClick={() => void measure()}>
              {busy ? c.measuring : c.measure}
            </Button>
          </div>
          <div aria-live="polite">
            {busy && <Skeleton className="h-6 w-full" />}
            {result && (
              <p className="font-semibold">
                {c.line(result.from[lang], result.to[lang], result.miles)}
                <span className="block text-sm font-normal text-muted">
                  {result.miles > max ? `${c.capped(max)} ` : ""}
                  {c.adjust}
                </span>
              </p>
            )}
          </div>
          {error ? <ErrorNote>{error}</ErrorNote> : null}
        </div>
      )}
    </div>
  );
}
