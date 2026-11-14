"use client";

import { FileUp } from "lucide-react";
import { useRef, useState } from "react";
import saved from "@/data/fixtures/bill.json";
import { Button } from "@/components/ui/button";
import { ErrorNote, Skeleton } from "@/components/ui/feedback";
import type { Lang } from "@/lib/contract";

// Optional helper for question 6: reads the kWh from a power bill, then asks before filling the box.
// The bill goes to our server and on to Gemini for one read. Nothing is stored, here or there.
const TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_MB = 4;
const MAX_BYTES = MAX_MB * 1024 * 1024;
const SHRINK_OVER_BYTES = 1024 * 1024;
const LONG_EDGE = 2000;
const CLIENT_TIMEOUT_MS = 13000;

type Reading = { kwh: number; days: number | null; scaled: boolean };
type Reason = "type" | "size" | "fixtures" | "unreadable" | "failed";
type State = { kind: "idle" } | { kind: "reading" } | { kind: "confirm"; reading: Reading } | { kind: "error"; reason: Reason };

const n = (x: number) => x.toLocaleString("en-US");

const COPY = {
  en: {
    upload: "Upload my power bill",
    sample: "Try it with a sample bill",
    privacy: "Your bill is sent to Google Gemini to read the kWh. We don't keep it.",
    reading: "Reading your bill…",
    read: (r: Reading) =>
      r.scaled && r.days
        ? `Your bill covers ${n(r.days)} days, so we scaled it to 30 days: ${n(r.kwh)} kWh for one month. Use it?`
        : r.days
          ? `We read ${n(r.kwh)} kWh for one month. Use it?`
          : `We read ${n(r.kwh)} kWh on your bill. Use it?`,
    use: (kwh: number) => `Use ${n(kwh)} kWh`,
    self: "Enter it myself",
    err: {
      type: `That file type doesn't work here. Use a photo (JPEG, PNG or WebP) or a PDF, up to ${MAX_MB} MB.`,
      size: `That file is too big. The limit is ${MAX_MB} MB. Try a photo of just the first page, or type the number in the box.`,
      fixtures: "Bill reading is turned off right now. Type the kWh from your bill in the box above, or leave it empty.",
      unreadable: "We couldn't find a kWh number on that bill. Type it in the box above, or leave it empty.",
      failed: "Reading the bill didn't work or took too long. Type the kWh in the box above, or leave it empty.",
    },
  },
  es: {
    upload: "Subir mi factura de luz",
    sample: "Probar con una factura de ejemplo",
    privacy: "Su factura se envía a Google Gemini para leer los kWh. No la guardamos.",
    reading: "Leyendo su factura…",
    read: (r: Reading) =>
      r.scaled && r.days
        ? `Su factura cubre ${n(r.days)} días, así que la ajustamos a 30 días: ${n(r.kwh)} kWh por un mes. ¿Usarlo?`
        : r.days
          ? `Leímos ${n(r.kwh)} kWh por un mes. ¿Usarlo?`
          : `Leímos ${n(r.kwh)} kWh en su factura. ¿Usarlo?`,
    use: (kwh: number) => `Usar ${n(kwh)} kWh`,
    self: "Escribirlo yo",
    err: {
      type: `Ese tipo de archivo no funciona aquí. Use una foto (JPEG, PNG o WebP) o un PDF, de hasta ${MAX_MB} MB.`,
      size: `Ese archivo es muy grande. El límite es ${MAX_MB} MB. Pruebe con una foto de la primera página, o escriba el número en la casilla.`,
      fixtures: "La lectura de facturas está apagada ahora. Escriba los kWh de su factura en la casilla de arriba, o déjela vacía.",
      unreadable: "No encontramos un número de kWh en esa factura. Escríbalo en la casilla de arriba, o déjela vacía.",
      failed: "No pudimos leer la factura o tardó demasiado. Escriba los kWh en la casilla de arriba, o déjela vacía.",
    },
  },
};

// Phone photos are often 5 to 10 MB. Shrink them in the browser so they fit under the limit.
async function shrink(file: Blob): Promise<Blob> {
  if (file.type === "application/pdf" || file.size <= SHRINK_OVER_BYTES) return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, LONG_EDGE / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")?.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    bmp.close();
    const out = await new Promise<Blob | null>((done) => canvas.toBlob(done, "image/jpeg", 0.85));
    return out && out.size < file.size ? out : file;
  } catch {
    return file;
  }
}

export function BillUpload({ lang, onUse }: { lang: Lang; onUse: (kwh: string) => void }) {
  const c = COPY[lang];
  const input = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<State>({ kind: "idle" });
  const savedReading: Reading = { kwh: saved.sample.kwh, days: saved.sample.days, scaled: false };

  async function send(file: Blob, isSample: boolean) {
    if (!TYPES.includes(file.type)) return setState({ kind: "error", reason: "type" });
    setState({ kind: "reading" });
    const body = await shrink(file);
    if (body.size > MAX_BYTES) return setState({ kind: "error", reason: "size" });
    const res = await fetch(`/api/bill${isSample ? "?sample=1" : ""}`, {
      method: "POST",
      headers: { "content-type": body.type },
      body,
      signal: AbortSignal.timeout(CLIENT_TIMEOUT_MS),
    });
    const reply = await res.json();
    if (reply.ok) setState({ kind: "confirm", reading: { kwh: reply.kwh, days: reply.days, scaled: reply.scaled } });
    else setState({ kind: "error", reason: reply.reason in c.err ? reply.reason : "failed" });
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    try {
      await send(file, false);
    } catch {
      setState({ kind: "error", reason: "failed" });
    }
  }

  // The sample always works: if the network or the read fails, show its saved reading.
  async function onSample() {
    setState({ kind: "reading" });
    try {
      const file = await (await fetch(saved.sample.file)).blob();
      await send(file, true);
    } catch {
      setState({ kind: "confirm", reading: savedReading });
    }
  }

  function enterMyself() {
    setState({ kind: "idle" });
    document.getElementById("kwh")?.focus();
  }

  return (
    <div className="mt-6">
      <input
        ref={input}
        type="file"
        accept={TYPES.join(",")}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => {
          void onFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <Button type="button" variant="secondary" disabled={state.kind === "reading"} onClick={() => input.current?.click()}>
          <FileUp size={20} strokeWidth={2} aria-hidden /> {c.upload}
        </Button>
        <Button type="button" variant="ghost" disabled={state.kind === "reading"} onClick={() => void onSample()}>
          {c.sample}
        </Button>
      </div>

      <div aria-live="polite">
        {state.kind === "reading" && (
          <div className="mt-4" role="status">
            <p className="text-muted">{c.reading}</p>
            <Skeleton className="mt-2 h-12 w-full" />
          </div>
        )}
        {state.kind === "confirm" && (
          <div className="mt-4">
            <p className="num">{c.read(state.reading)}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  onUse(String(state.reading.kwh));
                  setState({ kind: "idle" });
                }}
              >
                {c.use(state.reading.kwh)}
              </Button>
              <Button type="button" variant="ghost" onClick={enterMyself}>
                {c.self}
              </Button>
            </div>
          </div>
        )}
      </div>
      {state.kind === "error" && <ErrorNote>{c.err[state.reason]}</ErrorNote>}

      <p className="mt-4 text-sm text-muted">{c.privacy}</p>
    </div>
  );
}
