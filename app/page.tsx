import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { SourceLink } from "@/components/ui/area-card";
import { LakeGauge } from "@/components/ui/lake-gauge";
import { ResetOnQuery } from "@/components/home/reset";
import { home } from "@/lib/i18n";
import { getToday, todaySources } from "@/lib/today";

// Reads the language from the URL on each request.
export const instant = false;

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

  return (
    <main lang={lang} className="mx-auto w-full max-w-5xl px-4 py-8 lg:px-8 lg:py-12">
      <ResetOnQuery message={d.cleared} />
      <p className="text-sm font-semibold uppercase tracking-wide text-muted">
        {d.kicker(today.stale)}
      </p>

      <div className="mt-3 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
        <section aria-labelledby="lake-heading">
          <h1 id="lake-heading" className="text-3xl font-extrabold lg:text-5xl">
            {gap > 0 ? (
              <>
                {d.lakeBefore}
                <span className="num text-accent">{d.feet(gap.toFixed(1))}</span>
                {d.lakeAfter}
              </>
            ) : (
              <>{d.lakeHealthy}</>
            )}
          </h1>
          <div className="mt-6">
            <LakeGauge level={lake.elevationFt} healthyMin={lake.healthyMinFt} healthyMax={lake.healthyMaxFt} lang={lang} />
          </div>
          <p className="mt-3 text-sm text-muted">
            {d.measured(d.when(lake.measuredAtUtc))} <SourceLink href={todaySources.lake.url}>{d.gaugeSource}</SourceLink>{" "}
            <SourceLink href={todaySources.healthy.url}>{d.healthySource}</SourceLink>
          </p>
        </section>

        <div className="flex flex-col gap-8">
          <section aria-labelledby="air-heading" className="border-t-4 border-ink pt-4">
            <h2 id="air-heading" className="text-sm font-semibold uppercase tracking-wide text-muted">
              {d.airTitle}
            </h2>
            <p className="mt-1 flex flex-wrap items-baseline gap-x-3">
              <span className="num text-5xl font-extrabold">{air.usAqi}</span>
              <span className="text-xl font-semibold">{d.aqiWord(air.usAqi)}</span>
            </p>
            <p className="mt-1 text-sm text-muted">
              {d.airNote(d.when(air.measuredAtUtc))}{" "}
              <SourceLink href={todaySources.air.url}>Open-Meteo</SourceLink>{" "}
              <SourceLink href={todaySources.aqi.url}>{d.aqiSource}</SourceLink>
            </p>
          </section>

          <section aria-labelledby="start-heading" className="border-t-4 border-ink pt-4">
            <h2 id="start-heading" className="text-2xl font-extrabold">
              {d.startTitle}
            </h2>
            <p className="mt-2">{d.startBody}</p>
            <p className="mt-2 text-sm text-muted">{d.startNote}</p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <ButtonLink href={`/check${q}`}>
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
                <span className="text-muted">utah-footprint.vercel.app</span>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
