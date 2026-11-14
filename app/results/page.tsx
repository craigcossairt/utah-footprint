import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { fromQuery } from "@/lib/answers";
import { areas } from "@/lib/areas";
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

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 lg:px-8 lg:py-12">
      <p className="text-sm font-semibold uppercase tracking-wide text-muted">
        {isSample ? "Sample home" : `Your home in ${answers.zip}`}
      </p>
      <h1 className="mt-2 text-3xl font-extrabold lg:text-5xl">
        {isSample ? `${sample.name}, ${sample.neighborhood}` : "Your Utah footprint"}
      </h1>
      <p className="mt-3 max-w-2xl text-muted">
        {answers.household} {answers.household === 1 ? "person" : "people"},{" "}
        {answers.yardSqFt.toLocaleString("en-US")} square feet of lawn, {answers.commuteMiles} miles to work one way.
        These are estimates from your answers, not meter readings.
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-3 lg:gap-8">
        {areas.map(({ area, Card }) => (
          <Card key={area.id} result={area.calculate(answers)} />
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <ButtonLink href="/check" variant={isSample ? "primary" : "secondary"}>
          {isSample ? "Check my own home" : "Change my answers"}
        </ButtonLink>
      </div>
    </main>
  );
}
