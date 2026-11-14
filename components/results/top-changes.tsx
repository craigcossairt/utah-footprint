import { SourceLink } from "@/components/ui/area-card";
import type { RankedAction } from "@/lib/results";
import type { Lang } from "@/lib/gemini";
import { areaName, t, type Dict } from "@/lib/i18n";

const SHOWN = 5;

// Every area's actions in one list, biggest share of the home's own number first.
export function TopChanges({ actions, lang = "en" }: { actions: RankedAction[]; lang?: Lang }) {
  const d = t[lang];
  return (
    <section aria-labelledby="top-heading" className="border-t-4 border-ink pt-4">
      <h2 id="top-heading" className="text-2xl font-extrabold lg:text-3xl">
        {d.topTitle}
      </h2>
      <p className="mt-2 max-w-3xl text-muted">{d.topNote}</p>
      {actions.length === 0 ? (
        <p className="mt-4">{d.topEmpty}</p>
      ) : (
        <>
          <ol className="mt-4 divide-y divide-line border-y border-line">
            {actions.slice(0, SHOWN).map((a, i) => (
              <Row key={a.id} a={a} i={i} d={d} lang={lang} />
            ))}
          </ol>
          {actions.length > SHOWN ? (
            <details className="mt-3">
              <summary className="cursor-pointer font-semibold">{d.moreChanges(actions.length - SHOWN)}</summary>
              <ol start={SHOWN + 1} className="mt-2 divide-y divide-line border-y border-line">
                {actions.slice(SHOWN).map((a, i) => (
                  <Row key={a.id} a={a} i={i + SHOWN} d={d} lang={lang} />
                ))}
              </ol>
            </details>
          ) : null}
        </>
      )}
    </section>
  );
}

function Row({ a, i, d, lang }: { a: RankedAction; i: number; d: Dict; lang: Lang }) {
  return (

            <li className="grid grid-cols-[2.5rem_1fr] gap-x-4 py-4 lg:grid-cols-[3rem_1fr_16rem] lg:gap-x-8">
              <span className="num text-3xl font-extrabold text-muted" aria-hidden>
                {i + 1}
              </span>
              <div>
                <p className={`text-sm font-semibold uppercase tracking-wide ${a.areaId === "water" ? "text-lake" : a.areaId === "energy" ? "text-sun" : "text-sky"}`}>{areaName(lang, a.areaId, a.areaLabel)}</p>
                <p className="text-lg font-semibold">{a.title}</p>
                <p className="text-sm">
                  {d.saves} <span className="num font-semibold">{a.saves.toLocaleString("en-US")}</span> {a.unit}.{" "}
                  <span className="text-muted">{a.costNote}</span>
                </p>
                {a.program ? <SourceLink href={a.program.url}>{a.program.name}</SourceLink> : null}
              </div>
              <div className="col-start-2 mt-3 lg:col-start-3 lg:mt-1">
                <p className="text-sm">
                  <span className="num text-2xl font-extrabold">{a.share}%</span>{" "}
                  <span className="text-muted">{d.ofYour(a.areaLabel)}</span>
                </p>
                <div className="mt-1 h-2 w-full rounded-sm bg-line" aria-hidden>
                  <div className="h-2 rounded-sm bg-ink" style={{ width: `${Math.min(100, Math.max(2, a.share))}%` }} />
                </div>
              </div>
            </li>
  );
}
