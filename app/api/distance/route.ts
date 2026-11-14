import { NextResponse } from "next/server";
import { measureDistance } from "@/lib/maps-server";

// POST { from, to } -> { miles, origin } one way by road. The addresses are not logged or stored.
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }
  const { from, to } = (body ?? {}) as { from?: unknown; to?: unknown };
  const ok = (v: unknown): v is string => typeof v === "string" && v.trim().length >= 3 && v.length <= 200;
  if (!ok(from) || !ok(to)) return NextResponse.json({ error: "bad-request" }, { status: 400 });

  const result = await measureDistance(from.trim(), to.trim());
  if (!result) return NextResponse.json({ error: "unmeasured" }, { status: 422, headers: { "Cache-Control": "no-store" } });
  return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
}
