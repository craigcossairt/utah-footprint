import households from "@/data/fixtures/households.json";
import type { Answers } from "@/lib/contract";

export const sample = households[0] as { id: string; name: string; neighborhood: string; answers: Answers };
