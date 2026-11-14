import type { Action, Answers, Area, AreaResult, Fact } from "./contract";
import { areas } from "./areas";

export type Computed = { area: Area; result: AreaResult; ready: boolean };

const notReady = (label: string): AreaResult => ({
  headline: 0,
  unit: "",
  typical: 0,
  summary: `The ${label.toLowerCase()} numbers aren't ready yet.`,
  actions: [],
  assumptions: [],
});

// Runs every area's formula. An area that throws or isn't built yet shows as "not ready".
export function computeAll(answers: Answers): Computed[] {
  return areas.map(({ area }) => {
    try {
      const result = area.calculate(answers);
      return { area, result, ready: result.unit !== "" };
    } catch {
      return { area, result: notReady(area.label), ready: false };
    }
  });
}

export type RankedAction = Action & {
  areaId: Area["id"];
  areaLabel: string;
  areaUnit: string;
  share: number; // percent of this home's number in that area that the action would cut
};

// Actions from all areas in one list. Units differ (gallons, kWh, lbs CO2), so we rank by the share
// of the home's own number in that area that each action would cut.
export function rankActions(computed: Computed[]): RankedAction[] {
  return computed
    .filter((c) => c.ready && c.result.headline > 0)
    .flatMap((c) =>
      c.result.actions.map((a) => ({
        ...a,
        areaId: c.area.id,
        areaLabel: c.area.label,
        areaUnit: c.result.unit,
        share: Math.round((a.saves / c.result.headline) * 100),
      })),
    )
    .filter((a) => a.share > 0)
    .sort((x, y) => y.share - x.share);
}

export function allFacts(): Fact[] {
  return areas.flatMap(({ area }) => area.facts);
}
