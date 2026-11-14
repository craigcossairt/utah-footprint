import type { Fact } from "@/lib/contract";

const DWR_2009 = "https://water.utah.gov/wp-content/uploads/2019/08/2009-Residential-Water-Use.pdf";
const SLC_2025 = "https://www.slc.gov/utilities/wp-content/uploads/sites/22/2026/03/SLCDPU_Water_Conservation_Plan_2025.pdf";
const EPA_LEAKS = "https://www.epa.gov/watersense/fix-leak-week";
const USU_RAIN = "https://extension.usu.edu/sustainability/research/rain-barrels-in-utah";
const USU_2025 =
  "https://extension.usu.edu/climate/research/reducing-residential-landscape-water-use-in-utah-technologies-and-strategies";

// Sourced numbers for the water area. No source, no number.
export const facts: Fact[] = [
  {
    key: "water.indoorGpcd",
    value: 54,
    unit: "gallons per person per day indoors, Salt Lake City residents",
    source: "Salt Lake City Public Utilities, Water Conservation Plan 2025",
    url: SLC_2025,
    year: 2024,
  },
  {
    key: "water.lawnInches",
    value: 24.1,
    unit: "inches of water applied to outdoor landscapes per year, Salt Lake City average",
    source: "Salt Lake City Public Utilities, Water Conservation Plan 2025",
    url: SLC_2025,
    year: 2024,
  },
  {
    key: "water.indoorGpcd2009",
    value: 60,
    unit: "gallons per person per day indoors, statewide estimate",
    source: "Utah Division of Water Resources, Residential Water Use study",
    url: DWR_2009,
    year: 2009,
  },
  {
    key: "water.outdoorGpcd",
    value: 134,
    unit: "gallons per person per day outdoors, averaged over the year",
    source: "Utah Division of Water Resources, Residential Water Use study",
    url: DWR_2009,
    year: 2009,
  },
  {
    key: "water.smartControllerSaves",
    value: 15000,
    unit: "gallons a year a smart irrigation controller can save a home (up to)",
    source: "USU Extension, citing US EPA WaterSense",
    url: USU_2025,
    year: 2025,
  },
  {
    key: "water.smartControllerRebate",
    value: 100,
    unit: "dollars, Utah Water Savers smart controller rebate",
    source: "Utah Division of Water Resources",
    url: "https://water.utah.gov/utahwatersavers-com-increases-rebates-for-toilets-and-smart-irrigation-controllers-to-boost-water-conservation-efforts",
    year: 2024,
  },
  {
    key: "water.lawnRebatePerSqFt",
    value: 3,
    unit: "dollars per square foot of lawn replaced, Jordan Valley service area (up to)",
    source: "Jordan Valley Water Conservancy District",
    url: "https://jvwcd.gov/public/conservation",
    year: 2026,
  },
  {
    key: "water.householdLeaksGallons",
    value: 9300,
    unit: "gallons a year the average household's leaks waste",
    source: "US EPA WaterSense, Fix a Leak Week",
    url: EPA_LEAKS,
    year: 2026,
  },
  {
    key: "water.rainParcelCapGallons",
    value: 2500,
    unit: "gallons, most rainwater a Utah parcel may store",
    source: "USU Extension, Rain Barrels in Utah (Utah SB 32, 2010; HB 36, 2013)",
    url: USU_RAIN,
    year: 2013,
  },
  {
    key: "water.rainRegisterOverGallons",
    value: 100,
    unit: "gallons, container size above which a rain system must be registered (also if more than two containers)",
    source: "USU Extension, Rain Barrels in Utah",
    url: USU_RAIN,
    year: 2013,
  },
];

export const links = {
  epaLeaks: EPA_LEAKS,
  rainRegister: "https://waterrights.utah.gov/forms/rainwater.asp",
  usuRain: USU_RAIN,
  usuGraywater: "https://extension.usu.edu/sustainability/research/graywater-systems",
  slcWaterCheck: "https://www.slc.gov/utilities/conservation/free-water-check/",
};

export function fact(key: string): number {
  const f = facts.find((x) => x.key === key);
  if (!f) throw new Error(`missing fact ${key}`);
  return f.value;
}
