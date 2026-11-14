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
    key: "air.carMpg",
    value: 22.2,
    unit: "miles per gallon, average gasoline car on the road",
    source: "EPA, Greenhouse Gas Emissions from a Typical Passenger Vehicle",
    url: "https://www.epa.gov/greenvehicles/greenhouse-gas-emissions-typical-passenger-vehicle",
    year: 2023,
  },
  {
    key: "air.gasPricePerGallon",
    value: 3.946,
    unit: "dollars per gallon, regular gasoline, Rocky Mountain region, week of 9 Nov 2026",
    source: "EIA, Gasoline and Diesel Fuel Update",
    url: "https://www.eia.gov/petroleum/gasdiesel/",
    year: 2026,
  },
  {
    key: "air.inversionMobileSharePct",
    value: 48,
    unit: "percent of a typical winter inversion's PM2.5 from mobile sources (vehicles, trains and aircraft)",
    source: "Utah Division of Air Quality, Understanding Utah's Air Quality",
    url: "https://deq.utah.gov/daq/understanding-utahs-air-quality",
    year: 2019,
  },
  {
    key: "air.gasolineLbsCo2ePerGal",
    value: 23.7,
    unit: "lbs CO2e per gallon of gasoline, well to wheels",
    source: "US DOE Alternative Fuels Data Center (Argonne GREET)",
    url: "https://afdc.energy.gov/vehicles/electric-emissions-sources",
    year: 2019,
  },
  {
    key: "air.gasCarMpg",
    value: 21.79,
    unit: "miles per gallon, average gasoline car",
    source: "US DOE Alternative Fuels Data Center",
    url: "https://afdc.energy.gov/vehicles/electric-emissions-sources",
    year: 2019,
  },
  {
    key: "air.hybridMpg",
    value: 39.78,
    unit: "miles per gallon, average hybrid",
    source: "US DOE Alternative Fuels Data Center",
    url: "https://afdc.energy.gov/vehicles/electric-emissions-sources",
    year: 2019,
  },
  {
    key: "air.pluginMpg",
    value: 40.8,
    unit: "miles per gallon, average plug-in hybrid on gasoline",
    source: "US DOE Alternative Fuels Data Center",
    url: "https://afdc.energy.gov/vehicles/electric-emissions-sources",
    year: 2019,
  },
  {
    key: "air.pluginMiPerKwh",
    value: 3.03,
    unit: "miles per kWh, average plug-in hybrid on electricity",
    source: "US DOE Alternative Fuels Data Center",
    url: "https://afdc.energy.gov/vehicles/electric-emissions-sources",
    year: 2019,
  },
  {
    key: "air.pluginElectricPct",
    value: 56.3,
    unit: "percent of plug-in hybrid miles driven on electricity",
    source: "US DOE Alternative Fuels Data Center (SAE J2841)",
    url: "https://afdc.energy.gov/vehicles/electric-emissions-sources",
    year: 2010,
  },
  {
    key: "air.evMiPerKwh",
    value: 3.6,
    unit: "miles per kWh, average all-electric car",
    source: "US DOE Alternative Fuels Data Center",
    url: "https://afdc.energy.gov/vehicles/electric-emissions-sources",
    year: 2019,
  },
  {
    key: "air.utahGridLbsCo2PerMwh",
    value: 1322,
    unit: "lbs CO2 per MWh from Utah power plants",
    source: "US EIA, Utah Electricity Profile 2024",
    url: "https://www.eia.gov/electricity/state/utah/",
    year: 2024,
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
