import { AreaCard } from "@/components/ui/area-card";
import type { AreaResult } from "@/lib/contract";
import { facts } from "./facts";

export default function Card({ result }: { result: AreaResult }) {
  return <AreaCard title="Energy" result={result} facts={facts} />;
}
