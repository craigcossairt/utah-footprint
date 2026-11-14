import type { Fact } from "@/lib/contract";

// Sourced numbers for the energy area. No source, no number.
// Each value was checked against the linked page on 14 Nov 2026.
export const facts: Fact[] = [
  {
    key: "energy.utahMonthlyKwh",
    value: 774,
    unit: "kWh a month, average Utah home",
    source: "EIA, average monthly residential consumption by state (Table 5a)",
    url: "https://www.eia.gov/electricity/sales_revenue_price/pdf/table_5a.pdf",
    year: 2024,
  },
  {
    key: "energy.utahLbsCo2PerMwh",
    value: 1322,
    unit: "lbs CO2 per MWh, Utah power plants",
    source: "EIA, Utah electricity profile",
    url: "https://www.eia.gov/electricity/state/utah/",
    year: 2024,
  },
  {
    key: "energy.utahResidentialGasMMcf",
    value: 74108,
    unit: "million cubic feet of gas used by Utah homes",
    source: "EIA, Natural Gas Annual (Table 15)",
    url: "https://www.eia.gov/naturalgas/Annual/pdf/table_015.pdf",
    year: 2024,
  },
  {
    key: "energy.utahResidentialGasCustomers",
    value: 1102955,
    unit: "Utah homes with gas service",
    source: "EIA, Natural Gas Annual (Table S46)",
    url: "https://www.eia.gov/naturalgas/Annual/pdf/table_S46.pdf",
    year: 2024,
  },
  {
    key: "energy.gasKgCo2PerMcf",
    value: 54.8, // EPA states 0.0548 metric tons
    unit: "kg CO2 per thousand cubic feet of gas burned",
    source: "EPA, Greenhouse Gas Equivalencies Calculator references",
    url: "https://www.epa.gov/energy/greenhouse-gases-equivalencies-calculator-calculations-and-references",
    year: 2024,
  },
  {
    key: "energy.smartThermostatSavingsPct",
    value: 8,
    unit: "% of heating and cooling bills saved by a smart thermostat",
    source: "ENERGY STAR, smart thermostat FAQ",
    url: "https://www.energystar.gov/products/heating_cooling/smart_thermostats/smart_thermostat_faq",
    year: 2024,
  },
  {
    key: "energy.sealInsulateSavingsPct",
    value: 11,
    unit: "% of total home energy saved by air sealing and insulation",
    source: "ENERGY STAR, seal and insulate savings method",
    url: "https://www.energystar.gov/saveathome/seal_insulate/methodology",
    year: 2024,
  },
  {
    key: "energy.thermwiseThermostatRebate",
    value: 75,
    unit: "dollars, top ThermWise smart thermostat rebate",
    source: "Enbridge Gas Utah, ThermWise appliance rebates",
    url: "https://www.enbridgegas.com/utwyid/save-money/thermwise/appliance-rebates",
    year: 2026,
  },
  {
    key: "energy.thermwiseAtticRebatePerSqFt",
    value: 0.32,
    unit: "dollars per square foot, ThermWise attic insulation rebate",
    source: "Enbridge Gas Utah, ThermWise weatherization rebates",
    url: "https://www.enbridgegas.com/utwyid/save-money/thermwise/weatherization-rebates",
    year: 2026,
  },
];

export function fact(key: string): number {
  const f = facts.find((x) => x.key === key);
  if (!f) throw new Error(`Missing energy fact ${key}`);
  return f.value;
}
