import type { Answers, AreaResult } from "@/lib/contract";
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

// The shared Card only receives the result, so we carry the zip along for today's air reading.
export type AirResult = AreaResult & { zip?: string };

export function calculate(a: Answers): AreaResult {
  const r: AirResult = { ...calculateCore(a), zip: a.zip };
  return r;
}

function calculateCore(a: Answers): AreaResult {
  const commuteMilesPerYear = Math.max(0, a.commuteMiles) * 2 * WORKDAYS_PER_YEAR;
  const commute = lbsCo2(commuteMilesPerYear);
  const typical = lbsCo2(fact("air.utahMilesPerPerson").value);

  const assumptions = [
    `One person drives the commute, there and back, ${WORKDAYS_PER_YEAR} workdays a year.`,
    `The car is a typical gasoline passenger car (EPA: about ${fact("air.carGramsCo2PerMile").value} grams of CO2 a mile).`,
    "We count tailpipe CO2 only, not making the fuel or the car.",
    "The typical figure is all driving by one Utah resident in a year (FHWA 2022), not only commuting.",
    "Savings assume the bus, train or shared car would run anyway, so the trip you skip is the saving.",
  ];

  if (commuteMilesPerYear === 0) {
    return {
      headline: 0,
      unit: "lbs of CO2 a year from the commute",
      typical: round(typical, 100),
      summary: "No commute by car, so no commute emissions. Errands and trips still count toward the typical figure.",
      actions: [],
      assumptions,
    };
  }

  return {
    headline: round(commute, 10),
    unit: "lbs of CO2 a year from the commute",
    typical: round(typical, 100),
    summary: `Driving ${a.commuteMiles} miles each way adds up to about ${round(commuteMilesPerYear, 100).toLocaleString("en-US")} miles a year.`,
    actions: [
      {
        id: "air.transit2",
        title: "Take the bus or TRAX to work 2 days a week",
        saves: round(commute * (2 / 5), 10),
        unit: "lbs CO2 per year",
        costNote: "Fare depends on route; many employers offer passes.",
        program: programs.transit,
      },
      {
        id: "air.carpool",
        title: "Share the commute with one other person",
        saves: round(commute / 2, 10),
        unit: "lbs CO2 per year",
        costNote: "Free to find a match; split the gas.",
        program: programs.rideshare,
      },
      {
        id: "air.remote1",
        title: "Work from home 1 day a week, if your job allows",
        saves: round(commute / 5, 10),
        unit: "lbs CO2 per year",
        costNote: "Free.",
        program: programs.travelwise,
      },
    ].sort((x, y) => y.saves - x.saves),
    assumptions,
  };
}
