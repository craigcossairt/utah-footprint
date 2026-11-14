import type { AreaResult } from "@/lib/contract";
import { AreaCard, SourceLink } from "@/components/ui/area-card";
import { getToday, todaySources } from "@/lib/today";
import { facts } from "./facts";

export default async function Card({ result }: { result: AreaResult }) {
  const today = await getToday();
  const { elevationFt, healthyMinFt } = today.lake;
  const gap = healthyMinFt - elevationFt;
  return (
    <AreaCard title="Water" result={result} facts={facts}>
      <p className="mt-3 text-sm">
        Great Salt Lake today: <span className="num font-semibold">{elevationFt.toFixed(1)}</span> feet
        {gap > 0 ? (
          <>
            , <span className="num font-semibold">{gap.toFixed(1)}</span> feet below the healthy range.
          </>
        ) : (
          ", inside the healthy range."
        )}{" "}
        <SourceLink href={todaySources.lake.url}>USGS</SourceLink>
      </p>
    </AreaCard>
  );
}
