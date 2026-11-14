"use client";

import { useEffect, useState } from "react";

// A large figure with its unit. Counts up once unless the user prefers reduced motion.
export function BigNumber({
  value,
  unit,
  label,
  decimals = 0,
  size = "lg",
}: {
  value: number;
  unit: string;
  label?: string;
  decimals?: number;
  size?: "md" | "lg";
}) {
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      return;
    }
    const start = performance.now();
    const from = 0;
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 700);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(from + (value - from) * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  const text = shown.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <div>
      {label ? <p className="text-sm text-muted">{label}</p> : null}
      <p className="flex flex-wrap items-baseline gap-x-2">
        <span className={`num font-extrabold ${size === "lg" ? "text-5xl lg:text-6xl" : "text-3xl lg:text-4xl"}`}>
          {text}
        </span>
        <span className="text-base text-muted">{unit}</span>
      </p>
    </div>
  );
}
