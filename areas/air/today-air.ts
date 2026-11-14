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

type Place = { name: string; latitude: number; longitude: number };

async function placeForZip(zip?: string): Promise<Place | null> {
  if (!zip || !/^\d{5}$/.test(zip) || demoMode() !== "live") return null;
  const geo = await getJson(`https://geocoding-api.open-meteo.com/v1/search?name=${zip}&count=1&countryCode=US&format=json`);
  const p = geo.results?.[0];
  return p ? { name: String(p.name), latitude: p.latitude, longitude: p.longitude } : null;
}

export type DustOutlook = {
  place: string;
  day: string; // "2026-11-16", local date in Utah
  pm10Max: number; // highest hourly coarse dust forecast that day, µg/m³
  fetchedAtUtc: string;
};

// The dustiest of the next three days (tomorrow through three days out) from Open-Meteo's hourly PM10
// forecast. Returns null on any failure, in fixtures mode, or without a usable zip: the card then shows nothing.
export async function getDustOutlook(zip?: string): Promise<DustOutlook | null> {
  try {
    const place = await placeForZip(zip);
    if (!place) return null;
    const res = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${place.latitude}&longitude=${place.longitude}&hourly=pm10&forecast_days=4&timezone=America%2FDenver`,
      { cache: "no-store", signal: AbortSignal.timeout(3000) },
    );
    if (!res.ok) return null;
    const m = await res.json();
    const times: string[] = m.hourly?.time ?? [];
    const pm10: (number | null)[] = m.hourly?.pm10 ?? [];
    const days = [...new Set(times.map((t) => t.slice(0, 10)))].slice(1, 4);
    let day = "";
    let max = -1;
    for (let i = 0; i < times.length; i++) {
      const v = pm10[i];
      const d = times[i].slice(0, 10);
      if (typeof v === "number" && Number.isFinite(v) && days.includes(d) && v > max) {
        max = v;
        day = d;
      }
    }
    if (!day) return null;
    return { place: place.name, day, pm10Max: Math.round(max), fetchedAtUtc: new Date().toISOString() };
  } catch {
    return null;
  }
}

// Today's air for the user's zip: Open-Meteo geocoding (zip to town) then the Open-Meteo air model.
// Any failure falls back to the shared Salt Lake City reading, which itself falls back to saved data.
export async function getAirForZip(zip?: string): Promise<AirReading> {
  if (zip && /^\d{5}$/.test(zip) && demoMode() === "live") {
    try {
      const place = await placeForZip(zip);
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
