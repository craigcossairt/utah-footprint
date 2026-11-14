import type { AreaResult, Lang } from "@/lib/contract";
import type { WaterResult } from "./calc";
import { AreaCard, SourceLink } from "@/components/ui/area-card";
import { getToday, todaySources } from "@/lib/today";
import { fact, facts, links } from "./facts";

const T = {
  en: {
    title: "Water",
    spend: (d: string) => `Watering your lawn costs about $${d} a year on a Salt Lake City water bill. Here is how to keep more of it:`,
    change: "What would change it most",
    keep: (d: string) => `Save $${d} a year`,
    alsoSaves: "Also saves",
    lake: "Great Salt Lake today:",
    feet: "feet",
    below: "feet below the healthy range.",
    inside: ", inside the healthy range.",
    lakeTitle: "Does a yard affect the lake?",
    lake1: "Cities, homes and industry cause about",
    lake2: "% of the water people use up in the Great Salt Lake basin; farms cause",
    lake3: "%. About",
    lake4: "% of the water put on city yards and landscapes is used up and does not flow back. Yards are the part of this that households control.",
    lakeLink: "Great Salt Lake Strike Team, 2026",
    reuseTitle: "Saving and reusing water, legally",
    rain1: "Rain barrels are legal in Utah. Use the water on the same lot, store up to",
    rain2: "gallons, and register for free if you have more than two containers or one over",
    gallons: "gallons.",
    rainLink: "Register with Utah Water Rights",
    gray: "Shower, bath, bathroom sink and washer water can water plants by drip only where your county health department runs a graywater permit program. Toilet, kitchen sink and dishwasher water never can. Call your health department before you build anything.",
    grayLink: "USU Extension: graywater in Utah",
  },
  es: {
    title: "Agua",
    spend: (d: string) => `Regar su césped le cuesta unos $${d} al año en una factura de agua de Salt Lake City. Así puede ahorrar más:`,
    change: "Lo que más lo cambiaría",
    keep: (d: string) => `Ahorre $${d} al año`,
    alsoSaves: "También ahorra",
    lake: "El Gran Lago Salado hoy:",
    feet: "pies",
    below: "pies por debajo del nivel sano.",
    inside: ", dentro del nivel sano.",
    lakeTitle: "¿Un jardín afecta al lago?",
    lake1: "Las ciudades, los hogares y la industria causan cerca del",
    lake2: "% del agua que la gente consume en la cuenca del Gran Lago Salado; las granjas causan el",
    lake3: "%. Cerca del",
    lake4: "% del agua que se pone en jardines y paisajes de la ciudad se consume y no regresa. Los jardines son la parte que los hogares controlan.",
    lakeLink: "Great Salt Lake Strike Team, 2026 (en inglés)",
    reuseTitle: "Guardar y reusar agua, dentro de la ley",
    rain1: "Los barriles de lluvia son legales en Utah. Use el agua en el mismo terreno, guarde hasta",
    rain2: "galones, y regístrese gratis si tiene más de dos recipientes o uno de más de",
    gallons: "galones.",
    rainLink: "Registro en Utah Water Rights (en inglés)",
    gray: "El agua de la ducha, la tina, el lavabo del baño y la lavadora puede regar plantas por goteo solo donde el departamento de salud de su condado tiene un programa de permisos para aguas grises. El agua del inodoro, el fregadero de la cocina y el lavaplatos nunca. Llame a su departamento de salud antes de construir algo.",
    grayLink: "USU Extension: aguas grises en Utah (en inglés)",
  },
};

export default async function Card({ result, lang = "en" }: { result: AreaResult; lang?: Lang }) {
  const t = T[lang] ?? T.en;
  const today = await getToday();
  const { elevationFt, healthyMinFt } = today.lake;
  const gap = healthyMinFt - elevationFt;
  return (
    <AreaCard title={t.title} result={{ ...result, actions: [] }} facts={facts} lang={lang}>
      {result.actions.length > 0 ? <MoneyActions result={result as WaterResult} t={t} /> : null}
      <p className="mt-3 text-sm">
        {t.lake} <span className="num font-semibold">{elevationFt.toFixed(1)}</span> {t.feet}
        {gap > 0 ? (
          <>
            , <span className="num font-semibold">{gap.toFixed(1)}</span> {t.below}
          </>
        ) : (
          t.inside
        )}{" "}
        <SourceLink href={todaySources.lake.url}>USGS</SourceLink>
      </p>
      <div className="mt-4 text-sm">
        <h3 className="font-semibold">{t.lakeTitle}</h3>
        <p className="mt-1">
          {t.lake1} <span className="num">{fact("water.lakeCityShare")}</span>
          {t.lake2} <span className="num">{fact("water.lakeFarmShare").toFixed(1)}</span>
          {t.lake3} <span className="num">{fact("water.outdoorDepletedPct")}</span>
          {t.lake4} <SourceLink href={links.gsl2026}>{t.lakeLink}</SourceLink>
        </p>
      </div>
      <div className="mt-4 text-sm">
        <h3 className="font-semibold">{t.reuseTitle}</h3>
        <p className="mt-1">
          {t.rain1} <span className="num">{fact("water.rainParcelCapGallons").toLocaleString("en-US")}</span> {t.rain2}{" "}
          <span className="num">{fact("water.rainRegisterOverGallons")}</span> {t.gallons}{" "}
          <SourceLink href={links.rainRegister}>{t.rainLink}</SourceLink>
        </p>
        <p className="mt-2">
          {t.gray} <SourceLink href={links.usuGraywater}>{t.grayLink}</SourceLink>
        </p>
      </div>
    </AreaCard>
  );
}

const fmt = (n: number) => n.toLocaleString("en-US");

// Actions lead with the money each one keeps in your pocket; gallons follow, as on the Air card.
function MoneyActions({ result, t }: { result: WaterResult; t: (typeof T)["en"] | (typeof T)["es"] }) {
  const money = result.money;
  return (
    <div className="mt-5">
      {money && money.yardPerYear > 0 ? <p className="text-lg font-semibold">{t.spend(fmt(money.yardPerYear))}</p> : null}
      <h3 className="mt-3 text-sm font-semibold uppercase tracking-wide text-muted">{t.change}</h3>
      <ul className="mt-2 divide-y divide-line border-y border-line">
        {result.actions.map((a) => {
          const m = money?.byAction[a.id];
          return (
            <li key={a.id} className="py-3">
              {m && m.dollars > 0 ? <p className="num text-3xl font-extrabold">{t.keep(fmt(m.dollars))}</p> : null}
              <p className="font-semibold">{a.title}</p>
              <p className="text-sm">
                {t.alsoSaves} <span className="num font-semibold">{fmt(a.saves)}</span> {a.unit}.{" "}
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
