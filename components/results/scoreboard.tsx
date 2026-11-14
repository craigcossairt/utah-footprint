import type { Lang } from "@/lib/contract";
import type { Computed } from "@/lib/results";
import { areaName } from "@/lib/i18n";

const L = {
  en: {
    vs: { water: "a typical Utah home", energy: "a typical Utah home", air: "one Utah resident's driving" },
    you: "This home",
    typical: "Typical",
    more: "more than",
    less: "less than",
    same: "About the same as",
    details: "Details and sources",
    pending: "Not ready yet",
    none: "None from these answers",
  },
  es: {
    vs: { water: "un hogar típico de Utah", energy: "un hogar típico de Utah", air: "lo que maneja un residente típico de Utah" },
    you: "Este hogar",
    typical: "Típico",
    more: "más que",
    less: "menos que",
    same: "Casi igual que",
    details: "Detalles y fuentes",
    pending: "Todavía no está listo",
    none: "Nada con estas respuestas",
  },
};

const AREA_TONE = { water: { text: "text-lake", bar: "bg-lake" }, energy: { text: "text-sun", bar: "bg-sun" }, air: { text: "text-sky", bar: "bg-sky" } } as const;

// The first screen: all three numbers in one row, each against its typical figure.
export function Scoreboard({ computed, lang = "en" }: { computed: Computed[]; lang?: Lang }) {
  const l = L[lang];
  return (
    <section aria-label="Your numbers" className="grid border-t-4 border-ink lg:grid-cols-3">
      {computed.map(({ area, result, ready }, i) => {
        const { headline, typical, unit } = result;
        const max = Math.max(headline, typical) || 1;
        const diff = typical ? Math.round(((headline - typical) / typical) * 100) : 0;
        const word = diff === 0 ? l.same : diff > 0 ? `${diff}% ${l.more}` : `${Math.abs(diff)}% ${l.less}`;
        return (
          <div
            key={area.id}
            className={`flex flex-col border-b border-line py-5 lg:border-b-0 lg:py-6 ${i > 0 ? "lg:border-l lg:pl-8" : ""} ${i < 2 ? "lg:pr-8" : ""}`}
          >
            <h2 className={`text-sm font-semibold uppercase tracking-wide ${AREA_TONE[area.id].text}`}>{areaName(lang, area.id, area.label)}</h2>
            {!ready ? (
              <p className="mt-3 text-muted">{l.pending}</p>
            ) : (
              <>
                <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
                  <span className="num text-5xl font-extrabold lg:text-6xl">{headline.toLocaleString("en-US")}</span>
                </p>
                <p className="text-muted">{unit}</p>
                {typical ? (
                  <div className="mt-4" role="img" aria-label={`${word} ${l.vs[area.id]}`}>
                    <div className="grid grid-cols-[5.5rem_1fr] items-center gap-x-3 gap-y-1.5 text-sm">
                      <span>{l.you}</span>
                      <span className={`block h-3 rounded-sm ${AREA_TONE[area.id].bar}`} style={{ width: `${Math.max(2, (headline / max) * 100)}%` }} />
                      <span className="text-muted">{l.typical}</span>
                      <span className="block h-3 rounded-sm bg-line-strong" style={{ width: `${(typical / max) * 100}%` }} />
                    </div>
                    <p className="mt-2 text-sm">
                      <span className="font-semibold">{word}</span> {l.vs[area.id]}{" "}
                      <span className="num text-muted">({typical.toLocaleString("en-US")})</span>
                    </p>
                  </div>
                ) : null}
                <a href={`#area-${area.id}`} className="mt-auto pt-4 text-sm underline underline-offset-4">
                  {l.details}
                </a>
              </>
            )}
          </div>
        );
      })}
    </section>
  );
}
