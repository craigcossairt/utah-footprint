import type { AreaResult } from "@/lib/contract";
import { AreaCard, SourceLink } from "@/components/ui/area-card";
import { aqiWord, formatMountain, todaySources } from "@/lib/today";
import type { AirResult } from "./calc";
import { facts, programs } from "./facts";
import { getAirForZip } from "./today-air";

export default async function Card({ result }: { result: AreaResult }) {
  const zip = (result as AirResult).zip;
  const ready = result.unit !== "";
  // The shared comparison bar is labelled "Typical Utah home"; ours is one resident's driving,
  // so we hide the bar and say the comparison in words instead.
  const shown = { ...result, typical: 0 };

  return (
    <AreaCard title="Air" result={shown} facts={facts}>
      {ready ? <PersonCompare value={result.headline} typical={result.typical} /> : null}
      <TodayAir zip={zip} />
      <p className="mt-3 text-sm">
        On windy days, dust from the dry Great Salt Lake bed adds coarse particles (PM10) to the air along the
        Wasatch Front. A higher lake leaves less lakebed to blow.{" "}
        <SourceLink href={programs.lakeDust.url}>{programs.lakeDust.name}</SourceLink>
      </p>
    </AreaCard>
  );
}

function PersonCompare({ value, typical }: { value: number; typical: number }) {
  if (!typical) return null;
  const pct = Math.round((value / typical) * 100);
  return (
    <p className="mt-3 text-sm text-muted">
      That is about <span className="num font-semibold text-ink">{pct}%</span> of the CO2 from all the driving one
      Utah resident does in a typical year ({typical.toLocaleString("en-US")} lbs).
    </p>
  );
}

async function TodayAir({ zip }: { zip?: string }) {
  try {
    const air = await getAirForZip(zip);
    const { pm25, pm10, usAqi, measuredAtUtc } = air;
    return (
      <div className="mt-4 border-l-4 border-line pl-3 text-sm">
        <p className="font-semibold">
          Air in {air.place} {air.stale ? "(last saved reading)" : "now"}: {aqiWord(usAqi)}, AQI{" "}
          <span className="num">{usAqi}</span>
        </p>
        {zip && air.live && !air.forZip ? (
          <p className="text-muted">We couldn&apos;t get a reading for {zip}, so this is Salt Lake City.</p>
        ) : null}
        <p className="text-muted">
          Fine particles (PM2.5) <span className="num">{Math.round(pm25)}</span> µg/m³, coarse dust (PM10){" "}
          <span className="num">{Math.round(pm10)}</span> µg/m³. Measured {formatMountain(measuredAtUtc)}.
        </p>
        <SourceLink href={todaySources.air.url}>Open-Meteo air quality model</SourceLink>
      </div>
    );
  } catch {
    return <p className="mt-4 text-sm text-muted">Today&apos;s air reading isn&apos;t available right now.</p>;
  }
}
