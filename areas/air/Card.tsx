import type { AreaResult, Lang } from "@/lib/contract";
import { AreaCard, SourceLink } from "@/components/ui/area-card";
import { aqiWord, todaySources } from "@/lib/today";
import type { AirMoney, AirResult } from "./calc";
import { fact, facts, programs } from "./facts";
import { getAirForZip, getDustOutlook } from "./today-air";

const fmt = (n: number) => n.toLocaleString("en-US");

// EPA AQI category words in Spanish, keyed by the English word from lib/today.
const AQI_ES: Record<string, string> = {
  Good: "Buena",
  Moderate: "Moderada",
  "Unhealthy for sensitive groups": "Dañina para grupos sensibles",
  Unhealthy: "Dañina",
  "Very unhealthy": "Muy dañina",
  Hazardous: "Peligrosa",
};

const T = {
  en: {
    title: "Air",
    spend: (d: number) => `Your commute costs about $${fmt(d)} a year in gas. Here is how to keep more of it:`,
    change: "What would change it most",
    keep: (d: number) => `Save $${fmt(d)} a year`,
    alsoCuts: "Also cuts",
    compare: (pct: number, typical: number) => (
      <>
        That is about <span className="num font-semibold text-ink">{pct}%</span> of the CO2 from all the driving one
        Utah resident does in a typical year ({fmt(typical)} lbs).
      </>
    ),
    airIn: (place: string, stale: boolean) => `Air in ${place} ${stale ? "(last saved reading)" : "now"}`,
    aqi: (word: string) => word,
    noZip: (zip: string) => `We couldn't get a reading for ${zip}, so this is Salt Lake City.`,
    driver: {
      pm25: "set by fine particles averaged over the past 24 hours",
      pm10: "set by coarse dust averaged over the past 24 hours",
      ozone: "set by ozone",
      no2: "set by nitrogen dioxide",
    },
    thisHour: "This hour:",
    fine: "fine particles (PM2.5)",
    coarse: "coarse dust (PM10)",
    measured: "Measured",
    locale: "en-US",
    unavailable: "Today's air reading isn't available right now.",
    dust: "On windy days, dust from the dry Great Salt Lake bed adds coarse particles (PM10) to the air along the Wasatch Front. A higher lake leaves less lakebed to blow.",
    outlook: (weekday: string, n: number) => (
      <>
        Dustiest day ahead: {weekday}, coarse dust up to <span className="num">{n}</span> µg/m³.
      </>
    ),
    outlookNote: (place: string, at: string) => `Open-Meteo forecast for ${place}, the next 3 days. Fetched ${at}.`,
    inversion: (pct: number) => (
      <>
        In a typical winter inversion, about <span className="num font-semibold">{pct}%</span> of the fine-particle
        pollution comes from vehicles, trains and aircraft. Every commute day you skip or share is one less car under
        the lid.
      </>
    ),
  },
  es: {
    title: "Aire",
    spend: (d: number) => `Ir al trabajo le cuesta unos $${fmt(d)} al año en gasolina. Así puede ahorrar más:`,
    change: "Lo que más lo cambiaría",
    keep: (d: number) => `Ahorre $${fmt(d)} al año`,
    alsoCuts: "Además reduce",
    compare: (pct: number, typical: number) => (
      <>
        Es más o menos el <span className="num font-semibold text-ink">{pct}%</span> del CO2 de todo lo que maneja un
        residente de Utah en un año típico ({fmt(typical)} libras).
      </>
    ),
    airIn: (place: string, stale: boolean) => `Aire en ${place} ${stale ? "(última lectura guardada)" : "ahora"}`,
    aqi: (word: string) => AQI_ES[word] ?? word,
    noZip: (zip: string) => `No pudimos obtener una lectura para ${zip}, así que esta es de Salt Lake City.`,
    driver: {
      pm25: "determinado por las partículas finas en promedio de las últimas 24 horas",
      pm10: "determinado por el polvo grueso en promedio de las últimas 24 horas",
      ozone: "determinado por el ozono",
      no2: "determinado por el dióxido de nitrógeno",
    },
    thisHour: "Esta hora:",
    fine: "partículas finas (PM2.5)",
    coarse: "polvo grueso (PM10)",
    measured: "Medido",
    locale: "es-US",
    unavailable: "La lectura del aire de hoy no está disponible ahora.",
    dust: "Los días de viento, el polvo del lecho seco del Gran Lago Salado agrega partículas gruesas (PM10) al aire del Wasatch Front. Un lago más alto deja menos lecho expuesto al viento.",
    outlook: (weekday: string, n: number) => (
      <>
        Día con más polvo en los próximos días: {weekday}, polvo grueso de hasta <span className="num">{n}</span> µg/m³.
      </>
    ),
    outlookNote: (place: string, at: string) =>
      `Pronóstico de Open-Meteo para ${place}, los próximos 3 días. Consultado ${at}.`,
    inversion: (pct: number) => (
      <>
        En una inversión típica de invierno, cerca del <span className="num font-semibold">{pct}%</span> de la
        contaminación por partículas finas viene de vehículos, trenes y aviones. Cada día que no maneja al trabajo, o
        que comparte el viaje, es un carro menos bajo la capa de aire.
      </>
    ),
  },
};

export default async function Card({ result, lang = "en" }: { result: AreaResult; lang?: Lang }) {
  const t = T[lang] ?? T.en;
  const zip = (result as AirResult).zip;
  const ready = result.unit !== "";
  // The shared comparison bar is labelled "Typical Utah home"; ours is one resident's driving,
  // so we hide the bar and say the comparison in words instead.
  // We draw our own action list (dollars first), so the shared one is switched off here.
  // The full actions still go to the results page's ranked list and to Gemini.
  const shown = { ...result, typical: 0, actions: [] };
  const money = (result as AirResult).money;

  return (
    <AreaCard title={t.title} result={shown} facts={facts} lang={lang}>
      {ready && result.typical ? (
        <p className="mt-3 text-sm text-muted">
          {t.compare(Math.round((result.headline / result.typical) * 100), result.typical)}
        </p>
      ) : null}
      {result.actions.length > 0 ? <MoneyActions result={result} money={money} t={t} /> : null}
      <TodayAir zip={zip} t={t} />
      <p className="mt-3 text-sm">
        {t.inversion(fact("air.inversionMobileSharePct").value)}{" "}
        <SourceLink href={fact("air.inversionMobileSharePct").url}>Utah Division of Air Quality</SourceLink>
      </p>
      <p className="mt-3 text-sm">
        {t.dust} <SourceLink href={programs.lakeDust.url}>{programs.lakeDust.name}</SourceLink>
      </p>
      <Outlook zip={zip} t={t} />
    </AreaCard>
  );
}

type Words = (typeof T)["en"] | (typeof T)["es"];

// Actions lead with the money each one keeps in your pocket; CO2 follows as the second reason.
function MoneyActions({ result, money, t }: { result: AreaResult; money?: AirMoney; t: Words }) {
  const hasMoney = !!money && money.gasPerYear > 0;
  return (
    <div className="mt-5">
      {hasMoney ? (
        <p className="text-lg font-semibold">
          {t.spend(money!.gasPerYear)}
        </p>
      ) : null}
      <h3 className="mt-3 text-sm font-semibold uppercase tracking-wide text-muted">{t.change}</h3>
      <ul className="mt-2 divide-y divide-line border-y border-line">
        {result.actions.map((a) => {
          const m = money?.byAction[a.id];
          return (
            <li key={a.id} className="py-3">
              {hasMoney && m && m.dollars > 0 ? (
                <p className="num text-3xl font-extrabold">
                  {t.keep(m.dollars)}
                </p>
              ) : null}
              <p className="font-semibold">{a.title}</p>
              <p className="text-sm">
                {t.alsoCuts} <span className="num font-semibold">{fmt(a.saves)}</span> {a.unit}.{" "}
                <span className="text-muted">{m ? m.note : a.costNote}</span>
              </p>
              {a.program ? <SourceLink href={a.program.url}>{a.program.name}</SourceLink> : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function when(utc: string, locale: string): string {
  return new Date(utc).toLocaleString(locale, {
    timeZone: "America/Denver",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

async function Outlook({ zip, t }: { zip?: string; t: (typeof T)["en"] | (typeof T)["es"] }) {
  const o = await getDustOutlook(zip);
  if (!o) return null;
  // Noon on that local date, so the weekday never slips across midnight.
  const weekday = new Date(`${o.day}T12:00:00-07:00`).toLocaleDateString(t.locale, {
    weekday: "long",
    timeZone: "America/Denver",
  });
  return (
    <div className="mt-3 text-sm">
      <p className="font-semibold">{t.outlook(weekday, o.pm10Max)}</p>
      <p className="text-muted">{t.outlookNote(o.place, when(o.fetchedAtUtc, t.locale))}</p>
      <SourceLink href={todaySources.air.url}>Open-Meteo air quality model</SourceLink>
    </div>
  );
}

async function TodayAir({ zip, t }: { zip?: string; t: (typeof T)["en"] | (typeof T)["es"] }) {
  try {
    const air = await getAirForZip(zip);
    const { pm25, pm10, usAqi, measuredAtUtc } = air;
    return (
      <div className="mt-4 border-l-4 border-line pl-3 text-sm">
        <p className="font-semibold">
          {t.airIn(air.place, air.stale)}: {t.aqi(aqiWord(usAqi))}, AQI <span className="num">{usAqi}</span>
          {air.driver ? <span className="font-normal">, {t.driver[air.driver]}</span> : null}
        </p>
        {zip && air.live && !air.forZip ? <p className="text-muted">{t.noZip(zip)}</p> : null}
        <p className="text-muted">
          {t.thisHour} {t.fine} <span className="num">{Math.round(pm25)}</span> µg/m³, {t.coarse}{" "}
          <span className="num">{Math.round(pm10)}</span> µg/m³. {t.measured} {when(measuredAtUtc, t.locale)}.
        </p>
        <SourceLink href={todaySources.air.url}>Open-Meteo air quality model</SourceLink>
      </div>
    );
  } catch {
    return <p className="mt-4 text-sm text-muted">{t.unavailable}</p>;
  }
}
