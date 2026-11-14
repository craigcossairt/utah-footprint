import type { Area } from "@/lib/contract";
import { facts } from "./facts";
import { calculate } from "./calc";

export const area: Area = { id: "air", label: "Air", facts, calculate };
export { default as Card } from "./Card";
