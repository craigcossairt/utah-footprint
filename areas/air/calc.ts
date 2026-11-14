import type { Answers, AreaResult, Lang, Vehicle } from "@/lib/contract";
import { fact, programs } from "./facts";

// Assumptions, not sourced facts. Each one is listed on the card under "What we assumed".
const WORKDAYS_PER_YEAR = 250; // 5 days a week, 50 weeks
const GRAMS_PER_POUND = 453.592; // unit conversion

function lbsCo2(miles: number): number {
  return (miles * fact("air.carGramsCo2PerMile").value) / GRAMS_PER_POUND;
}

// Well-to-wheels pounds of CO2 per mile by fuel, using DOE's method and Utah's power plants.
// Diesel, natural gas and hydrogen have no sourced figure here, so they fall back to gasoline.
function wtwLbsPerMile(v: Vehicle): number | null {
  const gal = fact("air.gasolineLbsCo2ePerGal").value;
  const grid = fact("air.utahGridLbsCo2PerMwh").value / 1000; // lbs per kWh
  const ev = fact("air.pluginElectricPct").value / 100;
  switch (v) {
    case "gas":
      return gal / fact("air.gasCarMpg").value;
    case "hybrid":
      return gal / fact("air.hybridMpg").value;
    case "plugin":
      return (ev * grid) / fact("air.pluginMiPerKwh").value + ((1 - ev) * gal) / fact("air.pluginMpg").value;
    case "electric":
      return grid / fact("air.evMiPerKwh").value;
    default:
      return null;
  }
}

// How this car compares with a gasoline car, as a multiplier on the EPA figure.
export function vehicleFactor(v: Vehicle = "gas"): number {
  const mine = wtwLbsPerMile(v);
  const gas = wtwLbsPerMile("gas");
  return mine === null || gas === null ? 1 : mine / gas;
}

function round(n: number, to = 10): number {
  return Math.round(n / to) * to;
}

const fmt = (n: number) => n.toLocaleString("en-US");

// All words the air card shows. Numbers and links stay the same in both languages.
const T = {
  en: {
    unit: "lbs of CO2 a year from the commute",
    savesUnit: "lbs CO2 per year",
    summary: (miles: number, perYear: number) =>
      `Driving ${miles} miles each way adds up to about ${fmt(perYear)} miles a year.`,
    noCommute: "No commute by car, so no commute emissions. Errands and trips still count toward the typical figure.",
    transit: "Take the bus or TRAX to work 2 days a week",
    transitCost: "Fare depends on route; many employers offer passes.",
    carpool: "Share the commute with one other person",
    carpoolCost: "Free to find a match; split the gas.",
    remote: "Work from home 1 day a week, if your job allows",
    remoteCost: "Free.",
    car: {
      sourced: (name: string, pct: number) =>
        `Your ${name} is counted at ${pct}% of a gasoline car's CO2 per mile, from US DOE figures (fuel production included) and Utah's 2024 power plants (EIA).`,
      unsourced: (name: string) =>
        `We have no sourced Utah figure for a ${name} car yet, so it is counted like a gasoline car.`,
      names: { gas: "gasoline", hybrid: "hybrid", plugin: "plug-in hybrid", electric: "electric car", diesel: "diesel", "natural-gas": "natural gas", hydrogen: "hydrogen fuel cell" },
    },
    assumptions: (days: number, grams: number) => [
      `One person drives the commute, there and back, ${days} workdays a year.`,
      `The car is a typical gasoline passenger car (EPA: about ${grams} grams of CO2 a mile).`,
      "We count tailpipe CO2 only, not making the fuel or the car.",
      "The typical figure is all driving by one Utah resident in a year (FHWA 2022), not only commuting.",
      "Savings assume the bus, train or shared car would run anyway, so the trip you skip is the saving.",
    ],
  },
  es: {
    unit: "libras de CO2 al año por ir al trabajo",
    savesUnit: "libras de CO2 al año",
    summary: (miles: number, perYear: number) =>
      `Manejar ${miles} millas de ida suma unas ${fmt(perYear)} millas al año.`,
    noCommute:
      "No va al trabajo en carro, así que no hay emisiones por ese viaje. Los mandados y paseos sí cuentan en la cifra típica.",
    transit: "Tome el autobús o TRAX al trabajo 2 días a la semana",
    transitCost: "La tarifa depende de la ruta; muchos empleadores ofrecen pases.",
    carpool: "Comparta el viaje al trabajo con otra persona",
    carpoolCost: "Buscar compañero es gratis; dividan la gasolina.",
    remote: "Trabaje desde casa 1 día a la semana, si su trabajo lo permite",
    remoteCost: "Gratis.",
    car: {
      sourced: (name: string, pct: number) =>
        `Su ${name} cuenta como el ${pct}% del CO2 por milla de un carro de gasolina, según cifras del Departamento de Energía de EE. UU. (incluye producir el combustible) y las plantas eléctricas de Utah en 2024 (EIA).`,
      unsourced: (name: string) =>
        `Aún no tenemos una cifra con fuente para un carro de ${name} en Utah, así que lo contamos como uno de gasolina.`,
      names: { gas: "gasolina", hybrid: "híbrido", plugin: "híbrido enchufable", electric: "carro eléctrico", diesel: "diésel", "natural-gas": "gas natural", hydrogen: "celda de hidrógeno" },
    },
    assumptions: (days: number, grams: number) => [
      `Una persona maneja al trabajo, ida y vuelta, ${days} días laborales al año.`,
      `El carro es un auto de gasolina típico (EPA: unos ${grams} gramos de CO2 por milla).`,
      "Contamos solo el CO2 del escape, no el de producir la gasolina ni el carro.",
      "La cifra típica es todo lo que maneja un residente de Utah en un año (FHWA 2022), no solo para ir al trabajo.",
      "Los ahorros suponen que el autobús, el tren o el carro compartido saldría de todos modos, así que el viaje que usted evita es el ahorro.",
    ],
  },
};

// The shared Card only receives the result, so we carry the zip along for today's air reading.
export type AirResult = AreaResult & { zip?: string };

export function calculate(a: Answers, lang: Lang = "en"): AreaResult {
  const r: AirResult = { ...calculateCore(a, lang), zip: a.zip };
  return r;
}

function calculateCore(a: Answers, lang: Lang): AreaResult {
  const t = T[lang] ?? T.en;
  const commuteMilesPerYear = Math.max(0, a.commuteMiles) * 2 * WORKDAYS_PER_YEAR;
  const vehicle = a.vehicle ?? "gas";
  const factor = vehicleFactor(vehicle);
  const commute = lbsCo2(commuteMilesPerYear) * factor;
  const typical = lbsCo2(fact("air.utahMilesPerPerson").value);
  const assumptions = t.assumptions(WORKDAYS_PER_YEAR, fact("air.carGramsCo2PerMile").value);
  if (vehicle !== "gas" && commuteMilesPerYear > 0) {
    const name = t.car.names[vehicle];
    assumptions.splice(1, 0, wtwLbsPerMile(vehicle) === null ? t.car.unsourced(name) : t.car.sourced(name, Math.round(factor * 100)));
  }

  if (commuteMilesPerYear === 0) {
    return { headline: 0, unit: t.unit, typical: round(typical, 100), summary: t.noCommute, actions: [], assumptions };
  }

  return {
    headline: round(commute, 10),
    unit: t.unit,
    typical: round(typical, 100),
    summary: t.summary(a.commuteMiles, round(commuteMilesPerYear, 100)),
    actions: [
      {
        id: "air.transit2",
        title: t.transit,
        saves: round(commute * (2 / 5), 10),
        unit: t.savesUnit,
        costNote: t.transitCost,
        program: programs.transit,
      },
      {
        id: "air.carpool",
        title: t.carpool,
        saves: round(commute / 2, 10),
        unit: t.savesUnit,
        costNote: t.carpoolCost,
        program: programs.rideshare,
      },
      {
        id: "air.remote1",
        title: t.remote,
        saves: round(commute / 5, 10),
        unit: t.savesUnit,
        costNote: t.remoteCost,
        program: programs.travelwise,
      },
    ].sort((x, y) => y.saves - x.saves),
    assumptions,
  };
}
