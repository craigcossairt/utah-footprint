"use client";

import { ArrowLeft, ArrowRight, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ErrorNote, StepProgress } from "@/components/ui/feedback";
import { STORAGE_KEY, toQuery } from "@/lib/answers";
import type { Answers } from "@/lib/contract";

type Draft = {
  zip: string;
  household: number;
  yardChoice: "none" | "small" | "medium" | "large" | "custom" | "";
  yardCustom: string;
  drives: boolean;
  commuteMiles: number;
  heating: Answers["heating"] | "";
  kwh: string;
};

const START: Draft = {
  zip: "",
  household: 2,
  yardChoice: "",
  yardCustom: "",
  drives: true,
  commuteMiles: 10,
  heating: "",
  kwh: "",
};

// Lawn sizes are the user's own estimate, not a statistic. Each label states the size it stands for.
const YARDS = [
  { id: "none", label: "No lawn", note: "Apartment, condo, or a yard with no grass", sqFt: 0 },
  { id: "small", label: "Small", note: "About 500 square feet, like a two-car driveway", sqFt: 500 },
  { id: "medium", label: "Medium", note: "About 1,500 square feet", sqFt: 1500 },
  { id: "large", label: "Large", note: "About 3,000 square feet or more", sqFt: 3000 },
] as const;

const HEAT = [
  { id: "gas", label: "Natural gas furnace", note: "You get a gas bill" },
  { id: "electric", label: "Electric heat", note: "Baseboard or electric furnace, no gas bill" },
  { id: "heat-pump", label: "Heat pump", note: "One outdoor unit heats and cools" },
] as const;

const TOTAL = 6;

export function CheckFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [d, setD] = useState<Draft>(START);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);

  // Bring back a draft the person started earlier on this device.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}.draft`);
      if (saved) setD({ ...START, ...JSON.parse(saved) });
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}.draft`, JSON.stringify(d));
    } catch {}
  }, [d]);

  useEffect(() => {
    heading.current?.focus();
  }, [step]);

  const set = (patch: Partial<Draft>) => {
    setD((prev) => ({ ...prev, ...patch }));
    setError("");
  };

  function problem(): string {
    if (step === 1 && !/^84\d{3}$/.test(d.zip)) return "Enter a 5-digit Utah ZIP code. They start with 84.";
    if (step === 3) {
      if (!d.yardChoice) return "Pick the closest size.";
      if (d.yardChoice === "custom") {
        const n = Number(d.yardCustom);
        if (!d.yardCustom || !Number.isFinite(n) || n < 0 || n > 50000)
          return "Enter a size between 0 and 50,000 square feet.";
      }
    }
    if (step === 5 && !d.heating) return "Pick how your home is heated.";
    if (step === 6 && d.kwh) {
      const n = Number(d.kwh);
      if (!Number.isFinite(n) || n < 50 || n > 10000) return "Enter a number between 50 and 10,000, or leave it empty.";
    }
    return "";
  }

  function next() {
    const p = problem();
    if (p) return setError(p);
    if (step < TOTAL) return setStep(step + 1);

    const yardSqFt =
      d.yardChoice === "custom" ? Math.round(Number(d.yardCustom)) : (YARDS.find((y) => y.id === d.yardChoice)?.sqFt ?? 0);
    const answers: Answers = {
      zip: d.zip,
      household: d.household,
      yardSqFt,
      commuteMiles: d.drives ? d.commuteMiles : 0,
      heating: d.heating || "gas",
      ...(d.kwh ? { monthlyKwh: Math.round(Number(d.kwh)) } : {}),
    };
    setSending(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {}
    router.push(`/results?${toQuery(answers)}`);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        next();
      }}
      noValidate
    >
      <StepProgress step={step} total={TOTAL} />

      <div className="mt-8 min-h-80">
        {step === 1 && (
          <Question ref={heading} title="What is your ZIP code?" help="We use it for the air where you live.">
            <label htmlFor="zip" className="sr-only">
              ZIP code
            </label>
            <input
              id="zip"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={5}
              value={d.zip}
              onChange={(e) => set({ zip: e.target.value.replace(/\D/g, "") })}
              placeholder="84116"
              aria-invalid={!!error}
              className="num w-44 rounded-control border-2 border-ink bg-surface px-4 py-3 text-3xl font-extrabold placeholder:text-line"
            />
          </Question>
        )}

        {step === 2 && (
          <Question ref={heading} title="How many people live in your home?" help="Count everyone, including children.">
            <div className="flex items-center gap-5">
              <RoundButton label="One fewer person" disabled={d.household <= 1} onClick={() => set({ household: d.household - 1 })}>
                <Minus size={24} strokeWidth={2} aria-hidden />
              </RoundButton>
              <output className="num w-16 text-center text-5xl font-extrabold" aria-live="polite">
                {d.household}
              </output>
              <RoundButton label="One more person" disabled={d.household >= 12} onClick={() => set({ household: d.household + 1 })}>
                <Plus size={24} strokeWidth={2} aria-hidden />
              </RoundButton>
            </div>
          </Question>
        )}

        {step === 3 && (
          <Question ref={heading} title="How much lawn do you water?" help="Only the grass. A rough guess is fine.">
            <Choices
              name="yard"
              value={d.yardChoice}
              onChange={(v) => set({ yardChoice: v as Draft["yardChoice"] })}
              options={[...YARDS, { id: "custom", label: "I know the size", note: "Enter square feet" }]}
            />
            {d.yardChoice === "custom" && (
              <div className="mt-3">
                <label htmlFor="yard-size" className="text-sm font-semibold">
                  Lawn size in square feet
                </label>
                <input
                  id="yard-size"
                  inputMode="numeric"
                  value={d.yardCustom}
                  onChange={(e) => set({ yardCustom: e.target.value.replace(/\D/g, "") })}
                  className="num mt-1 block w-44 rounded-control border-2 border-ink bg-surface px-4 py-2 text-2xl font-extrabold"
                />
              </div>
            )}
          </Question>
        )}

        {step === 4 && (
          <Question ref={heading} title="How far do you drive to work or school?" help="One way, on a normal weekday.">
            <div className={d.drives ? "" : "opacity-40"}>
              <p className="flex items-baseline gap-2">
                <output className="num text-5xl font-extrabold" aria-live="polite">
                  {d.drives ? d.commuteMiles : 0}
                </output>
                <span className="text-muted">miles one way</span>
              </p>
              <label htmlFor="miles" className="sr-only">
                Miles one way
              </label>
              <input
                id="miles"
                type="range"
                min={1}
                max={60}
                value={d.commuteMiles}
                disabled={!d.drives}
                onChange={(e) => set({ commuteMiles: Number(e.target.value) })}
                className="mt-4 h-10 w-full accent-accent"
              />
            </div>
            <label className="mt-4 flex min-h-12 items-center gap-3">
              <input
                type="checkbox"
                checked={!d.drives}
                onChange={(e) => set({ drives: !e.target.checked })}
                className="size-6 accent-accent"
              />
              I don&apos;t drive to work or school
            </label>
          </Question>
        )}

        {step === 5 && (
          <Question ref={heading} title="How is your home heated?" help="If you have a furnace and a gas bill, pick natural gas.">
            <Choices name="heat" value={d.heating} onChange={(v) => set({ heating: v as Draft["heating"] })} options={HEAT} />
          </Question>
        )}

        {step === 6 && (
          <Question
            ref={heading}
            title="How much electricity do you use in a month?"
            help="It is on your power bill, in kWh. If you don't know, leave it empty and we will use the Utah average and say so."
          >
            <label htmlFor="kwh" className="sr-only">
              Kilowatt-hours per month
            </label>
            <div className="flex items-baseline gap-2">
              <input
                id="kwh"
                inputMode="numeric"
                value={d.kwh}
                onChange={(e) => set({ kwh: e.target.value.replace(/\D/g, "") })}
                aria-invalid={!!error}
                className="num w-44 rounded-control border-2 border-ink bg-surface px-4 py-3 text-3xl font-extrabold"
              />
              <span className="text-muted">kWh per month</span>
            </div>
          </Question>
        )}

        {error ? <ErrorNote>{error}</ErrorNote> : null}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        {step > 1 ? (
          <Button type="button" variant="ghost" onClick={() => (setError(""), setStep(step - 1))}>
            <ArrowLeft size={20} strokeWidth={2} aria-hidden /> Back
          </Button>
        ) : (
          <span />
        )}
        <Button type="submit" disabled={sending}>
          {step < TOTAL ? "Next" : sending ? "Working it out" : "Show my footprint"}
          <ArrowRight size={20} strokeWidth={2} aria-hidden />
        </Button>
      </div>
    </form>
  );
}

function Question({
  ref,
  title,
  help,
  children,
}: {
  ref: React.Ref<HTMLHeadingElement>;
  title: string;
  help: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset>
      <legend>
        <h1 ref={ref} tabIndex={-1} className="text-3xl font-extrabold outline-none">
          {title}
        </h1>
      </legend>
      <p className="mt-2 text-muted">{help}</p>
      <div className="mt-6">{children}</div>
    </fieldset>
  );
}

function RoundButton({
  label,
  children,
  ...props
}: { label: string; children: React.ReactNode } & React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex size-14 items-center justify-center rounded-full border-2 border-ink transition-colors duration-150 hover:bg-ink hover:text-bg disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
      {...props}
    >
      {children}
    </button>
  );
}

function Choices({
  name,
  value,
  onChange,
  options,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly { id: string; label: string; note: string }[];
}) {
  return (
    <div className="grid gap-2">
      {options.map((o) => (
        <label
          key={o.id}
          className="flex min-h-14 cursor-pointer items-center gap-3 rounded-control border-2 border-line bg-surface px-4 py-2 has-checked:border-ink has-focus-visible:outline-3 has-focus-visible:outline-accent"
        >
          <input
            type="radio"
            name={name}
            value={o.id}
            checked={value === o.id}
            onChange={() => onChange(o.id)}
            className="size-5 accent-accent"
          />
          <span>
            <span className="block font-semibold">{o.label}</span>
            <span className="block text-sm text-muted">{o.note}</span>
          </span>
        </label>
      ))}
    </div>
  );
}
