import type { Action, Answers, AreaResult, Lang } from "@/lib/contract";
import { fact } from "./facts";

const LBS_PER_KG = 2.20462; // unit conversion, not a statistic

const round = (n: number, to = 100) => Math.round(n / to) * to;
const n = (v: number) => v.toLocaleString("en-US");

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

// All words the energy card shows. Numbers and links stay the same in both languages.
const T = {
  en: {
    unit: "lbs CO2 a year",
    actionUnit: "lbs CO2 per year",
    sealTitle: "Seal air leaks and add attic insulation",
    sealGasCost: (r: string) => `Rebate of $${r} a square foot of attic.`,
    sealElecCost: "Biggest savings in older homes.",
    sealProgram: "ThermWise weatherization rebates",
    thermoTitle: "Install a smart thermostat that turns the heat down when you're away",
    thermoGasCost: (r: number) => `Rebate up to $${r}.`,
    thermoElecCost: "Rocky Mountain Power offers a rebate.",
    thermoGasProgram: "ThermWise smart thermostat rebate",
    thermoElecProgram: "Wattsmart heating and cooling rebates",
    summaryGas: (pct: number) => `About ${pct}% comes from your power bill and the rest from burning gas for heat.`,
    summaryElec: "All of it comes from your power bill, because your heat runs on electricity.",
    bill: (kwh: number) => `We used the ${n(kwh)} kWh a month from your power bill.`,
    noBill: (kwh: number) => `You didn't enter a power bill, so we used the Utah average of ${n(kwh)} kWh a month.`,
    grid: (r: number) => `Power is counted at Utah's 2024 grid rate of ${n(r)} lbs CO2 per MWh.`,
    gas: (mcf: number) =>
      `Gas use is the Utah home average, about ${mcf} thousand cubic feet a year. We count all of it as heating, so the thermostat savings may be a little high.`,
    noGas: "We assume your heating is already in your power bill, and that you don't burn gas at home.",
    people:
      "The number of people at home doesn't change this estimate yet. We haven't found a sourced Utah figure for use per person.",
    national: "Savings use ENERGY STAR national averages, not Utah-specific studies.",
    upperBound:
      "The thermostat savings treat your whole power bill as heating and cooling, so they are an upper bound.",
    dollars: (d: number) => `About $${n(d)} a year.`,
    prices: (cents: number, gas: number) =>
      `Dollar savings use EIA's 2024 Utah home prices: ${cents} cents per kWh and $${gas} per thousand cubic feet of gas. Your rate and tier may differ.`,
  },
  es: {
    unit: "libras de CO2 al año",
    actionUnit: "libras de CO2 al año",
    sealTitle: "Selle las fugas de aire y ponga más aislamiento en el ático",
    sealGasCost: (r: string) => `Reembolso de $${r} por pie cuadrado de ático.`,
    sealElecCost: "Se ahorra más en casas antiguas.",
    sealProgram: "Reembolsos ThermWise para aislamiento (en inglés)",
    thermoTitle: "Instale un termostato inteligente que baje la calefacción cuando no hay nadie en casa",
    thermoGasCost: (r: number) => `Reembolso de hasta $${r}.`,
    thermoElecCost: "Rocky Mountain Power ofrece un reembolso.",
    thermoGasProgram: "Reembolso ThermWise para termostatos inteligentes (en inglés)",
    thermoElecProgram: "Reembolsos Wattsmart para calefacción y aire acondicionado (en inglés)",
    summaryGas: (pct: number) =>
      `Cerca del ${pct}% viene de su factura de luz y el resto de quemar gas para calentar la casa.`,
    summaryElec: "Todo viene de su factura de luz, porque su calefacción funciona con electricidad.",
    bill: (kwh: number) => `Usamos los ${n(kwh)} kWh al mes de su factura de luz.`,
    noBill: (kwh: number) => `No puso su factura de luz, así que usamos el promedio de Utah de ${n(kwh)} kWh al mes.`,
    grid: (r: number) => `La electricidad se cuenta con la tasa de la red de Utah en 2024: ${n(r)} libras de CO2 por MWh.`,
    gas: (mcf: number) =>
      `El uso de gas es el promedio de los hogares de Utah, unos ${mcf} mil pies cúbicos al año. Lo contamos todo como calefacción, así que el ahorro del termostato puede ser un poco alto.`,
    noGas: "Suponemos que su calefacción ya está en su factura de luz y que no quema gas en casa.",
    people:
      "El número de personas en casa todavía no cambia este cálculo. No hemos encontrado una cifra de Utah con fuente para el uso por persona.",
    national: "El ahorro usa promedios nacionales de ENERGY STAR, no estudios de Utah.",
    upperBound:
      "El ahorro del termostato trata toda su factura de luz como calefacción y aire acondicionado, así que es un máximo.",
    dollars: (d: number) => `Unos $${n(d)} al año.`,
    prices: (cents: number, gas: number) =>
      `El ahorro en dólares usa los precios de 2024 de la EIA para hogares de Utah: ${cents} centavos por kWh y $${gas} por mil pies cúbicos de gas. Su tarifa puede ser distinta.`,
  },
};

export function calculate(a: Answers, lang: Lang = "en"): AreaResult {
  const t = T[lang] ?? T.en;
  const gasHeat = a.heating === "gas";
  const hasBill = typeof a.monthlyKwh === "number" && a.monthlyKwh > 0;
  const monthlyKwh = hasBill ? (a.monthlyKwh as number) : fact("energy.utahMonthlyKwh");
  const b = breakdown(monthlyKwh, gasHeat);
  const total = b.electricLbs + b.gasLbs;

  // Heating and cooling load the thermostat acts on: home gas for gas homes, the power bill otherwise.
  const heatingLbs = gasHeat ? b.gasLbs : b.electricLbs;
  const thermostatPct = fact("energy.smartThermostatSavingsPct") / 100;
  const sealPct = fact("energy.sealInsulateSavingsPct") / 100;

  // Yearly bills at Utah average prices; savings apply the same percentages as the CO2 savings.
  const electricDollars = (b.kwhYear * fact("energy.utahCentsPerKwh")) / 100;
  const gasDollars = b.gasMcfYear * fact("energy.utahGasDollarsPerMcf");
  const sealDollars = round((electricDollars + gasDollars) * sealPct, 10);
  const thermoDollars = round((gasHeat ? gasDollars : electricDollars) * thermostatPct, 10);

  const actions: Action[] = [
    {
      id: "seal-insulate",
      title: t.sealTitle,
      saves: round(total * sealPct),
      unit: t.actionUnit,
      costNote: `${t.dollars(sealDollars)} ${
        gasHeat ? t.sealGasCost(fact("energy.thermwiseAtticRebatePerSqFt").toFixed(2)) : t.sealElecCost
      }`,
      program: gasHeat
        ? {
            name: t.sealProgram,
            url: "https://www.enbridgegas.com/utwyid/save-money/thermwise/weatherization-rebates",
          }
        : undefined,
    },
    {
      id: "smart-thermostat",
      title: t.thermoTitle,
      saves: round(heatingLbs * thermostatPct),
      unit: t.actionUnit,
      costNote: `${t.dollars(thermoDollars)} ${
        gasHeat ? t.thermoGasCost(fact("energy.thermwiseThermostatRebate")) : t.thermoElecCost
      }`,
      program: gasHeat
        ? {
            name: t.thermoGasProgram,
            url: "https://www.enbridgegas.com/utwyid/save-money/thermwise/appliance-rebates",
          }
        : {
            name: t.thermoElecProgram,
            url: "https://wattsmarthomes.com/rebate-categories/heating-and-cooling/",
          },
    },
  ];
  actions.sort((x, y) => y.saves - x.saves);

  const summary = gasHeat ? t.summaryGas(Math.round((b.electricLbs / total) * 100)) : t.summaryElec;

  const assumptions = [
    hasBill ? t.bill(monthlyKwh) : t.noBill(fact("energy.utahMonthlyKwh")),
    t.grid(fact("energy.utahLbsCo2PerMwh")),
    gasHeat ? t.gas(Math.round(b.gasMcfYear)) : t.noGas,
    t.people,
    t.national,
    t.prices(fact("energy.utahCentsPerKwh"), fact("energy.utahGasDollarsPerMcf")),
  ];
  if (!gasHeat) assumptions.push(t.upperBound);

  return {
    headline: round(total),
    unit: t.unit,
    typical: typicalUtahHome(),
    summary,
    actions,
    assumptions,
  };
}
