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

export function StepProgress({ step, total }: { step: number; total: number }) {
  return (
    <div>
      <p className="text-sm text-muted">
        Question {step} of {total}
      </p>
      <div
        className="mt-2 h-1.5 w-full rounded-sm bg-line"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={step}
        aria-label={`Question ${step} of ${total}`}
      >
        <div
          className="h-1.5 rounded-sm bg-ink transition-[width] duration-200 ease-out"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
    </div>
  );
}
