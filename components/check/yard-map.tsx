"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ErrorNote, Skeleton } from "@/components/ui/feedback";
import type { Lang } from "@/lib/contract";
import { loadMaps, SQFT_PER_SQM, type GMap, type GShape, type LatLng, type Maps } from "@/lib/maps-browser";

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
    corners: (n: number) => (n === 1 ? "1 corner so far" : `${n} corners so far`),
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
    corners: (n: number) => (n === 1 ? "1 esquina hasta ahora" : `${n} esquinas hasta ahora`),
    mapLabel: "Mapa satelital de su casa. Toque las esquinas de su césped.",
  },
};

type Patch = { pts: LatLng[]; line: GShape; fill: GShape; dots: { setMap(m: GMap | null): void }[] };

// Design tokens, read from the page so the map shapes follow DESIGN.md.
function token(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
const white = () => token("--color-surface");

// Area in square meters of a small shape on the ground, used only if Google's geometry library is missing.
function flatArea(pts: LatLng[]): number {
  const R = 6371008.8; // mean Earth radius in meters, unit conversion
  const rad = Math.PI / 180;
  const k = Math.cos(pts[0].lat() * rad);
  let sum = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    sum += a.lng() * rad * k * (b.lat() * rad) - b.lng() * rad * k * (a.lat() * rad);
  }
  return (Math.abs(sum) / 2) * R * R;
}

export function YardMap({ lang, onUse }: { lang: Lang; onUse: (sqFt: number) => void }) {
  const c = COPY[lang];
  const box = useRef<HTMLDivElement>(null);
  const maps = useRef<Maps | null>(null);
  const map = useRef<GMap | null>(null);
  const patches = useRef<Patch[]>([]);
  const [address, setAddress] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ready" | "notFound" | "failed">("idle");
  const [sqFt, setSqFt] = useState(0);
  const [corners, setCorners] = useState(0);

  // Load the script as soon as the question shows, so "Show my home" is quick.
  useEffect(() => {
    // Google calls this global when the key is rejected; geocoding then never answers.
    (window as unknown as { gm_authFailure?: () => void }).gm_authFailure = () => setState("failed");
    loadMaps()
      .then((m) => (maps.current = m))
      .catch(() => setState("failed"));
  }, []);

  // Each patch keeps its own list of corners. The map shapes are redrawn from that list, so a tap
  // always counts even if a shape fails to draw.
  function redraw() {
    const m = maps.current;
    let total = 0;
    for (const p of patches.current) {
      try {
        p.line.setPath(p.pts.length >= 3 ? [...p.pts, p.pts[0]] : p.pts);
        p.fill.setPath(p.pts.length >= 3 ? p.pts : []);
        if (p.pts.length >= 3) total += m?.geometry ? m.geometry.spherical.computeArea(p.pts) : flatArea(p.pts);
      } catch {
        if (p.pts.length >= 3) total += flatArea(p.pts);
      }
    }
    setSqFt(Math.round(total * SQFT_PER_SQM));
    setCorners(patches.current.at(-1)?.pts.length ?? 0);
  }

  function newPatch() {
    const m = maps.current;
    if (!m || !map.current) return;
    const w = white();
    patches.current.push({
      pts: [],
      dots: [],
      line: new m.Polyline({ map: map.current, path: [], strokeColor: w, strokeWeight: 3, clickable: false }),
      fill: new m.Polygon({ map: map.current, strokeOpacity: 0, fillColor: w, fillOpacity: 0.3, clickable: false }),
    });
  }

  function addCorner(at: LatLng) {
    const m = maps.current;
    if (!m || !map.current) return;
    if (patches.current.length === 0) newPatch();
    const p = patches.current.at(-1);
    if (!p) return;
    p.pts.push(at);
    try {
      // Radius is in meters: about one step wide, easy to see at zoom 20.
      p.dots.push(
        new m.Circle({ map: map.current, center: at, radius: 0.5, strokeColor: token("--color-ink"), strokeWeight: 2, fillColor: white(), fillOpacity: 1, clickable: false }),
      );
    } catch {}
    redraw();
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
            // One finger scrolls the page past the map on a phone; two fingers move the map. Taps still add corners.
            gestureHandling: "cooperative",
            clickableIcons: false,
          });
          map.current.addListener("click", (e) => {
            if (e.latLng) addCorner(e.latLng);
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

  function remove(p: Patch) {
    for (const o of [p.line, p.fill, ...p.dots]) o.setMap(null);
  }

  function undo() {
    const last = patches.current.at(-1);
    if (!last) return;
    if (last.pts.length > 0) {
      last.pts.pop();
      last.dots.pop()?.setMap(null);
    } else if (patches.current.length > 1) {
      remove(last);
      patches.current.pop();
    }
    redraw();
  }

  function clear() {
    patches.current.forEach(remove);
    patches.current = [];
    redraw();
  }

  function addPatch() {
    newPatch();
    redraw();
  }

  const shown = sqFt.toLocaleString("en-US");

  return (
    <div className="mt-2">
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
              <p className="mt-2" aria-live="polite">
                {c.total}: <span className="num text-2xl font-extrabold">{shown}</span> sq ft
                {corners > 0 ? <span className="ml-3 text-sm text-muted">{c.corners(corners)}</span> : null}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button type="button" variant="ghost" onClick={undo}>
                  {c.undo}
                </Button>
                <Button type="button" variant="ghost" onClick={clear}>
                  {c.clear}
                </Button>
                <Button type="button" variant="ghost" onClick={addPatch} disabled={corners < 3}>
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
