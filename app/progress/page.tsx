import type { Metadata } from "next";
import { Tracker, type TrackAction } from "@/components/progress/tracker";
import { fromQuery, toQuery } from "@/lib/answers";
import { computeAll } from "@/lib/results";

// Reads the answers from the URL on each request, like /results.
export const instant = false;

export const metadata: Metadata = { title: "My progress | EcoSwitch" };

// Dollar figures already sit in each action's cost note ("About $270 a year…", "Unos $270 al año…").
// We read them back out so the tracker uses exactly the numbers the cards show.
function dollarsPerYear(costNote: string): number {
  const m = costNote.match(/\$([\d,]+)(?=\s+(?:a year|al año))/);
  return m ? Number(m[1].replace(/,/g, "")) : 0;
}

export default async function ProgressPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const { answers, isSample } = fromQuery(params);
  const lang = params.lang === "es" ? "es" : "en";

  const actions: TrackAction[] = computeAll(answers, lang)
    .filter((c) => c.ready)
    .flatMap((c) =>
      c.result.actions.map((a) => ({
        id: a.id,
        area: c.area.id,
        title: a.title,
        savesPerYear: a.saves,
        unit: a.unit,
        dollarsPerYear: dollarsPerYear(a.costNote),
      })),
    );

  const resultsHref = `/results?${isSample ? "" : toQuery(answers) + "&"}${lang === "es" ? "lang=es" : ""}`.replace(/[?&]$/, "");

  return (
    <main lang={lang}>
      <Tracker actions={actions} lang={lang} resultsHref={resultsHref} />
    </main>
  );
}
