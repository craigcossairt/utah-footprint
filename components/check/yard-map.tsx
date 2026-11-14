"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ErrorNote, Skeleton } from "@/components/ui/feedback";
import type { Lang } from "@/lib/contract";
import { loadMaps, SQFT_PER_SQM, type GMap, type GPolygon, type Maps } from "@/lib/maps-browser";

const COPY = {
  en: {
    address: "Your address",
    find: "Show my home",
    finding: "Finding it",
    notFound: "We couldn't find that address. Check it, or enter the size instead.",
    failed: "The map didn't load. Enter the size instead.",
    tapHelp: "Tap each corner of your lawn. Start a new patch for a second lawn.",
    undo: "Undo last corner",
    clear: "Clear",
    newPatch: "Add another patch",
    noShape: "Tap at least 3 corners to measure a lawn.",
    use: (n: string) => `Use ${n} sq ft`,
    total: "Lawn measured",
    mapLabel: "Satellite map of your home. Tap the corners of your lawn.",
  },
  es: {
    address: "Su dirección",
    find: "Mostrar mi casa",
    finding: "Buscando",
    notFound: "No encontramos esa dirección. Revísela, o escriba el tamaño.",
    failed: "El mapa no cargó. Escriba el tamaño.",
    tapHelp: "Toque cada esquina de su césped. Empiece otra área para un segundo césped.",
    undo: "Quitar la última esquina",
    clear: "Borrar",
    newPatch: "Agregar otra área",
    noShape: "Toque al menos 3 esquinas para medir un césped.",
    use: (n: string) => `Usar ${n} pies cuadrados`,
    total: "Césped medido",
    mapLabel: "Mapa satelital de su casa. Toque las esquinas de su césped.",
  },
};

export function YardMap({ lang, onUse }: { lang: Lang; onUse: (sqFt: number) => void }) {
  const c = COPY[lang];
  const box = useRef<HTMLDivElement>(null);
  const maps = useRef<Maps | null>(null);
  const map = useRef<GMap | null>(null);
  const patches = useRef<GPolygon[]>([]);
  const [address, setAddress] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ready" | "notFound" | "failed">("idle");
  const [sqFt, setSqFt] = useState(0);
  const [corners, setCorners] = useState(0);

  // Load the script as soon as the panel opens, so "Show my home" is quick.
  useEffect(() => {
    // Google calls this global when the key is rejected; geocoding then never answers.
    (window as unknown as { gm_authFailure?: () => void }).gm_authFailure = () => setState("failed");
    loadMaps()
      .then((m) => (maps.current = m))
      .catch(() => setState("failed"));
  }, []);

  function measure() {
    const m = maps.current;
    if (!m) return;
    const total = patches.current.reduce(
      (sum, p) => sum + (p.getPath().getLength() >= 3 ? m.geometry.spherical.computeArea(p.getPath().getArray()) : 0),
      0,
    );
    setSqFt(Math.round(total * SQFT_PER_SQM));
    setCorners(patches.current.at(-1)?.getPath().getLength() ?? 0);
  }

  function newPatch() {
    const m = maps.current;
    if (!m || !map.current) return;
    const poly = new m.Polygon({
      map: map.current,
      paths: [],
      editable: true,
      strokeColor: "#ffffff",
      strokeWeight: 2,
      fillColor: "#ffffff",
      fillOpacity: 0.25,
    });
    for (const ev of ["set_at", "insert_at", "remove_at"]) m.event.addListener(poly.getPath(), ev, measure);
    patches.current.push(poly);
    measure();
  }

  async function find() {
    if (!address.trim()) return;
    setState("loading");
    try {
      const m = maps.current ?? (await loadMaps());
      maps.current = m;
      let answered = false;
      setTimeout(() => {
        if (!answered) setState("failed");
      }, 8000);
      new m.Geocoder().geocode({ address, componentRestrictions: { country: "US" } }, (results, status) => {
        answered = true;
        if (status !== "OK" || !results?.length || !box.current) return setState("notFound");
        const at = results[0].geometry.location;
        if (!map.current) {
          map.current = new m.Map(box.current, {
            center: at,
            zoom: 20,
            mapTypeId: "satellite",
            tilt: 0,
            disableDefaultUI: true,
            zoomControl: true,
            gestureHandling: "greedy",
            clickableIcons: false,
          });
          map.current.addListener("click", (e) => {
            if (!e.latLng) return;
            if (patches.current.length === 0) newPatch();
            patches.current.at(-1)!.getPath().push(e.latLng);
            measure();
          });
        } else {
          map.current.setCenter(at);
          map.current.setZoom(20);
        }
        setState("ready");
      });
    } catch {
      setState("failed");
    }
  }

  function undo() {
    const last = patches.current.at(-1);
    if (!last) return;
    if (last.getPath().getLength() > 0) last.getPath().pop();
    else if (patches.current.length > 1) {
      last.setMap(null);
      patches.current.pop();
    }
    measure();
  }

  function clear() {
    for (const p of patches.current) p.setMap(null);
    patches.current = [];
    measure();
  }

  const shown = sqFt.toLocaleString("en-US");

  return (
    <div className="mt-3 border-t-2 border-line pt-3">
      {state === "failed" ? <ErrorNote>{c.failed}</ErrorNote> : null}
      {state !== "failed" ? (
        <>
          <label htmlFor="yard-address" className="text-sm font-semibold">
            {c.address}
          </label>
          <div className="mt-1 flex flex-wrap gap-2">
            <input
              id="yard-address"
              autoComplete="street-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  find();
                }
              }}
              className="min-h-12 flex-1 rounded-control border-2 border-ink bg-surface px-3 py-2 text-base"
            />
            <Button type="button" variant="secondary" onClick={find} disabled={state === "loading" || !address.trim()}>
              {state === "loading" ? c.finding : c.find}
            </Button>
          </div>
          {state === "notFound" ? <ErrorNote>{c.notFound}</ErrorNote> : null}
          <div className="relative mt-3">
            {state === "loading" ? <Skeleton className="absolute inset-0 h-72" /> : null}
            <div
              ref={box}
              role="application"
              aria-label={c.mapLabel}
              className={`h-72 w-full rounded-control ${state === "ready" ? "" : "hidden"}`}
            />
          </div>
          {state === "ready" ? (
            <>
              <p className="mt-2 text-sm text-muted">{c.tapHelp}</p>
              <p className="mt-2">
                {c.total}: <span className="num text-2xl font-extrabold">{shown}</span> sq ft
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button type="button" variant="ghost" onClick={undo}>
                  {c.undo}
                </Button>
                <Button type="button" variant="ghost" onClick={clear}>
                  {c.clear}
                </Button>
                <Button type="button" variant="ghost" onClick={newPatch} disabled={corners < 3}>
                  {c.newPatch}
                </Button>
              </div>
              <Button type="button" variant="secondary" className="mt-2" onClick={() => onUse(sqFt)} disabled={sqFt === 0}>
                {c.use(shown)}
              </Button>
              {sqFt === 0 ? <p className="mt-1 text-sm text-muted">{c.noShape}</p> : null}
            </>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
