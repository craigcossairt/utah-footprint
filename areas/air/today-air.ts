import { demoMode } from "@/lib/demo-mode";
import { getToday } from "@/lib/today";

export type AirReading = {
  place: string; // "Provo" or "Salt Lake City"
  usAqi: number;
  pm25: number;
  pm10: number;
  measuredAtUtc: string;
  stale: boolean; // showing a saved reading
  forZip: boolean; // false when we fell back to Salt Lake City
  live: boolean; // false in DEMO_MODE=fixtures, where we never look up the zip
};

async function getJson(url: string) {
  const res = await fetch(url, { next: { revalidate: 900 }, signal: AbortSignal.timeout(3000) });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

// Today's air for the user's zip: Open-Meteo geocoding (zip to town) then the Open-Meteo air model.
// Any failure falls back to the shared Salt Lake City reading, which itself falls back to saved data.
export async function getAirForZip(zip?: string): Promise<AirReading> {
  if (zip && /^\d{5}$/.test(zip) && demoMode() === "live") {
    try {
      const geo = await getJson(
        `https://geocoding-api.open-meteo.com/v1/search?name=${zip}&count=1&countryCode=US&format=json`,
      );
      const place = geo.results?.[0];
      if (!place) throw new Error("zip not found");
      const meteo = await getJson(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${place.latitude}&longitude=${place.longitude}&current=pm2_5,pm10,us_aqi&timezone=UTC`,
      );
      const c = meteo.current;
      if (![c?.us_aqi, c?.pm2_5, c?.pm10].every(Number.isFinite)) throw new Error("bad air reading");
      return {
        place: String(place.name),
        usAqi: Math.round(c.us_aqi),
        pm25: c.pm2_5,
        pm10: c.pm10,
        measuredAtUtc: new Date(`${c.time}Z`).toISOString(),
        stale: false,
        forZip: true,
        live: true,
      };
    } catch {
      // fall through to Salt Lake City
    }
  }
  const today = await getToday();
  const live = demoMode() === "live";
  // In fixtures mode the reading is saved data, so say so rather than calling it "now".
  return { place: "Salt Lake City", ...today.air, stale: today.stale || !live, forZip: false, live };
}
