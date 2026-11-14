// Shared types. Owned by Craig. Ask in #ship before changing.
export type Answers = {
  zip: string;
  household: number; // people in the home
  yardSqFt: number; // watered lawn, square feet
  commuteMiles: number; // one-way miles driven on a normal weekday
  heating: "gas" | "electric" | "heat-pump";
  monthlyKwh?: number; // from a power bill, if known
};

// A sourced number. Every figure on screen must come from one of these.
export type Fact = {
  key: string; // e.g. "water.lawnGallonsPerSqFt"
  value: number;
  unit: string;
  source: string; // agency or program name
  url: string; // the page you opened and read
  year: number;
};

export type Action = {
  id: string;
  title: string; // says what to do: "Replace the park strip lawn"
  saves: number;
  unit: string; // "gallons per year", "kWh per year", "lbs CO2 per year"
  costNote: string; // "Free", "About $200, rebate available"
  program?: { name: string; url: string };
};

export type AreaResult = {
  headline: number;
  unit: string;
  typical: number; // a typical Utah home, same unit
  summary: string; // one plain sentence
  actions: Action[];
  assumptions: string[]; // what we guessed and why
};

export type AreaId = "water" | "energy" | "air";

// Page language. Areas may translate their text when lang is "es"; English is the default.
export type Lang = "en" | "es";

export type Area = {
  id: AreaId;
  label: string;
  facts: Fact[];
  calculate(a: Answers, lang?: Lang): AreaResult;
};
