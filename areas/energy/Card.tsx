import { AreaCard } from "@/components/ui/area-card";
import type { AreaResult, Lang } from "@/lib/contract";
import { facts } from "./facts";

const TITLE = { en: "Energy", es: "Energía" };

export default function Card({ result, lang = "en" }: { result: AreaResult; lang?: Lang }) {
  return <AreaCard title={TITLE[lang] ?? TITLE.en} result={result} facts={facts} lang={lang} />;
}
