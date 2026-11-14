import type { Action, Answers, AreaResult } from "@/lib/contract";
import { fact } from "./facts";

// One inch of water over one square foot is 144 cubic inches; a US gallon is 231 cubic inches.
const GALLONS_PER_SQFT_INCH = 144 / 231;
const SWAP_SQFT = 500; // the lawn area the "replace lawn" action assumes

const round = (n: number, to = 100) => Math.round(n / to) * to;

export function lawnGallons(sqFt: number): number {
  const inches = (fact("water.lawnInchesLow") + fact("water.lawnInchesHigh")) / 2;
  return sqFt * inches * GALLONS_PER_SQFT_INCH;
}

export function calculate(a: Answers): AreaResult {
  const people = Math.max(1, a.household);
  const yard = Math.max(0, a.yardSqFt);

  const indoor = people * fact("water.indoorGpcd") * 365;
  const outdoor = lawnGallons(yard);
  const total = indoor + outdoor;
  const typical = people * (fact("water.indoorGpcd") + fact("water.outdoorGpcd")) * 365;
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
      `Indoor use is ${fact("water.indoorGpcd")} gallons per person per day, the state's 2009 estimate. Newer fixtures use less.`,
      `The lawn is Kentucky bluegrass and gets ${(fact("water.lawnInchesLow") + fact("water.lawnInchesHigh")) / 2} inches of water a season, the middle of USU's ${fact("water.lawnInchesLow")} to ${fact("water.lawnInchesHigh")} inch range.`,
      `The typical Utah home has as many people as yours and uses the state's average ${fact("water.outdoorGpcd")} gallons per person per day outdoors (2009). That is metered use, which includes overwatering and bigger yards; your yard figure is what the lawn needs, so the gap may be smaller in practice.`,
      "Savings are upper bounds. Drip-watered plants still need some water, and a smart controller saves less on a well-set timer.",
      "Rebate amounts vary by water district. Check before you start; most require approval before you remove any lawn.",
    ],
  };
}
