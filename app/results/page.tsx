import type { Metadata } from "next";
import { AreaCard } from "@/components/ui/area-card";
import { ButtonLink } from "@/components/ui/button";
import { TopChanges } from "@/components/results/top-changes";
import { Assistant } from "@/components/results/assistant";
import { fromQuery } from "@/lib/answers";
import { areas } from "@/lib/areas";
import { computeAll, rankActions } from "@/lib/results";
import { sample } from "@/lib/sample";
import { t } from "@/lib/i18n";
import { toQuery } from "@/lib/answers";

// Reads the answers from the URL on each request.
export const instant = false;

export const metadata: Metadata = { title: "My footprint | My Utah Footprint" };

export default async function Results({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const { answers, isSample } = fromQuery(params);
  const lang = params.lang === "es" ? "es" : "en";
  const d = t[lang];
  const computed = computeAll(answers, lang);
  const ranked = rankActions(computed);
  const otherHref = `/results?${isSample ? "" : toQuery(answers) + "&"}${lang === "es" ? "" : "lang=es"}`.replace(/[?&]$/, "");
    
  return (
    <main lang={lang} className="mx-auto w-full max-w-5xl px-4 py-8 lg:px-8 lg:py-12">
      <p className="text-sm font-semibold uppercase tracking-wide text-muted">
        {isSample ? d.sample : d.yourHome(answers.zip)}
      </p>
      <h1 className="mt-2 text-3xl font-extrabold lg:text-5xl">
        {isSample ? `${sample.name}, ${sample.neighborhood}` : d.title}
      </h1>
      <p className="mt-3 max-w-3xl text-muted">
        {answers.household} {d.person(answers.household)},{" "}
        <span className="num">{answers.yardSqFt.toLocaleString("en-US")}</span> {d.lawn}, {d.miles(answers.commuteMiles)},{" "}
        {d.heat[answers.heating]}. {d.estimates} {d.cardsNote}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
        <a href="#top-heading" className="text-sm underline underline-offset-4">
          {d.jump}
        </a>
        <a href="/sources" className="text-sm underline underline-offset-4">
          {d.sources}
        </a>
        <a href={otherHref} hrefLang={lang === "es" ? "en" : "es"} className="text-sm font-semibold underline underline-offset-4">
          {d.other}
        </a>
      </div>

      <div className="mt-8 grid gap-12 lg:grid-cols-3 lg:gap-10">
        {areas.map(({ area, Card }, i) => {
          const c = computed[i];
          return c.ready ? (
            <Card key={area.id} result={c.result} lang={lang} />
          ) : (
            <AreaCard key={area.id} title={area.label} result={c.result} lang={lang} />
          );
        })}
      </div>

      <div className="mt-16">
        <TopChanges actions={ranked} lang={lang} />
      </div>

      <div className="mt-16">
        <Assistant answers={answers} lang={lang} />
      </div>

      <div className="mt-12 flex flex-wrap gap-4">
        <ButtonLink href="/check" variant={isSample ? "primary" : "secondary"}>
          {isSample ? d.checkOwn : d.change}
        </ButtonLink>
      </div>
    </main>
  );
}
