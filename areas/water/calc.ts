import type { Action, Answers, AreaResult } from "@/lib/contract";
import { fact, links } from "./facts";

// One inch of water over one square foot is 144 cubic inches; a US gallon is 231 cubic inches.
const GALLONS_PER_SQFT_INCH = 144 / 231;
const SWAP_SQFT = 500; // the lawn area the "replace lawn" action assumes

const round = (n: number, to = 100) => Math.round(n / to) * to;

export function lawnGallons(sqFt: number): number {
  return sqFt * fact("water.lawnInches") * GALLONS_PER_SQFT_INCH;
}

export function calculate(a: Answers): AreaResult {
  const people = Math.max(1, a.household);
  const yard = Math.max(0, a.yardSqFt);

  const indoor = people * fact("water.indoorGpcd") * 365;
  const outdoor = lawnGallons(yard);
  const total = indoor + outdoor;
  const typical = people * (fact("water.indoorGpcd2009") + fact("water.outdoorGpcd")) * 365;
  const yardShare = total > 0 ? Math.round((outdoor / total) * 100) : 0;

  const actions: Action[] = [];
  if (yard > 0) {
    const swap = Math.min(SWAP_SQFT, yard);
    actions.push({
      id: "water.replaceLawn",
      title: `Replace ${swap.toLocaleString("en-US")} square feet of lawn with water-wise plants on drip`,
      saves: round(lawnGallons(swap)),
      unit: "gallons per year, at most",
      costNote: `Rebate up to $${fact("water.lawnRebatePerSqFt")} a square foot in Jordan Valley's area.`,
      program: { name: "Jordan Valley Water lawn replacement", url: "https://jvwcd.gov/public/conservation" },
    });
    actions.push({
      id: "water.smartController",
      title: "Put the sprinklers on a WaterSense smart controller",
      saves: round(Math.min(fact("water.smartControllerSaves"), outdoor)),
      unit: "gallons per year, at most",
      costNote: `Utah Water Savers rebate up to $${fact("water.smartControllerRebate")}.`,
      program: {
        name: "Utah Water Savers rebates",
        url: "https://water.utah.gov/utahwatersavers-com-increases-rebates-for-toilets-and-smart-irrigation-controllers-to-boost-water-conservation-efforts",
      },
    });
  }
  actions.push({
    id: "water.fixLeaks",
    title: "Find and fix leaks: put food coloring in each toilet tank and look for drips",
    saves: fact("water.householdLeaksGallons"),
    unit: "gallons per year, the average home's leaks",
    costNote: "Free to check. A worn toilet flapper is a quick, cheap fix.",
    program: { name: "EPA WaterSense: how to check for leaks", url: links.epaLeaks },
  });
  actions.sort((x, y) => y.saves - x.saves);

  return {
    headline: round(total, 1000),
    unit: "gallons a year",
    typical: round(typical, 1000),
    summary:
      yard > 0
        ? `About ${yardShare}% of it goes on the yard. The yard is the part of Utah's water use that households control most.`
        : "With no watered lawn, all of this is indoor use.",
    actions,
    assumptions: [
      `Indoor use is ${fact("water.indoorGpcd")} gallons per person per day, Salt Lake City's 2024 figure for its residents.`,
      `The lawn gets ${fact("water.lawnInches")} inches of water a year, what Salt Lake City customers applied on average in 2024.`,
      `The typical Utah home has as many people as yours and uses the state's 2009 averages: ${fact("water.indoorGpcd2009")} gallons per person per day indoors and ${fact("water.outdoorGpcd")} outdoors. That is the newest statewide indoor and outdoor split we found, and it counts bigger yards in other towns.`,
      "Savings are upper bounds. Drip-watered plants still need some water, and a smart controller saves less on a well-set timer.",
      "Leak savings are the national average from EPA. Your home may have no leaks, or far bigger ones.",
      "Rebate amounts vary by water district. Check before you start; most require approval before you remove any lawn.",
    ],
  };
}
