import type { Answers, AreaResult, Lang } from "@/lib/contract";
import { fact, programs } from "./facts";

// Assumptions, not sourced facts. Each one is listed on the card under "What we assumed".
const WORKDAYS_PER_YEAR = 250; // 5 days a week, 50 weeks
const GRAMS_PER_POUND = 453.592; // unit conversion

function lbsCo2(miles: number): number {
  return (miles * fact("air.carGramsCo2PerMile").value) / GRAMS_PER_POUND;
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
  const commute = lbsCo2(commuteMilesPerYear);
  const typical = lbsCo2(fact("air.utahMilesPerPerson").value);
  const assumptions = t.assumptions(WORKDAYS_PER_YEAR, fact("air.carGramsCo2PerMile").value);

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
