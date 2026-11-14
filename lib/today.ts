import { cacheLife } from "next/cache";
import fallback from "@/data/fixtures/today.json";
import { demoMode } from "./demo-mode";

export type Today = {
  lake: { elevationFt: number; measuredAtUtc: string; healthyMinFt: number; healthyMaxFt: number };
  air: { usAqi: number; pm25: number; pm10: number; measuredAtUtc: string };
  stale: boolean; // true when we are showing an earlier saved reading
};

// Sources shown on screen next to these readings.
export const todaySources = {
  lake: {
    name: "USGS gauge 10010000, Great Salt Lake at Saltair Boat Harbor",
    url: "https://waterdata.usgs.gov/monitoring-location/10010000/",
  },
  healthy: {
    name: "Great Salt Lake Strategic Plan, State of Utah",
    url: "https://greatsaltlake.utah.gov/wp-content/uploads/Great-Salt-Lake-Strategic-Plan.pdf",
  },
  air: {
    name: "Open-Meteo air quality model, Salt Lake City",
    url: "https://open-meteo.com/en/docs/air-quality-api",
  },
  aqi: { name: "EPA AirNow, AQI basics", url: "https://www.airnow.gov/aqi/aqi-basics/" },
};

const HEALTHY = { healthyMinFt: 4198, healthyMaxFt: 4205 };

async function getJson(url: string) {
  const res = await fetch(url, { next: { revalidate: 900 }, signal: AbortSignal.timeout(4000) });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

export async function getToday(): Promise<Today> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 900, expire: 3600 });
  const saved = { ...(fallback as Omit<Today, "stale">), stale: true };
  if (demoMode() === "fixtures") return { ...saved, stale: false };
  try {
    const [usgs, meteo] = await Promise.all([
      getJson("https://waterservices.usgs.gov/nwis/iv/?format=json&sites=10010000&parameterCd=62614"),
      getJson(
        "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=40.76&longitude=-111.89&current=pm2_5,pm10,us_aqi&timezone=UTC",
      ),
    ]);
    const reading = usgs.value.timeSeries[0].values[0].value[0];
    const elevationFt = Number(reading.value);
    if (!Number.isFinite(elevationFt) || elevationFt < 4100) throw new Error("bad lake reading");
    return {
      lake: { elevationFt, measuredAtUtc: new Date(reading.dateTime).toISOString(), ...HEALTHY },
      air: {
        usAqi: Math.round(meteo.current.us_aqi),
        pm25: meteo.current.pm2_5,
        pm10: meteo.current.pm10,
        measuredAtUtc: new Date(`${meteo.current.time}Z`).toISOString(),
      },
      stale: false,
    };
  } catch {
    return saved;
  }
}

// EPA AQI categories. Always shown as a word, never colour alone.
export function aqiWord(aqi: number): string {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for sensitive groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very unhealthy";
  return "Hazardous";
}

export function formatMountain(utc: string): string {
  return new Date(utc).toLocaleString("en-US", {
    timeZone: "America/Denver",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}
