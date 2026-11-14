import { NextResponse } from "next/server";
import { parseBody } from "@/lib/api-input";
import { plan } from "@/lib/gemini";
import { sample } from "@/lib/sample";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { answers, lang } = parseBody(await req.json().catch(() => ({})));
  return NextResponse.json(await plan(answers, lang));
}

// GET runs the plan for the sample home, so it can be warmed before the demo.
export async function GET(req: Request) {
  const lang = new URL(req.url).searchParams.get("lang") === "es" ? "es" : "en";
  return NextResponse.json(await plan(sample.answers, lang));
}
