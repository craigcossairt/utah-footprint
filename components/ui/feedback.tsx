import { TriangleAlert } from "lucide-react";

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-control bg-line ${className}`} aria-hidden />;
}

// Status is never colour alone: always an icon and words.
export function ErrorNote({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="mt-2 flex items-start gap-2 text-sm text-bad">
      <TriangleAlert size={18} strokeWidth={2} className="mt-0.5 shrink-0" aria-hidden />
      <span>{children}</span>
    </p>
  );
}

export function StepProgress({
  step,
  total,
  label,
  onDark = false,
}: {
  step: number;
  total: number;
  label?: string;
  onDark?: boolean;
}) {
  const text = label ?? `Question ${step} of ${total}`;
  return (
    <div>
      <p className={`text-sm ${onDark ? "font-semibold" : "text-muted"}`}>
        {text}
      </p>
      <div
        className={`mt-2 h-1.5 w-full rounded-sm ${onDark ? "bg-bg/30" : "bg-line"}`}
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={step}
        aria-label={text}
      >
        <div
          className={`h-1.5 rounded-sm transition-[width] duration-200 ease-out ${onDark ? "bg-bg" : "bg-ink"}`}
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
    </div>
  );
}
