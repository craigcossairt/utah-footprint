import type { Metadata } from "next";
import { SourceLink } from "@/components/ui/area-card";
import { areas } from "@/lib/areas";
import { todaySources } from "@/lib/today";

export const metadata: Metadata = { title: "Sources | My Utah Footprint" };

export default function Sources() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 lg:px-8 lg:py-12">
      <h1 className="text-3xl font-extrabold lg:text-5xl">Where every number comes from</h1>
      <p className="mt-3 text-muted">
        Our own formulas do the math, using the public figures below. Results are estimates from six answers,
        not meter readings.
      </p>

      <section className="mt-8 border-t-4 border-ink pt-4">
        <h2 className="text-2xl font-extrabold">Today&apos;s readings</h2>
        <ul className="mt-3 space-y-2">
          {Object.values(todaySources).map((s) => (
            <li key={s.url}>
              <SourceLink href={s.url}>{s.name}</SourceLink>
            </li>
          ))}
        </ul>
      </section>

      {areas.map(({ area }) => (
        <section key={area.id} className="mt-8 border-t-4 border-ink pt-4">
          <h2 className="text-2xl font-extrabold">{area.label}</h2>
          {area.facts.length === 0 ? (
            <p className="mt-3 text-muted">Sources for this part are being added.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {area.facts.map((f) => (
                <li key={f.key} className="py-3">
                  <p>
                    <span className="num font-semibold">{f.value.toLocaleString("en-US")}</span> {f.unit} ({f.year})
                  </p>
                  <SourceLink href={f.url}>{f.source}</SourceLink>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </main>
  );
}
