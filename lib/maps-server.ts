import { createHash } from "node:crypto";
import routes from "@/data/fixtures/routes.json";
import { demoMode } from "./demo-mode";

// Server only. Measures a one-way driving distance with the Google Routes API.
// Addresses are never logged or stored: the in-memory cache is keyed by a hash of the pair.

export type RouteLabel = { en: string; es: string };
export type Distance = { miles: number; origin: "live" | "saved"; from?: RouteLabel; to?: RouteLabel };

const TIMEOUT_MS = 5000;
const METERS_PER_MILE = 1609.344;
const CACHE_MAX = 500;
const cache = new Map<string, number>();

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();

function savedRoute(from: string, to: string): Distance | null {
  const f = norm(from);
  const t = norm(to);
  const hit = routes.find((r) => r.from.match.some((m) => f.includes(m)) && r.to.match.some((m) => t.includes(m)));
  return hit ? { miles: hit.miles, origin: "saved", from: hit.from.label, to: hit.to.label } : null;
}

async function liveMiles(from: string, to: string, key: string): Promise<number> {
  const res = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": "routes.distanceMeters,routes.duration",
    },
    body: JSON.stringify({ origin: { address: from }, destination: { address: to }, travelMode: "DRIVE", regionCode: "US" }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`routes ${res.status}`);
  const data = (await res.json()) as { routes?: { distanceMeters?: number }[] };
  const meters = data.routes?.[0]?.distanceMeters;
  if (typeof meters !== "number" || meters <= 0) throw new Error("no route");
  return Math.max(1, Math.round(meters / METERS_PER_MILE));
}

// Returns null when the route can't be measured and no saved route matches.
export async function measureDistance(from: string, to: string): Promise<Distance | null> {
  const key = process.env.GOOGLE_MAPS_SERVER_KEY;
  if (demoMode() === "fixtures" || !key) return savedRoute(from, to);

  const id = createHash("sha256").update(`${norm(from)}|${norm(to)}`).digest("hex");
  const cached = cache.get(id);
  if (cached) return { miles: cached, origin: "live" };
  try {
    const miles = await liveMiles(from, to, key);
    if (cache.size >= CACHE_MAX) cache.clear();
    cache.set(id, miles);
    return { miles, origin: "live" };
  } catch {
    return savedRoute(from, to);
  }
}
