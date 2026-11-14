import type { Fact } from "@/lib/contract";

// Sourced numbers for the air area. No source, no number.
export const facts: Fact[] = [
  {
    key: "air.carGramsCo2PerMile",
    value: 400,
    unit: "grams of CO2 per mile, typical passenger car",
    source: "EPA, Greenhouse Gas Emissions from a Typical Passenger Vehicle",
    url: "https://www.epa.gov/greenvehicles/greenhouse-gas-emissions-typical-passenger-vehicle",
    year: 2023,
  },
  {
    key: "air.utahMilesPerPerson",
    value: 10495,
    unit: "miles driven per Utah resident per year, all road travel",
    source: "FHWA Highway Statistics 2022, Table PS-1",
    url: "https://www.fhwa.dot.gov/policyinformation/statistics/2022/ps1.cfm",
    year: 2022,
  },
  {
    key: "air.inversionMobileSharePct",
    value: 48,
    unit: "percent of a typical winter inversion's PM2.5 from mobile sources (vehicles, trains and aircraft)",
    source: "Utah Division of Air Quality, Understanding Utah's Air Quality",
    url: "https://deq.utah.gov/daq/understanding-utahs-air-quality",
    year: 2019,
  },
];

export function fact(key: string): Fact {
  const f = facts.find((x) => x.key === key);
  if (!f) throw new Error(`Missing air fact ${key}`);
  return f;
}

// Programs linked from actions. Links only, no figures.
export const programs = {
  transit: { name: "UTA trip planner and passes", url: "https://www.rideuta.com/" },
  rideshare: { name: "UTA Rideshare: carpool and vanpool", url: "https://www.rideuta.com/Services/Rideshare" },
  travelwise: { name: "TravelWise, Utah Department of Transportation", url: "https://travelwise.utah.gov/how-to-travelwise" },
  lakeDust: {
    name: "Great Salt Lake dust, Utah Division of Air Quality",
    url: "https://deq.utah.gov/air-quality/great-salt-lake-dust",
  },
};
