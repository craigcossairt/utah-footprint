import type { Answers } from "./contract";
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
  return {
    answers: { zip, household, yardSqFt: yard, commuteMiles: miles, heating, ...(kwh ? { monthlyKwh: kwh } : {}) },
    isSample: false,
  };
}
