import type { Metadata } from "next";
import { SourceLink } from "@/components/ui/area-card";
import { areas } from "@/lib/areas";
import { computeAll } from "@/lib/results";
import { sample } from "@/lib/sample";
import { todaySources } from "@/lib/today";
import { WaterBand } from "@/components/ui/water-band";

export const metadata: Metadata = { title: "Sources | EcoSwitch" };

export default function Sources() {
  const computed = computeAll(sample.answers);
  const total = areas.reduce((n, { area }) => n + area.facts.length, 0);

  return (
    <main>
      <WaterBand>
      <h1 className="text-3xl font-extrabold lg:text-5xl">Where every number comes from</h1>
      <p className="mt-3 max-w-3xl">
        Our own formulas do the math, using the <span className="num font-semibold">{total}</span> public figures
        below. Gemini only explains the results, and every answer names the figures it used. Results are estimates from
        six answers, not meter readings.
      </p>
      <nav aria-label="Jump to a section" className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <a href="#today" className="underline underline-offset-4">
          Today&apos;s readings
        </a>
        {areas.map(({ area }) => (
          <a key={area.id} href={`#${area.id}`} className="underline underline-offset-4">
            {area.label}
          </a>
        ))}
      </nav>
      </WaterBand>

      <div className="mx-auto w-full max-w-5xl px-4 pb-12 lg:px-8">
      <section id="today" className="mt-10 scroll-mt-4 border-t-4 border-ink pt-4">
        <h2 className="text-2xl font-extrabold">Today&apos;s readings</h2>
        <p className="mt-1 text-sm text-muted">Fetched live, refreshed every 15 minutes. A saved reading is shown and labelled if a source is down.</p>
        <ul className="mt-3 divide-y divide-line border-y border-line">
          {Object.values(todaySources).map((s) => (
            <li key={s.url} className="py-3">
              <SourceLink href={s.url}>{s.name}</SourceLink>
            </li>
          ))}
        </ul>
      </section>

      {areas.map(({ area }, i) => {
        const assumed = computed[i].result.assumptions;
        return (
          <section key={area.id} id={area.id} className="mt-10 scroll-mt-4 border-t-4 border-ink pt-4">
            <h2 className="text-2xl font-extrabold">{area.label}</h2>
            {area.facts.length === 0 ? (
              <p className="mt-3 text-muted">Sources for this part are being added.</p>
            ) : (
              <ul className="mt-3 divide-y divide-line border-y border-line">
                {area.facts.map((f) => (
                  <li key={f.key} id={f.key} className="scroll-mt-4 py-3 target:bg-surface lg:grid lg:grid-cols-[12rem_1fr] lg:gap-6">
                    <p className="num text-2xl font-extrabold">{f.value.toLocaleString("en-US")}</p>
                    <div>
                      <p>
                        {f.unit} <span className="text-muted">({f.year})</span>
                      </p>
                      <SourceLink href={f.url}>{f.source}</SourceLink>
                      <p className="mt-1 text-sm text-muted">
                        Fact key <code className="num">{f.key}</code>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {assumed.length > 0 ? (
              <details className="mt-3 text-sm">
                <summary className="cursor-pointer font-semibold">What is estimated (shown for the sample home)</summary>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
                  {assumed.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </details>
            ) : null}
          </section>
        );
      })}
      </div>
    </main>
  );
}
