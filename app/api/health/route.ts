import { NextResponse } from "next/server";
import { demoMode } from "@/lib/demo-mode";
import { MODEL } from "@/lib/gemini";

// Pre-demo check: which mode is running and whether a Gemini key is set. Never returns the key.
export async function GET() {
  await Promise.resolve();
  return NextResponse.json({ mode: demoMode(), geminiKeySet: !!process.env.GEMINI_API_KEY, model: MODEL, at: new Date().toISOString() });
}
