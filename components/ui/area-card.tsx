import { ExternalLink } from "lucide-react";
import type { Action, AreaResult, Fact } from "@/lib/contract";
import { BigNumber } from "./big-number";

// The standard result card. Area owners: render this from your Card.tsx, e.g.
//   <AreaCard title="Water" result={result} facts={facts} />
// and pass extra lines (lake level, today's air) as children.
export function AreaCard({
  title,
  result,
  facts = [],
  children,
}: {
  title: string;
  result: AreaResult;
  facts?: Fact[];
  children?: React.ReactNode;
}) {
  const ready = result.unit !== "";
  return (
    <section className="border-t-4 border-ink pt-4">
      <h2 className="text-2xl font-extrabold">{title}</h2>
      {ready ? (
        <>
          <div className="mt-3">
            <BigNumber value={result.headline} unit={result.unit} />
          </div>
          <Compare value={result.headline} typical={result.typical} unit={result.unit} />
          <p className="mt-3">{result.summary}</p>
          {children}
          {result.actions.length > 0 ? (
            <div className="mt-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">What would change it most</h3>
              <ul className="mt-2 divide-y divide-line border-y border-line">
                {result.actions.map((a) => (
                  <ActionRow key={a.id} action={a} />
                ))}
              </ul>
            </div>
          ) : null}
          <Details title="What we assumed" items={result.assumptions} />
          <Sources facts={facts} />
        </>
      ) : (
        <p className="mt-3 text-muted">{result.summary}</p>
      )}
    </section>
  );
}

function Compare({ value, typical, unit }: { value: number; typical: number; unit: string }) {
  if (!typical) return null;
  const max = Math.max(value, typical) || 1;
  const diff = Math.round(((value - typical) / typical) * 100);
  const word = diff === 0 ? "About the same as" : diff > 0 ? `${diff}% more than` : `${Math.abs(diff)}% less than`;
  return (
    <div className="mt-4" role="img" aria-label={`${word} a typical Utah home`}>
      <Bar label="Your home" width={(value / max) * 100} tone="bg-ink" />
      <Bar label="Typical Utah home" width={(typical / max) * 100} tone="bg-line" />
      <p className="mt-1 text-sm text-muted">
        {word} a typical Utah home ({typical.toLocaleString("en-US")} {unit}).
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

export function ActionRow({ action }: { action: Action }) {
  return (
    <li className="py-3">
      <p className="font-semibold">{action.title}</p>
      <p className="text-sm">
        Saves about <span className="num font-semibold">{action.saves.toLocaleString("en-US")}</span> {action.unit}.{" "}
        <span className="text-muted">{action.costNote}</span>
      </p>
      {action.program ? <SourceLink href={action.program.url}>{action.program.name}</SourceLink> : null}
    </li>
  );
}

export function SourceLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-sm text-lake underline underline-offset-4"
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

function Sources({ facts }: { facts: Fact[] }) {
  if (facts.length === 0) return null;
  return (
    <details className="mt-2 text-sm">
      <summary className="cursor-pointer font-semibold">Where these numbers come from</summary>
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
