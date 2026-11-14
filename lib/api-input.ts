import type { Answers } from "./contract";
import { fromQuery } from "./answers";
import type { Lang } from "./gemini";

// Re-validates answers sent by the browser; anything malformed falls back to the sample home.
export function parseBody(body: unknown): { answers: Answers; lang: Lang; question: string } {
  const b = (body ?? {}) as Record<string, unknown>;
  const a = (b.answers ?? {}) as Record<string, unknown>;
  const { answers } = fromQuery({
    zip: String(a.zip ?? "84116"),
    p: String(a.household ?? ""),
    yard: String(a.yardSqFt ?? ""),
    miles: String(a.commuteMiles ?? ""),
    heat: String(a.heating ?? ""),
    kwh: a.monthlyKwh ? String(a.monthlyKwh) : undefined,
  });
  return { answers, lang: b.lang === "es" ? "es" : "en", question: typeof b.question === "string" ? b.question.trim() : "" };
}
