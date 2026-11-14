import type { ReactNode } from "react";
import * as water from "@/areas/water";
import * as energy from "@/areas/energy";
import * as air from "@/areas/air";
import type { Area, AreaResult, Lang } from "@/lib/contract";

// Each area's Card receives the result and the page language ("en" or "es").
export type CardProps = { result: AreaResult; lang?: Lang };
type Entry = { area: Area; Card: (props: CardProps) => ReactNode | Promise<ReactNode> };

export const areas: Entry[] = [water, energy, air];
