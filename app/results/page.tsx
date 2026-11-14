import type { Metadata } from "next";
import { AreaCard } from "@/components/ui/area-card";
import { ButtonLink } from "@/components/ui/button";
import { TopChanges } from "@/components/results/top-changes";
import { Assistant } from "@/components/results/assistant";
import { fromQuery } from "@/lib/answers";
import { areas } from "@/lib/areas";
import { computeAll, rankActions } from "@/lib/results";
import { sample } from "@/lib/sample";

// Reads the answers from the URL on each request.
export const instant = false;

export const metadata: Metadata = { title: "My footprint | My Utah Footprint" };

export default async function Results({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { answers, isSample } = fromQuery(await searchParams);
  const computed = computeAll(answers);
  const ranked = rankActions(computed);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 lg:px-8 lg:py-12">
      <p className="text-sm font-semibold uppercase tracking-wide text-muted">
        {isSample ? "Sample home" : `Your home in ${answers.zip}`}
      </p>
      <h1 className="mt-2 text-3xl font-extrabold lg:text-5xl">
        {isSample ? `${sample.name}, ${sample.neighborhood}` : "Your Utah footprint"}
      </h1>
      <p className="mt-3 max-w-3xl text-muted">
        {answers.household} {answers.household === 1 ? "person" : "people"},{" "}
        <span className="num">{answers.yardSqFt.toLocaleString("en-US")}</span> square feet of lawn,{" "}
        {answers.commuteMiles > 0 ? `${answers.commuteMiles} miles to work one way` : "no commute by car"},{" "}
        {heatWords[answers.heating]}. These are estimates from those answers, not meter readings.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
        <a href="#top-heading" className="text-sm underline underline-offset-4">
          Jump to the top changes
        </a>
        <a href="/sources" className="text-sm underline underline-offset-4">
          Where every number comes from
        </a>
      </div>

      <div className="mt-8 grid gap-12 lg:grid-cols-3 lg:gap-10">
        {areas.map(({ area, Card }, i) => {
          const c = computed[i];
          return c.ready ? (
            <Card key={area.id} result={c.result} />
          ) : (
            <AreaCard key={area.id} title={area.label} result={c.result} />
          );
        })}
      </div>

      <div className="mt-16">
        <TopChanges actions={ranked} />
      </div>

      <div className="mt-16">
        <Assistant answers={answers} />
      </div>

      <div className="mt-12 flex flex-wrap gap-4">
        <ButtonLink href="/check" variant={isSample ? "primary" : "secondary"}>
          {isSample ? "Check my own home" : "Change my answers"}
        </ButtonLink>
      </div>
    </main>
  );
}

const heatWords = {
  gas: "heated with natural gas",
  electric: "electric heat",
  "heat-pump": "heated with a heat pump",
} as const;
