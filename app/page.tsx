import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { SourceLink } from "@/components/ui/area-card";
import { ResetOnQuery } from "@/components/home/reset";
import { Wave } from "@/components/home/wave";
import { home } from "@/lib/i18n";
import { getToday, todaySources } from "@/lib/today";

// Reads the language from the URL on each request.
export const instant = false;

const ROW = "mx-auto flex w-full max-w-5xl lg:px-8";
const SCALE = "relative w-16 shrink-0 border-r-2";
const TICK = "num absolute right-2 text-sm font-semibold";
const ft = (n: number, digits = 0) =>
  n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });

// The screen is the gauge: the healthy band, the gap and the water are stacked to scale.
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const lang = (await searchParams).lang === "es" ? "es" : "en";
  const d = home[lang];
  const q = lang === "es" ? "?lang=es" : "";
  const today = await getToday();
  const { lake, air } = today;
  const gap = lake.healthyMinFt - lake.elevationFt;
  const below = gap > 0;
  const measured = (
    <p className="mt-3 text-sm text-muted">
      {d.measured(d.when(lake.measuredAtUtc))} <SourceLink href={todaySources.lake.url}>{d.gaugeSource}</SourceLink>
    </p>
  );

  return (
    <main lang={lang} className="waterline flex flex-1 flex-col overflow-hidden">
      <div className="border-y-2 border-dashed border-sage bg-sage/15">
        <div className={ROW} style={{ minHeight: `calc(var(--ft) * ${lake.healthyMaxFt - lake.healthyMinFt})` }}>
          <div className={`${SCALE} border-ink`} aria-hidden>
            <span className={`${TICK} top-1`}>{ft(lake.healthyMaxFt)}</span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center px-4 py-4 lg:px-8">
            <ResetOnQuery message={d.cleared} />
            <p className="text-sm font-semibold text-muted">{d.kicker(today.stale)}</p>
            {below ? (
              <p className="font-display text-xl font-extrabold text-sage">{d.healthySource}</p>
            ) : (
              <h1 className="text-3xl font-extrabold lg:text-5xl">{d.lakeHealthy}</h1>
            )}
            <p className="text-sage">
              <span className="num">{d.range(ft(lake.healthyMinFt), ft(lake.healthyMaxFt))}</span>{" "}
              <SourceLink href={todaySources.healthy.url}>{d.healthySource}</SourceLink>
            </p>
            {!below && measured}
          </div>
        </div>
      </div>

      {below && (
        <section aria-labelledby="lake-heading" className="relative overflow-hidden">
          <div className={ROW} style={{ minHeight: `calc(var(--ft) * ${gap})` }}>
            <div className={`${SCALE} border-ink`} aria-hidden>
              <span className={`${TICK} top-1`}>{ft(lake.healthyMinFt)}</span>
              <span className={`${TICK} bottom-4 text-lake`}>{ft(lake.elevationFt, 1)}</span>
            </div>
            <div className="relative flex min-w-0 flex-1 flex-col justify-center py-6 pl-12 pr-4 lg:pl-16 lg:pr-8">
              <div className="absolute inset-y-2 left-4 flex w-3 flex-col items-center" aria-hidden>
                <svg viewBox="0 0 12 12" className="size-3 shrink-0 fill-accent">
                  <path d="M6 0 12 12H0Z" />
                </svg>
                <div className="w-px flex-1 border-l-2 border-accent" />
                <svg viewBox="0 0 12 12" className="size-3 shrink-0 fill-accent">
                  <path d="M0 0H12L6 12Z" />
                </svg>
              </div>
              <h1 id="lake-heading" className="text-3xl font-extrabold lg:text-6xl">
                {d.lakeBefore}
                <span className="num whitespace-nowrap text-accent">{d.feet(gap.toFixed(1))}</span>
                {d.lakeAfter}
              </h1>
              {measured}
            </div>
          </div>
          <div aria-hidden className="waterline-drain pointer-events-none absolute inset-0 z-10 bg-lake">
            <Wave />
          </div>
        </section>
      )}

      <div className="relative flex-1 bg-lake text-bg">
        <Wave />
        <div className={`${ROW} h-full`}>
          <div className={`${SCALE} border-bg/50`} aria-hidden />
          <div className="min-w-0 flex-1 px-4 pb-12 pt-4 lg:px-8">
            <p className="num font-extrabold">{d.todayIs(ft(lake.elevationFt, 1))}</p>

            <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-12">
              <section aria-labelledby="air-heading">
                <h2 id="air-heading" className="text-sm font-semibold">
                  {d.airTitle}
                </h2>
                <p className="mt-1 flex flex-wrap items-baseline gap-x-3">
                  <span className="num text-5xl font-extrabold">{air.usAqi}</span>
                  <span className="text-xl font-semibold">{d.aqiWord(air.usAqi)}</span>
                </p>
                <p className="mt-1 text-sm">
                  {d.airNote(d.when(air.measuredAtUtc))}{" "}
                  <SourceLink onDark href={todaySources.air.url}>
                    Open-Meteo
                  </SourceLink>{" "}
                  <SourceLink onDark href={todaySources.aqi.url}>
                    {d.aqiSource}
                  </SourceLink>
                </p>
              </section>

              <section aria-labelledby="start-heading">
                <h2 id="start-heading" className="text-2xl font-extrabold">
                  {d.startTitle}
                </h2>
                <p className="mt-2">{d.startBody}</p>
                <p className="mt-2 text-sm">{d.startNote}</p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <ButtonLink variant="inverse" href={`/check${q}`}>
                    {d.check} <ArrowRight size={20} strokeWidth={2} aria-hidden />
                  </ButtonLink>
                  <Link href={`/results${q}`} className="text-sm underline underline-offset-4">
                    {d.sampleLink}
                  </Link>
                  <a
                    href={lang === "es" ? "/" : "/?lang=es"}
                    hrefLang={lang === "es" ? "en" : "es"}
                    lang={lang === "es" ? "en" : "es"}
                    className="text-sm font-semibold underline underline-offset-4"
                  >
                    {d.other}
                  </a>
                </div>
                <div className="mt-6 hidden items-center gap-4 lg:flex">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/qr.svg" alt={d.qrAlt} className="size-32 rounded-control" />
                  <p className="text-sm">
                    {d.qr}
                    <br />
                    utah-footprint.vercel.app
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
