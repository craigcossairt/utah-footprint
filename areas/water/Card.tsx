import type { AreaResult, Lang } from "@/lib/contract";
import { AreaCard, SourceLink } from "@/components/ui/area-card";
import { getToday, todaySources } from "@/lib/today";
import { fact, facts, links } from "./facts";

const T = {
  en: {
    title: "Water",
    lake: "Great Salt Lake today:",
    feet: "feet",
    below: "feet below the healthy range.",
    inside: ", inside the healthy range.",
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
    lake: "El Gran Lago Salado hoy:",
    feet: "pies",
    below: "pies por debajo del nivel sano.",
    inside: ", dentro del nivel sano.",
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
    <AreaCard title={t.title} result={result} facts={facts} lang={lang}>
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
