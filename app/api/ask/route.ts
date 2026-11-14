import { NextResponse } from "next/server";
import { parseBody } from "@/lib/api-input";
import { ask } from "@/lib/gemini";
import { sample } from "@/lib/sample";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { answers, lang, question } = parseBody(await req.json().catch(() => ({})));
  if (!question) return NextResponse.json({ error: "Type a question first." }, { status: 400 });
  return NextResponse.json(await ask(answers, question, lang));
}

// GET asks about the sample home: /api/ask?q=...  Used to warm the demo questions.
export async function GET(req: Request) {
  const p = new URL(req.url).searchParams;
  const q = (p.get("q") ?? "").trim();
  if (!q) return NextResponse.json({ error: "Add ?q=your question" }, { status: 400 });
  return NextResponse.json(await ask(sample.answers, q, p.get("lang") === "es" ? "es" : "en"));
}
