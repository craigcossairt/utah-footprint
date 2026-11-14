"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { WaterBand } from "@/components/ui/water-band";
import type { AreaId, Lang } from "@/lib/contract";

export type TrackAction = {
  id: string;
  area: AreaId;
  title: string;
  savesPerYear: number;
  unit: string; // as the card shows it, e.g. "lbs CO2 per year"
  dollarsPerYear: number; // 0 when the card shows no dollar figure
};

// What the person has started, and when. Kept in this browser only: no account, nothing sent anywhere.
type Started = Record<string, string>; // action id -> ISO date (YYYY-MM-DD)
const KEY = "uf.progress";

const COPY = {
  en: {
    title: "My progress",
    intro:
      "Pick the changes you've started and the day you started. We add up what you've saved since then, using the same numbers as your results. This stays in this browser only.",
    soFar: "Saved so far",
    perYear: "At this pace, each year",
    dollars: "dollars",
    co2: "lbs of CO2",
    gallons: "gallons of water",
    none: "Nothing started yet. Pick a change below.",
    start: "I started this",
    stop: "Stop tracking",
    since: "Started on",
    days: (n: number) => `${n} ${n === 1 ? "day" : "days"} so far`,
    a: { air: "Air", water: "Water", energy: "Energy" },
    back: "Back to my results",
    estimate: "These are estimates from your answers, not meter readings.",
  },
  es: {
    title: "Mi progreso",
    intro:
      "Elija los cambios que ya empezó y el día en que empezó. Sumamos lo que ha ahorrado desde entonces, con los mismos números de sus resultados. Esto se guarda solo en este navegador.",
    soFar: "Ahorrado hasta ahora",
    perYear: "A este ritmo, cada año",
    dollars: "dólares",
    co2: "libras de CO2",
    gallons: "galones de agua",
    none: "Todavía no ha empezado nada. Elija un cambio abajo.",
    start: "Ya empecé",
    stop: "Dejar de seguir",
    since: "Empezó el",
    days: (n: number) => `${n} ${n === 1 ? "día" : "días"} hasta ahora`,
    a: { air: "Aire", water: "Agua", energy: "Energía" },
    back: "Volver a mis resultados",
    estimate: "Son estimaciones a partir de sus respuestas, no lecturas de medidores.",
  },
};

const today = () => new Date().toISOString().slice(0, 10);
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

function daysSince(iso: string): number {
  const ms = Date.now() - new Date(`${iso}T12:00:00`).getTime();
  return Math.max(0, Math.floor(ms / 86_400_000));
}

// Which running total an action's savings belong to.
function kind(a: TrackAction): "co2" | "gallons" | null {
  if (/co2/i.test(a.unit)) return "co2";
  if (/gal/i.test(a.unit)) return "gallons";
  return null;
}

export function Tracker({ actions, lang, resultsHref }: { actions: TrackAction[]; lang: Lang; resultsHref: string }) {
  const c = COPY[lang];
  const [started, setStarted] = useState<Started>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setStarted(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(started));
    } catch {}
  }, [started, loaded]);

  const totals = { dollars: 0, co2: 0, gallons: 0, yDollars: 0, yCo2: 0, yGallons: 0 };
  for (const a of actions) {
    const since = started[a.id];
    if (!since) continue;
    const share = daysSince(since) / 365;
    const k = kind(a);
    totals.dollars += a.dollarsPerYear * share;
    totals.yDollars += a.dollarsPerYear;
    if (k === "co2") {
      totals.co2 += a.savesPerYear * share;
      totals.yCo2 += a.savesPerYear;
    }
    if (k === "gallons") {
      totals.gallons += a.savesPerYear * share;
      totals.yGallons += a.savesPerYear;
    }
  }
  const any = Object.keys(started).some((id) => actions.some((a) => a.id === id));

  return (
    <div>
      <WaterBand width="max-w-2xl">
        <h1 className="text-3xl font-extrabold lg:text-5xl">{c.title}</h1>
        <p className="mt-3">{c.intro}</p>
      </WaterBand>
      <div className="mx-auto w-full max-w-2xl px-4 pb-12 lg:px-8">

      <section aria-labelledby="totals" className="mt-8 border-t-4 border-ink pt-4">
        <h2 id="totals" className="text-sm font-semibold uppercase tracking-wide text-muted">
          {c.soFar}
        </h2>
        {any ? (
          <>
            <dl className="mt-3 grid grid-cols-3 gap-4">
              <Stat value={`$${fmt(totals.dollars)}`} label={c.dollars} />
              <Stat value={fmt(totals.co2)} label={c.co2} />
              <Stat value={fmt(totals.gallons)} label={c.gallons} />
            </dl>
            <p className="mt-3 text-sm text-muted">
              {c.perYear}: <span className="num font-semibold text-ink">${fmt(totals.yDollars)}</span> · {" "}
              <span className="num font-semibold text-ink">{fmt(totals.yCo2)}</span> {c.co2} ·{" "}
              <span className="num font-semibold text-ink">{fmt(totals.yGallons)}</span> {c.gallons}
            </p>
          </>
        ) : (
          <p className="mt-3 text-muted">{c.none}</p>
        )}
      </section>

      <ul className="mt-8 divide-y divide-line border-y border-line">
        {actions.map((a) => {
          const since = started[a.id];
          return (
            <li key={a.id} className="py-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-muted">{c.a[a.area]}</p>
              <p className="font-semibold">{a.title}</p>
              <p className="text-sm text-muted">
                {a.dollarsPerYear > 0 ? <span className="num font-semibold text-ink">${fmt(a.dollarsPerYear)} · </span> : null}
                <span className="num">{fmt(a.savesPerYear)}</span> {a.unit}
              </p>
              {since ? (
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                  <label className="flex items-center gap-2">
                    {c.since}
                    <input
                      type="date"
                      value={since}
                      max={today()}
                      onChange={(e) => e.target.value && setStarted({ ...started, [a.id]: e.target.value })}
                      className="rounded-control border-2 border-ink bg-surface px-2 py-1"
                    />
                  </label>
                  <span className="text-muted">{c.days(daysSince(since))}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    className="min-h-12 px-0"
                    onClick={() => {
                      const next = { ...started };
                      delete next[a.id];
                      setStarted(next);
                    }}
                  >
                    {c.stop}
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-2"
                  onClick={() => setStarted({ ...started, [a.id]: today() })}
                >
                  {c.start}
                </Button>
              )}
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-sm text-muted">{c.estimate}</p>
      <Link href={resultsHref} className="mt-6 inline-block font-semibold underline underline-offset-4">
        {c.back}
      </Link>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col-reverse">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="num text-3xl font-extrabold">{value}</dd>
    </div>
  );
}
