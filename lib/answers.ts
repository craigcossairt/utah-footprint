import { VEHICLES, type Answers, type Vehicle } from "./contract";
import { sample } from "./sample";

export const STORAGE_KEY = "uf.answers";

export function toQuery(a: Answers): string {
  const q = new URLSearchParams({
    zip: a.zip,
    p: String(a.household),
    yard: String(a.yardSqFt),
    miles: String(a.commuteMiles),
    heat: a.heating,
  });
  if (a.monthlyKwh) q.set("kwh", String(a.monthlyKwh));
  if (a.vehicle && a.vehicle !== "gas") q.set("car", a.vehicle);
  if (a.otherMilesPerDay) q.set("other", String(a.otherMilesPerDay));
  return q.toString();
}

type Params = Record<string, string | string[] | undefined>;

const num = (v: string | string[] | undefined, min: number, max: number): number | null => {
  const n = Number(Array.isArray(v) ? v[0] : v);
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
};

// Returns the household in the URL, or the sample household when the URL has none.
export function fromQuery(p: Params): { answers: Answers; isSample: boolean } {
  const zip = Array.isArray(p.zip) ? p.zip[0] : p.zip;
  const household = num(p.p, 1, 12);
  const yard = num(p.yard, 0, 50000);
  const miles = num(p.miles, 0, 150);
  const heat = Array.isArray(p.heat) ? p.heat[0] : p.heat;
  if (!zip || !/^84\d{3}$/.test(zip) || household === null || yard === null || miles === null) {
    return { answers: sample.answers, isSample: true };
  }
  const heating = heat === "electric" || heat === "heat-pump" ? heat : "gas";
  const kwh = num(p.kwh, 50, 10000);
  const other = num(p.other, 1, 300);
  const carRaw = Array.isArray(p.car) ? p.car[0] : p.car;
  const vehicle = VEHICLES.includes(carRaw as Vehicle) ? (carRaw as Vehicle) : undefined;
  return {
    answers: { zip, household, yardSqFt: yard, commuteMiles: miles, heating, ...(kwh ? { monthlyKwh: kwh } : {}), ...(vehicle ? { vehicle } : {}), ...(other ? { otherMilesPerDay: Math.round(other) } : {}) },
    isSample: false,
  };
}
