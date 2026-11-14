import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { SourceLink } from "@/components/ui/area-card";
import { LakeGauge } from "@/components/ui/lake-gauge";
import { ResetOnQuery } from "@/components/home/reset";
import { aqiWord, formatMountain, getToday, todaySources } from "@/lib/today";

export default async function Home() {
  const today = await getToday();
  const { lake, air } = today;
  const gap = lake.healthyMinFt - lake.elevationFt;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 lg:px-8 lg:py-12">
      <ResetOnQuery />
      <p className="text-sm font-semibold uppercase tracking-wide text-muted">
        Utah, {today.stale ? "earlier reading" : "today"}
      </p>

      <div className="mt-3 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
        <section aria-labelledby="lake-heading">
          <h1 id="lake-heading" className="text-3xl font-extrabold lg:text-5xl">
            {gap > 0 ? (
              <>
                The Great Salt Lake is <span className="num text-accent">{gap.toFixed(1)} feet</span> below healthy.
              </>
            ) : (
              <>The Great Salt Lake is inside its healthy range.</>
            )}
          </h1>
          <div className="mt-6">
            <LakeGauge level={lake.elevationFt} healthyMin={lake.healthyMinFt} healthyMax={lake.healthyMaxFt} />
          </div>
          <p className="mt-3 text-sm text-muted">
            Measured {formatMountain(lake.measuredAtUtc)}. <SourceLink href={todaySources.lake.url}>USGS gauge</SourceLink>{" "}
            <SourceLink href={todaySources.healthy.url}>Healthy range</SourceLink>
          </p>
        </section>

        <div className="flex flex-col gap-8">
          <section aria-labelledby="air-heading" className="border-t-4 border-ink pt-4">
            <h2 id="air-heading" className="text-sm font-semibold uppercase tracking-wide text-muted">
              Air in Salt Lake City
            </h2>
            <p className="mt-1 flex flex-wrap items-baseline gap-x-3">
              <span className="num text-5xl font-extrabold">{air.usAqi}</span>
              <span className="text-xl font-semibold">{aqiWord(air.usAqi)}</span>
            </p>
            <p className="mt-1 text-sm text-muted">
              Air quality index, estimated {formatMountain(air.measuredAtUtc)}.{" "}
              <SourceLink href={todaySources.air.url}>Open-Meteo</SourceLink>{" "}
              <SourceLink href={todaySources.aqi.url}>What the index means</SourceLink>
            </p>
          </section>

          <section aria-labelledby="start-heading" className="border-t-4 border-ink pt-4">
            <h2 id="start-heading" className="text-2xl font-extrabold">
              What does your home have to do with it?
            </h2>
            <p className="mt-2">
              Answer six questions. See your water, power and driving numbers next to a typical Utah home, and
              the changes that would matter most.
            </p>
            <p className="mt-2 text-sm text-muted">Two minutes. No account. Your answers stay on this device.</p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <ButtonLink href="/check">
                Check my home <ArrowRight size={20} strokeWidth={2} aria-hidden />
              </ButtonLink>
              <Link href="/results" className="text-sm underline underline-offset-4">
                See a sample home first
              </Link>
              <Link href="/results?lang=es" hrefLang="es" lang="es" className="text-sm underline underline-offset-4">
                Ver un hogar de ejemplo en español
              </Link>
            </div>
            <div className="mt-6 hidden items-center gap-4 lg:flex">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/qr.svg" alt="QR code for utah-footprint.vercel.app" className="size-32 rounded-control" />
              <p className="text-sm">
                Scan to check your own home on your phone.
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
