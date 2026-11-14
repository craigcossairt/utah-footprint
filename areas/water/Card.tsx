import type { AreaResult } from "@/lib/contract";
import { AreaCard, SourceLink } from "@/components/ui/area-card";
import { getToday, todaySources } from "@/lib/today";
import { fact, facts, links } from "./facts";

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
      <div className="mt-4 text-sm">
        <h3 className="font-semibold">Saving and reusing water, legally</h3>
        <p className="mt-1">
          Rain barrels are legal in Utah. Use the water on the same lot, store up to{" "}
          <span className="num">{fact("water.rainParcelCapGallons").toLocaleString("en-US")}</span> gallons, and register
          for free if you have more than two containers or one over{" "}
          <span className="num">{fact("water.rainRegisterOverGallons")}</span> gallons.{" "}
          <SourceLink href={links.rainRegister}>Register with Utah Water Rights</SourceLink>
        </p>
        <p className="mt-2">
          Shower, bath, bathroom sink and washer water can water plants by drip only where your county health
          department runs a graywater permit program. Toilet, kitchen sink and dishwasher water never can. Call your
          health department before you build anything.{" "}
          <SourceLink href={links.usuGraywater}>USU Extension: graywater in Utah</SourceLink>
        </p>
      </div>
    </AreaCard>
  );
}
