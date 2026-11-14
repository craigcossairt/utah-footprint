import { ExternalLink } from "lucide-react";
import type { Action, AreaResult, Fact, Lang } from "@/lib/contract";

const L = {
  en: { you: "Your home", typical: "Typical Utah home", same: "About the same as", more: "more than", less: "less than", aHome: "a typical Utah home", change: "What would change it most", assumed: "What we assumed", from: "Where these numbers come from", saves: "Saves about", newTab: "(opens in a new tab)" },
  es: { you: "Su hogar", typical: "Hogar típico de Utah", same: "Casi igual que", more: "más que", less: "menos que", aHome: "un hogar típico de Utah", change: "Lo que más lo cambiaría", assumed: "Lo que supusimos", from: "De dónde vienen estos números", saves: "Ahorra unos", newTab: "(se abre en una pestaña nueva)" },
};
import { BigNumber } from "./big-number";

// The standard result card. Area owners: render this from your Card.tsx, e.g.
//   <AreaCard title="Water" result={result} facts={facts} />
// and pass extra lines (lake level, today's air) as children.
export function AreaCard({
  title,
  result,
  facts = [],
  lang = "en",
  children,
}: {
  title: string;
  result: AreaResult;
  facts?: Fact[];
  lang?: Lang;
  children?: React.ReactNode;
}) {
  const l = L[lang];
  const ready = result.unit !== "";
  return (
    <section className="border-t-4 border-ink pt-4">
      <h2 className="text-2xl font-extrabold">{title}</h2>
      {ready ? (
        <>
          <div className="mt-3">
            <BigNumber value={result.headline} unit={result.unit} />
          </div>
          <Compare value={result.headline} typical={result.typical} unit={result.unit} lang={lang} />
          <p className="mt-3">{result.summary}</p>
          {children}
          {result.actions.length > 0 ? (
            <div className="mt-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">{l.change}</h3>
              <ul className="mt-2 divide-y divide-line border-y border-line">
                {result.actions.map((a) => (
                  <ActionRow key={a.id} action={a} lang={lang} />
                ))}
              </ul>
            </div>
          ) : null}
          <Details title={l.assumed} items={result.assumptions} />
          <Sources facts={facts} lang={lang} />
        </>
      ) : (
        <p className="mt-3 text-muted">{result.summary}</p>
      )}
    </section>
  );
}

function Compare({ value, typical, unit, lang = "en" }: { value: number; typical: number; unit: string; lang?: Lang }) {
  if (!typical) return null;
  const l = L[lang];
  const max = Math.max(value, typical) || 1;
  const diff = Math.round(((value - typical) / typical) * 100);
  const word = diff === 0 ? l.same : diff > 0 ? `${diff}% ${l.more}` : `${Math.abs(diff)}% ${l.less}`;
  return (
    <div className="mt-4" role="img" aria-label={`${word} ${l.aHome}`}>
      <Bar label={l.you} width={(value / max) * 100} tone="bg-ink" />
      <Bar label={l.typical} width={(typical / max) * 100} tone="bg-line-strong" />
      <p className="mt-1 text-sm text-muted">
        {word} {l.aHome} ({typical.toLocaleString("en-US")} {unit}).
      </p>
    </div>
  );
}

function Bar({ label, width, tone }: { label: string; width: number; tone: string }) {
  return (
    <div className="mt-1 flex items-center gap-3">
      <span className="w-36 shrink-0 text-sm">{label}</span>
      <span className="h-3 flex-1">
        <span className={`block h-3 rounded-sm ${tone}`} style={{ width: `${Math.max(2, width)}%` }} />
      </span>
    </div>
  );
}

export function ActionRow({ action, lang = "en" }: { action: Action; lang?: Lang }) {
  return (
    <li className="py-3">
      <p className="font-semibold">{action.title}</p>
      <p className="text-sm">
        {L[lang].saves} <span className="num font-semibold">{action.saves.toLocaleString("en-US")}</span> {action.unit}.{" "}
        <span className="text-muted">{action.costNote}</span>
      </p>
      {action.program ? <SourceLink href={action.program.url}>{action.program.name}</SourceLink> : null}
    </li>
  );
}

export function SourceLink({
  href,
  children,
  onDark = false,
}: {
  href: string;
  children: React.ReactNode;
  onDark?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-1 text-sm underline underline-offset-4 ${onDark ? "text-bg" : "text-lake"}`}
    >
      {children}
      <ExternalLink size={14} strokeWidth={2} aria-hidden />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

function Details({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <details className="mt-4 text-sm">
      <summary className="cursor-pointer font-semibold">{title}</summary>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </details>
  );
}

function Sources({ facts, lang = "en" }: { facts: Fact[]; lang?: Lang }) {
  if (facts.length === 0) return null;
  return (
    <details className="mt-2 text-sm">
      <summary className="cursor-pointer font-semibold">{L[lang].from}</summary>
      <ul className="mt-2 space-y-1">
        {facts.map((f) => (
          <li key={f.key}>
            <span className="num">{f.value.toLocaleString("en-US")}</span> {f.unit}, {f.year}.{" "}
            <SourceLink href={f.url}>{f.source}</SourceLink>
          </li>
        ))}
      </ul>
    </details>
  );
}
