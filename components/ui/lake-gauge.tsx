const L = {
  en: {
    below: (level: string, gap: string, min: string) =>
      `The lake is at ${level} feet, ${gap} feet below the healthy range, which starts at ${min} feet.`,
    inside: (level: string) => `The lake is at ${level} feet, inside the healthy range.`,
    healthy: "Healthy range",
    range: (min: string, max: string) => `${min} to ${max} ft`,
    today: "Today",
    ft: "ft",
  },
  es: {
    below: (level: string, gap: string, min: string) =>
      `El lago está a ${level} pies, ${gap} pies por debajo del nivel saludable, que empieza en ${min} pies.`,
    inside: (level: string) => `El lago está a ${level} pies, dentro del nivel saludable.`,
    healthy: "Nivel saludable",
    range: (min: string, max: string) => `${min} a ${max} pies`,
    today: "Hoy",
    ft: "pies",
  },
};

// Vertical gauge: today's lake level against the healthy range.
export function LakeGauge({
  level,
  healthyMin,
  healthyMax,
  lang = "en",
}: {
  level: number;
  healthyMin: number;
  healthyMax: number;
  lang?: "en" | "es";
}) {
  const l = L[lang];
  const lo = Math.min(level, healthyMin) - 4;
  const hi = healthyMax + 1;
  const pct = (ft: number) => ((ft - lo) / (hi - lo)) * 100;
  const gap = healthyMin - level;
  const label =
    gap > 0
      ? l.below(level.toFixed(1), gap.toFixed(1), healthyMin.toLocaleString("en-US"))
      : l.inside(level.toFixed(1));

  return (
    <div className="relative h-64 w-full max-w-xs lg:h-80" role="img" aria-label={label}>
      <div className="absolute inset-y-0 left-0 w-20 overflow-hidden rounded-control border-2 border-ink bg-surface">
        <div
          className="absolute inset-x-0 border-y-2 border-dashed border-sage bg-sage/15"
          style={{ bottom: `${pct(healthyMin)}%`, height: `${pct(healthyMax) - pct(healthyMin)}%` }}
        />
        <div className="absolute inset-x-0 bottom-0 bg-lake" style={{ height: `${pct(level)}%` }} />
      </div>
      <p
        className="absolute left-24 translate-y-1/2 text-sm leading-tight text-sage"
        style={{ bottom: `${(pct(healthyMin) + pct(healthyMax)) / 2}%` }}
      >
        <span className="font-semibold">{l.healthy}</span>
        <br />
        <span className="num">
          {l.range(healthyMin.toLocaleString("en-US"), healthyMax.toLocaleString("en-US"))}
        </span>
      </p>
      <p className="absolute left-24 translate-y-1/2 text-sm leading-tight text-lake" style={{ bottom: `${pct(level)}%` }}>
        <span className="font-semibold">{l.today}</span>
        <br />
        <span className="num">{level.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} {l.ft}</span>
      </p>
    </div>
  );
}
