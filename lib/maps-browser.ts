// Loads the Google Maps JavaScript API in the browser with a plain script tag. No dependency, no @types/google.maps.
// The key is a browser key (restricted by referrer in Google Cloud), so it is safe to expose as NEXT_PUBLIC_.

export const MAPS_BROWSER_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY ?? "";

// The map link is hidden when there is no key, and on stage when the build runs in fixtures mode.
export function mapsAvailable(): boolean {
  return MAPS_BROWSER_KEY !== "" && process.env.NEXT_PUBLIC_DEMO_MODE !== "fixtures";
}

// The few parts of the Maps API we call, typed locally.
export type LatLng = { lat(): number; lng(): number };
export type MapsEvent = { latLng?: LatLng };
type Listener = { remove(): void };
export type GMap = {
  setCenter(p: unknown): void;
  setZoom(z: number): void;
  addListener(ev: string, fn: (e: MapsEvent) => void): Listener;
};
type Overlay = { setMap(m: GMap | null): void };
export type GShape = Overlay & { setPath(p: LatLng[]): void };
export type Maps = {
  Map: new (el: HTMLElement, opts: Record<string, unknown>) => GMap;
  Polygon: new (opts: Record<string, unknown>) => GShape;
  Polyline: new (opts: Record<string, unknown>) => GShape;
  Circle: new (opts: Record<string, unknown>) => Overlay;
  Geocoder: new () => {
    geocode(
      req: { address: string; componentRestrictions?: { country: string } },
      cb: (results: { geometry: { location: LatLng } }[] | null, status: string) => void,
    ): void;
  };
  geometry?: { spherical: { computeArea(path: LatLng[]): number } };
};

let loading: Promise<Maps> | null = null;

export function loadMaps(): Promise<Maps> {
  const w = window as unknown as { google?: { maps?: Maps } };
  if (w.google?.maps?.geometry) return Promise.resolve(w.google.maps);
  if (loading) return loading;
  loading = new Promise<Maps>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(MAPS_BROWSER_KEY)}&libraries=geometry&v=weekly`;
    s.async = true;
    s.onload = () => (w.google?.maps ? resolve(w.google.maps) : reject(new Error("maps missing")));
    s.onerror = () => reject(new Error("maps failed to load"));
    // A blocked or slow network can leave the script hanging; give up after 8 seconds.
    setTimeout(() => reject(new Error("maps timed out")), 8000);
    document.head.appendChild(s);
  }).catch((e) => {
    loading = null;
    throw e;
  });
  return loading;
}

export const SQFT_PER_SQM = 10.7639; // unit conversion
