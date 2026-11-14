import type { Action, Answers, AreaResult } from "@/lib/contract";
import { fact } from "./facts";

const LBS_PER_KG = 2.20462; // unit conversion, not a statistic

const round = (n: number, to = 100) => Math.round(n / to) * to;

type Breakdown = { electricLbs: number; gasLbs: number; kwhYear: number; gasMcfYear: number };

function breakdown(monthlyKwh: number, gasHeat: boolean): Breakdown {
  const kwhYear = monthlyKwh * 12;
  const electricLbs = (kwhYear * fact("energy.utahLbsCo2PerMwh")) / 1000;
  // Average Utah home on gas: total home gas (million cubic feet) / homes with gas, in thousand cubic feet.
  const gasMcfYear = gasHeat
    ? (fact("energy.utahResidentialGasMMcf") * 1000) / fact("energy.utahResidentialGasCustomers")
    : 0;
  const gasLbs = gasMcfYear * fact("energy.gasKgCo2PerMcf") * LBS_PER_KG;
  return { electricLbs, gasLbs, kwhYear, gasMcfYear };
}

export function typicalUtahHome(): number {
  const b = breakdown(fact("energy.utahMonthlyKwh"), true);
  return round(b.electricLbs + b.gasLbs);
}

export function calculate(a: Answers): AreaResult {
  const gasHeat = a.heating === "gas";
  const hasBill = typeof a.monthlyKwh === "number" && a.monthlyKwh > 0;
  const monthlyKwh = hasBill ? (a.monthlyKwh as number) : fact("energy.utahMonthlyKwh");
  const b = breakdown(monthlyKwh, gasHeat);
  const total = b.electricLbs + b.gasLbs;

  // Heating and cooling load the thermostat acts on: home gas for gas homes, the power bill otherwise.
  const heatingLbs = gasHeat ? b.gasLbs : b.electricLbs;
  const thermostatPct = fact("energy.smartThermostatSavingsPct") / 100;
  const sealPct = fact("energy.sealInsulateSavingsPct") / 100;

  const actions: Action[] = [
    {
      id: "seal-insulate",
      title: "Seal air leaks and add attic insulation",
      saves: round(total * sealPct),
      unit: "lbs CO2 per year",
      costNote: gasHeat
        ? `Rebate of $${fact("energy.thermwiseAtticRebatePerSqFt").toFixed(2)} a square foot of attic.`
        : "Biggest savings in older homes.",
      program: gasHeat
        ? {
            name: "ThermWise weatherization rebates",
            url: "https://www.enbridgegas.com/utwyid/save-money/thermwise/weatherization-rebates",
          }
        : undefined,
    },
    {
      id: "smart-thermostat",
      title: "Install a smart thermostat that turns the heat down when you're away",
      saves: round(heatingLbs * thermostatPct),
      unit: "lbs CO2 per year",
      costNote: gasHeat
        ? `Rebate up to $${fact("energy.thermwiseThermostatRebate")}.`
        : "Rocky Mountain Power offers a rebate.",
      program: gasHeat
        ? {
            name: "ThermWise smart thermostat rebate",
            url: "https://www.enbridgegas.com/utwyid/save-money/thermwise/appliance-rebates",
          }
        : {
            name: "Wattsmart heating and cooling rebates",
            url: "https://wattsmarthomes.com/rebate-categories/heating-and-cooling/",
          },
    },
  ].sort((x, y) => y.saves - x.saves);

  const electricShare = Math.round((b.electricLbs / total) * 100);
  const summary = gasHeat
    ? `About ${electricShare}% comes from your power bill and the rest from burning gas for heat.`
    : "All of it comes from your power bill, because your heat runs on electricity.";

  const assumptions = [
    hasBill
      ? `We used the ${monthlyKwh.toLocaleString("en-US")} kWh a month from your power bill.`
      : `You didn't enter a power bill, so we used the Utah average of ${fact("energy.utahMonthlyKwh")} kWh a month.`,
    `Power is counted at Utah's 2024 grid rate of ${fact("energy.utahLbsCo2PerMwh").toLocaleString("en-US")} lbs CO2 per MWh.`,
    gasHeat
      ? `Gas use is the Utah home average, about ${Math.round(b.gasMcfYear)} thousand cubic feet a year. We count all of it as heating, so the thermostat savings may be a little high.`
      : "We assume your heating is already in your power bill, and that you don't burn gas at home.",
    "The number of people at home doesn't change this estimate yet. We haven't found a sourced Utah figure for use per person.",
    "Savings use ENERGY STAR national averages, not Utah-specific studies.",
  ];
  if (!gasHeat) {
    assumptions.push("The thermostat savings treat your whole power bill as heating and cooling, so they are an upper bound.");
  }

  return {
    headline: round(total),
    unit: "lbs CO2 a year",
    typical: typicalUtahHome(),
    summary,
    actions,
    assumptions,
  };
}
