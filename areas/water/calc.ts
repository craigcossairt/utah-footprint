import type { Action, Answers, AreaResult, Lang } from "@/lib/contract";
import { fact, links } from "./facts";

// One inch of water over one square foot is 144 cubic inches; a US gallon is 231 cubic inches.
const GALLONS_PER_SQFT_INCH = 144 / 231;
const SWAP_SQFT = 500; // the lawn area the "replace lawn" action assumes

const round = (n: number, to = 100) => Math.round(n / to) * to;
const n = (v: number) => v.toLocaleString("en-US");
const GALLONS_PER_CCF = 748; // 100 cubic feet of water, the unit on a water bill

// What one more gallon costs on Salt Lake City's 2026 residential bill, between 8 and 21 ccf a month.
export function dollarsPerGallon(): number {
  const extra = fact("water.slcBill21Ccf") - fact("water.slcBill8Ccf");
  return extra / (21 - 8) / GALLONS_PER_CCF;
}
const dollars = (gallons: number) => Math.max(1, Math.round(gallons * dollarsPerGallon()));

export function lawnGallons(sqFt: number): number {
  return sqFt * fact("water.lawnInches") * GALLONS_PER_SQFT_INCH;
}

// All words the water card shows. Numbers and links stay the same in both languages.
const T = {
  en: {
    unit: "gallons a year",
    unitMax: "gallons per year, at most",
    unitLeaks: "gallons per year, the average home's leaks",
    summaryYard: (pct: number) =>
      `About ${pct}% of it goes on the yard. The yard is the part of Utah's water use that households control most.`,
    summaryNoYard: "With no watered lawn, all of this is indoor use.",
    swapTitle: (sq: number) => `Replace ${n(sq)} square feet of lawn with water-wise plants on drip`,
    swapCost: (d: number) => `Rebate up to $${d} a square foot in Jordan Valley's area.`,
    swapProgram: "Jordan Valley Water lawn replacement",
    ctrlTitle: "Put the sprinklers on a WaterSense smart controller",
    ctrlCost: (d: number) => `Utah Water Savers rebate up to $${d}.`,
    ctrlProgram: "Utah Water Savers rebates",
    leakTitle: "Find and fix leaks: put food coloring in each toilet tank and look for drips",
    leakCost: "Free to check. A worn toilet flapper is a quick, cheap fix.",
    leakProgram: "EPA WaterSense: how to check for leaks",
    money: (d: number) => ` About $${d} a year off a Salt Lake City water bill.`,
    rate: (c: string) =>
      `Dollar savings use Salt Lake City's 2026 residential water rate: each extra 100 cubic feet (748 gallons) adds about $${c} to the bill, between a low and a medium monthly use. Rates differ by city and by how much you use; Salt Lake County customers pay more.`,
    assumptions: () => [
      `Indoor use is ${fact("water.indoorGpcd")} gallons per person per day, Salt Lake City's 2024 figure for its residents.`,
      `The lawn gets ${fact("water.lawnInches")} inches of water a year, what Salt Lake City customers applied on average in 2024.`,
      `The typical home has as many people as yours and uses about ${fact("water.residentialGpcd")} gallons per person per day, Salt Lake City's 2024 average for residential customers. It covers all residential customers, many with little or no lawn, so homes with bigger yards will often be above it.`,
      "Savings are upper bounds. Drip-watered plants still need some water, and a smart controller saves less on a well-set timer.",
      "Leak savings are the national average from EPA. Your home may have no leaks, or far bigger ones.",
      "Rebate amounts vary by water district. Check before you start; most require approval before you remove any lawn.",
    ],
  },
  es: {
    unit: "galones al año",
    unitMax: "galones al año, como máximo",
    unitLeaks: "galones al año, las fugas de un hogar promedio",
    summaryYard: (pct: number) =>
      `Cerca del ${pct}% se usa en el jardín. El jardín es la parte del agua de Utah que más controlan los hogares.`,
    summaryNoYard: "Sin césped regado, toda esta agua se usa dentro de la casa.",
    swapTitle: (sq: number) => `Cambie ${n(sq)} pies cuadrados de césped por plantas de poca agua con riego por goteo`,
    swapCost: (d: number) => `Reembolso de hasta $${d} por pie cuadrado en el área de Jordan Valley.`,
    swapProgram: "Jordan Valley Water: reemplazo de césped",
    ctrlTitle: "Ponga los aspersores en un controlador inteligente WaterSense",
    ctrlCost: (d: number) => `Reembolso de Utah Water Savers de hasta $${d}.`,
    ctrlProgram: "Reembolsos de Utah Water Savers",
    leakTitle: "Busque y arregle fugas: ponga colorante de comida en el tanque de cada inodoro y revise los goteos",
    leakCost: "Revisar es gratis. Cambiar la válvula (flapper) gastada del inodoro es rápido y barato.",
    leakProgram: "EPA WaterSense: cómo buscar fugas (en inglés)",
    money: (d: number) => ` Unos $${d} al año menos en una factura de agua de Salt Lake City.`,
    rate: (c: string) =>
      `El ahorro en dólares usa la tarifa residencial de agua de Salt Lake City para 2026: cada 100 pies cúbicos extra (748 galones) suman unos $${c} a la factura, entre un uso mensual bajo y uno mediano. Las tarifas cambian según la ciudad y cuánto usa; los clientes del condado de Salt Lake pagan más.`,
    assumptions: () => [
      `El uso dentro de la casa es de ${fact("water.indoorGpcd")} galones por persona al día, la cifra de 2024 de Salt Lake City para sus residentes.`,
      `El césped recibe ${fact("water.lawnInches")} pulgadas de agua al año, lo que aplicaron en promedio los clientes de Salt Lake City en 2024.`,
      `El hogar típico tiene tantas personas como el suyo y usa unos ${fact("water.residentialGpcd")} galones por persona al día, el promedio de 2024 de Salt Lake City para clientes residenciales. Incluye a todos los clientes residenciales, muchos con poco o nada de césped, así que los hogares con jardines más grandes a menudo usan más.`,
      "Los ahorros son el máximo posible. Las plantas con goteo aún necesitan algo de agua, y un controlador inteligente ahorra menos si su temporizador ya está bien ajustado.",
      "El ahorro por fugas es el promedio nacional de la EPA. Su casa puede no tener fugas, o tenerlas mucho más grandes.",
      "Los reembolsos cambian según el distrito de agua. Consulte antes de empezar; la mayoría exige aprobación antes de quitar el césped.",
    ],
  },
};

export function calculate(a: Answers, lang: Lang = "en"): AreaResult {
  const t = T[lang] ?? T.en;
  const people = Math.max(1, a.household);
  const yard = Math.max(0, a.yardSqFt);

  const indoor = people * fact("water.indoorGpcd") * 365;
  const outdoor = lawnGallons(yard);
  const total = indoor + outdoor;
  const typical = people * fact("water.residentialGpcd") * 365;
  const yardShare = total > 0 ? Math.round((outdoor / total) * 100) : 0;

  const actions: Action[] = [];
  if (yard > 0) {
    const swap = Math.min(SWAP_SQFT, yard);
    actions.push({
      id: "water.replaceLawn",
      title: t.swapTitle(swap),
      saves: round(lawnGallons(swap)),
      unit: t.unitMax,
      costNote: t.swapCost(fact("water.lawnRebatePerSqFt")),
      program: { name: t.swapProgram, url: "https://jvwcd.gov/public/conservation" },
    });
    actions.push({
      id: "water.smartController",
      title: t.ctrlTitle,
      saves: round(Math.min(fact("water.smartControllerSaves"), outdoor)),
      unit: t.unitMax,
      costNote: t.ctrlCost(fact("water.smartControllerRebate")),
      program: {
        name: t.ctrlProgram,
        url: "https://water.utah.gov/utahwatersavers-com-increases-rebates-for-toilets-and-smart-irrigation-controllers-to-boost-water-conservation-efforts",
      },
    });
  }
  actions.push({
    id: "water.fixLeaks",
    title: t.leakTitle,
    saves: fact("water.householdLeaksGallons"),
    unit: t.unitLeaks,
    costNote: t.leakCost,
    program: { name: t.leakProgram, url: links.epaLeaks },
  });
  for (const act of actions) act.costNote += t.money(dollars(act.saves));
  actions.sort((x, y) => y.saves - x.saves);

  return {
    headline: round(total, 1000),
    unit: t.unit,
    typical: round(typical, 1000),
    summary: yard > 0 ? t.summaryYard(yardShare) : t.summaryNoYard,
    actions,
    assumptions: [...t.assumptions(), t.rate((dollarsPerGallon() * GALLONS_PER_CCF).toFixed(2))],
  };
}
