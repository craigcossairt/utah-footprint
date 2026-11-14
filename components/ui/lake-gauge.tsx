// Vertical gauge: today's lake level against the healthy range.
export function LakeGauge({
  level,
  healthyMin,
  healthyMax,
}: {
  level: number;
  healthyMin: number;
  healthyMax: number;
}) {
  const lo = Math.min(level, healthyMin) - 4;
  const hi = healthyMax + 1;
  const pct = (ft: number) => ((ft - lo) / (hi - lo)) * 100;
  const gap = healthyMin - level;
  const label =
    gap > 0
      ? `The lake is at ${level.toFixed(1)} feet, ${gap.toFixed(1)} feet below the healthy range, which starts at ${healthyMin.toLocaleString("en-US")} feet.`
      : `The lake is at ${level.toFixed(1)} feet, inside the healthy range.`;

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
        <span className="font-semibold">Healthy range</span>
        <br />
        <span className="num">
          {healthyMin.toLocaleString("en-US")} to {healthyMax.toLocaleString("en-US")} ft
        </span>
      </p>
      <p className="absolute left-24 translate-y-1/2 text-sm leading-tight text-lake" style={{ bottom: `${pct(level)}%` }}>
        <span className="font-semibold">Today</span>
        <br />
        <span className="num">{level.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ft</span>
      </p>
    </div>
  );
}
