"use client";

import { ArrowLeft, ArrowRight, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { BillUpload } from "@/components/check/bill-upload";
import { CommuteRoute } from "@/components/check/commute-route";
import { ErrorNote, StepProgress } from "@/components/ui/feedback";
import { WaterBand } from "@/components/ui/water-band";
import { STORAGE_KEY, toQuery } from "@/lib/answers";
import { mapsAvailable } from "@/lib/maps-browser";
import { YardMap } from "./yard-map";
import { VEHICLES, type Answers, type Lang, type Vehicle } from "@/lib/contract";

type Draft = {
  zip: string;
  household: number;
  yardChoice: "none" | "small" | "medium" | "large" | "custom" | "";
  yardCustom: string;
  drives: boolean;
  commuteMiles: number;
  vehicle: Vehicle;
  otherMiles: string;
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
  vehicle: "gas",
  otherMiles: "",
  heating: "",
  kwh: "",
};

// Lawn sizes are the user's own estimate, not a statistic. Each label states the size it stands for.
const COPY = {
  en: {
    yards: ["No lawn", "Apartment, condo, or a yard with no grass", "Small", "About 500 square feet, like a two-car driveway", "Medium", "About 1,500 square feet", "Large", "About 3,000 square feet or more"],
    heat: ["Natural gas furnace", "You get a gas bill", "Electric heat", "Baseboard or electric furnace, no gas bill", "Heat pump", "One outdoor unit heats and cools"],
    custom: ["I know the size", "Enter square feet"],
    measure: ["Measure your lawn on a map", "Or pick the closest size", "Measure again"],
    measured: (n: string) => `Lawn set to ${n} sq ft from the map.`,
    errZip: "Enter a 5-digit Utah ZIP code. They start with 84.",
    errYard: "Pick the closest size.",
    errYardSize: "Enter a size between 0 and 50,000 square feet.",
    errHeat: "Pick how your home is heated.",
    errKwh: "Enter a number between 50 and 10,000, or leave it empty.",
    q1: ["What is your ZIP code?", "We use it for the air where you live.", "ZIP code"],
    q2: ["How many people live in your home?", "Count everyone, including children.", "One fewer person", "One more person"],
    q3: ["How much lawn do you water?", "Only the grass. A rough guess is fine.", "Lawn size in square feet"],
    q4: ["How far do you drive to work or school?", "One way, on a normal weekday.", "miles one way", "Miles one way", "I don't drive to work or school"],
    otherDrive: ["Other driving on a typical day (optional)", "Errands, school drop-off, trips. Leave it empty if you're not sure.", "miles a day"],
    errOther: "Enter a number of miles between 0 and 300, or leave it empty.",
    car: "What does the car run on?",
    cars: { gas: "Gasoline", hybrid: "Hybrid (no plug)", plugin: "Plug-in hybrid", electric: "Electric", diesel: "Diesel", "natural-gas": "Natural gas", hydrogen: "Hydrogen fuel cell" },
    q5: ["How is your home heated?", "If you have a furnace and a gas bill, pick natural gas."],
    q6: ["How much electricity do you use in a month?", "It is on your power bill, in kWh. If you don't know, leave it empty and we will use the Utah average and say so.", "Kilowatt-hours per month", "kWh per month"],
    back: "Back",
    next: "Next",
    working: "Working it out",
    show: "Show my footprint",
    progress: (n: number, t: number) => `Question ${n} of ${t}`,
    other: "En español",
    need: [
      "What you'll need (about 2 minutes)",
      "Your ZIP code",
      "How many people live in your home",
      "About how much lawn you water (a rough guess is fine)",
      "How far you drive to work or school, one way",
      "How your home is heated: gas, electric or heat pump",
      "Optional: your monthly kWh from your power bill",
    ],
  },
  es: {
    yards: ["Sin césped", "Apartamento, condominio o un patio sin pasto", "Pequeño", "Unos 500 pies cuadrados, como una entrada para dos carros", "Mediano", "Unos 1,500 pies cuadrados", "Grande", "Unos 3,000 pies cuadrados o más"],
    heat: ["Calentador de gas natural", "Recibe una factura de gas", "Calefacción eléctrica", "Zócalos o calentador eléctrico, sin factura de gas", "Bomba de calor", "Una unidad afuera que calienta y enfría"],
    custom: ["Sé el tamaño", "Escriba los pies cuadrados"],
    measure: ["Mida su césped en un mapa", "O elija el tamaño más parecido", "Medir otra vez"],
    measured: (n: string) => `Césped de ${n} pies cuadrados, medido en el mapa.`,
    errZip: "Escriba un código postal de Utah de 5 dígitos. Empiezan con 84.",
    errYard: "Elija el tamaño más parecido.",
    errYardSize: "Escriba un tamaño entre 0 y 50,000 pies cuadrados.",
    errHeat: "Elija cómo se calienta su hogar.",
    errKwh: "Escriba un número entre 50 y 10,000, o déjelo vacío.",
    q1: ["¿Cuál es su código postal?", "Lo usamos para el aire donde usted vive.", "Código postal"],
    q2: ["¿Cuántas personas viven en su hogar?", "Cuente a todos, también a los niños.", "Una persona menos", "Una persona más"],
    q3: ["¿Cuánto césped riega?", "Solo el pasto. Un cálculo aproximado está bien.", "Tamaño del césped en pies cuadrados"],
    q4: ["¿Qué tan lejos maneja al trabajo o a la escuela?", "Solo ida, en un día normal entre semana.", "millas de ida", "Millas de ida", "No manejo al trabajo ni a la escuela"],
    otherDrive: ["Otras millas que maneja en un día normal (opcional)", "Mandados, llevar a los niños, paseos. Déjelo vacío si no está seguro.", "millas al día"],
    errOther: "Escriba entre 0 y 300 millas, o déjelo vacío.",
    car: "¿Con qué funciona el carro?",
    cars: { gas: "Gasolina", hybrid: "Híbrido (sin enchufe)", plugin: "Híbrido enchufable", electric: "Eléctrico", diesel: "Diésel", "natural-gas": "Gas natural", hydrogen: "Celda de hidrógeno" },
    q5: ["¿Cómo se calienta su hogar?", "Si tiene calentador y factura de gas, elija gas natural."],
    q6: ["¿Cuánta electricidad usa al mes?", "Está en su factura de luz, en kWh. Si no lo sabe, déjelo vacío y usaremos el promedio de Utah, y lo diremos.", "Kilovatios-hora al mes", "kWh al mes"],
    back: "Atrás",
    next: "Siguiente",
    working: "Calculando",
    show: "Ver mi huella",
    progress: (n: number, t: number) => `Pregunta ${n} de ${t}`,
    other: "In English",
    need: [
      "Lo que necesitará (unos 2 minutos)",
      "Su código postal",
      "Cuántas personas viven en su hogar",
      "Más o menos cuánto césped riega (un cálculo aproximado está bien)",
      "Qué tan lejos maneja al trabajo o a la escuela, solo ida",
      "Cómo se calienta su hogar: gas, eléctrica o bomba de calor",
      "Opcional: sus kWh al mes, de su factura de luz",
    ],
  },
};

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
  const [lang, setLang] = useState<Lang>("en");
  const [showMap, setShowMap] = useState(true);
  const [canMap, setCanMap] = useState(false);
  useEffect(() => setCanMap(mapsAvailable()), []);
  const c = COPY[lang];
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("lang") === "es") setLang("es");
  }, []);
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
    if (step === 1 && !/^84\d{3}$/.test(d.zip)) return c.errZip;
    if (step === 3) {
      if (!d.yardChoice) return c.errYard;
      if (d.yardChoice === "custom") {
        const n = Number(d.yardCustom);
        if (!d.yardCustom || !Number.isFinite(n) || n < 0 || n > 50000)
          return c.errYardSize;
      }
    }
    if (step === 4 && d.otherMiles) {
      const n = Number(d.otherMiles);
      if (!Number.isFinite(n) || n < 0 || n > 300) return c.errOther;
    }
    if (step === 5 && !d.heating) return c.errHeat;
    if (step === 6 && d.kwh) {
      const n = Number(d.kwh);
      if (!Number.isFinite(n) || n < 50 || n > 10000) return c.errKwh;
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
      ...((d.drives || Number(d.otherMiles) > 0) && d.vehicle !== "gas" ? { vehicle: d.vehicle } : {}),
      ...(Number(d.otherMiles) > 0 ? { otherMilesPerDay: Math.round(Number(d.otherMiles)) } : {}),
      heating: d.heating || "gas",
      ...(d.kwh ? { monthlyKwh: Math.round(Number(d.kwh)) } : {}),
    };
    setSending(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {}
    router.push(`/results?${toQuery(answers)}${lang === "es" ? "&lang=es" : ""}`);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        next();
      }}
      noValidate
    >
      <WaterBand width="max-w-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <StepProgress onDark step={step} total={TOTAL} label={c.progress(step, TOTAL)} />
        </div>
        <button
          type="button"
          lang={lang === "es" ? "en" : "es"}
          onClick={() => {
            const next = lang === "es" ? "en" : "es";
            setLang(next);
            window.history.replaceState(null, "", next === "es" ? "/check?lang=es" : "/check");
          }}
          className="min-h-12 text-sm font-semibold underline underline-offset-4"
        >
          {c.other}
        </button>
      </div>
      </WaterBand>
      <div className="mx-auto w-full max-w-xl px-4 py-6 lg:px-8">

      {step === 1 && (
        <section aria-labelledby="need-title" className="mt-4 border-l-4 border-line pl-3 text-sm">
          <h2 id="need-title" className="font-semibold">
            {c.need[0]}
          </h2>
          <ol className="mt-1 list-decimal pl-5 text-muted">
            {c.need.slice(1).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>
      )}

      {/* Question 1 carries the "What you'll need" list, so it gets less reserved space to keep Next on a phone screen. */}
      <div className={step === 1 ? "mt-6 min-h-40" : "mt-8 min-h-80"}>
        {step === 1 && (
          <Question ref={heading} title={c.q1[0]} help={c.q1[1]}>
            <label htmlFor="zip" className="sr-only">
              {c.q1[2]}
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
          <Question ref={heading} title={c.q2[0]} help={c.q2[1]}>
            <div className="flex items-center gap-5">
              <RoundButton label={c.q2[2]} disabled={d.household <= 1} onClick={() => set({ household: d.household - 1 })}>
                <Minus size={24} strokeWidth={2} aria-hidden />
              </RoundButton>
              <output className="num w-16 text-center text-5xl font-extrabold" aria-live="polite">
                {d.household}
              </output>
              <RoundButton label={c.q2[3]} disabled={d.household >= 12} onClick={() => set({ household: d.household + 1 })}>
                <Plus size={24} strokeWidth={2} aria-hidden />
              </RoundButton>
            </div>
          </Question>
        )}

        {step === 3 && (
          <Question ref={heading} title={c.q3[0]} help={c.q3[1]}>
            {canMap && (
              <div className="mb-6">
                <p className="font-semibold">{c.measure[0]}</p>
                {showMap ? (
                  <YardMap
                    lang={lang}
                    onUse={(sq) => {
                      set({ yardChoice: "custom", yardCustom: String(sq) });
                      setShowMap(false);
                    }}
                  />
                ) : (
                  <p className="mt-2 flex flex-wrap items-center gap-x-3" role="status">
                    {c.measured(Number(d.yardCustom || 0).toLocaleString("en-US"))}
                    <button
                      type="button"
                      onClick={() => setShowMap(true)}
                      className="min-h-11 text-sm font-semibold underline underline-offset-4"
                    >
                      {c.measure[2]}
                    </button>
                  </p>
                )}
                <p className="mt-6 border-t-2 border-line pt-4 font-semibold">{c.measure[1]}</p>
              </div>
            )}
            <Choices
              name="yard"
              value={d.yardChoice}
              onChange={(v) => set({ yardChoice: v as Draft["yardChoice"] })}
              options={[...YARDS.map((y, i) => ({ ...y, label: c.yards[i * 2], note: c.yards[i * 2 + 1] })), { id: "custom", label: c.custom[0], note: c.custom[1] }]}
            />
            {d.yardChoice === "custom" && (
              <div className="mt-3">
                <label htmlFor="yard-size" className="text-sm font-semibold">
                  {c.q3[2]}
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
          <Question ref={heading} title={c.q4[0]} help={c.q4[1]}>
            <div className={d.drives ? "" : "opacity-40"}>
              <p className="flex items-baseline gap-2">
                <output className="num text-5xl font-extrabold" aria-live="polite">
                  {d.drives ? d.commuteMiles : 0}
                </output>
                <span className="text-muted">{c.q4[2]}</span>
              </p>
              <label htmlFor="miles" className="sr-only">
                {c.q4[3]}
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
              <CommuteRoute lang={lang} disabled={!d.drives} max={60} onMiles={(m) => set({ commuteMiles: m })} />
              <label htmlFor="car" className="mt-4 block font-semibold">
                {c.car}
              </label>
              <select
                id="car"
                value={d.vehicle}
                disabled={!d.drives && !(Number(d.otherMiles) > 0)}
                onChange={(e) => set({ vehicle: e.target.value as Vehicle })}
                className="mt-1 block min-h-12 w-full rounded-control border-2 border-ink bg-surface px-3 py-2 text-base"
              >
                {VEHICLES.map((v) => (
                  <option key={v} value={v}>
                    {c.cars[v]}
                  </option>
                ))}
              </select>
            </div>
            <label className="mt-4 flex min-h-12 items-center gap-3">
              <input
                type="checkbox"
                checked={!d.drives}
                onChange={(e) => set({ drives: !e.target.checked })}
                className="size-6 accent-accent"
              />
              {c.q4[4]}
            </label>
            <div className="mt-4">
              <label htmlFor="other-miles" className="block font-semibold">
                {c.otherDrive[0]}
              </label>
              <p className="text-sm text-muted">{c.otherDrive[1]}</p>
              <p className="mt-1 flex items-baseline gap-2">
                <input
                  id="other-miles"
                  inputMode="numeric"
                  value={d.otherMiles}
                  onChange={(e) => set({ otherMiles: e.target.value.replace(/\D/g, "") })}
                  className="num block w-28 rounded-control border-2 border-ink bg-surface px-3 py-2 text-xl font-extrabold"
                />
                <span className="text-muted">{c.otherDrive[2]}</span>
              </p>
            </div>
          </Question>
        )}

        {step === 5 && (
          <Question ref={heading} title={c.q5[0]} help={c.q5[1]}>
            <Choices name="heat" value={d.heating} onChange={(v) => set({ heating: v as Draft["heating"] })} options={HEAT.map((h, i) => ({ ...h, label: c.heat[i * 2], note: c.heat[i * 2 + 1] }))} />
          </Question>
        )}

        {step === 6 && (
          <Question
            ref={heading}
            title={c.q6[0]}
            help={c.q6[1]}
          >
            <label htmlFor="kwh" className="sr-only">
              {c.q6[2]}
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
              <span className="text-muted">{c.q6[3]}</span>
            </div>
            <BillUpload lang={lang} onUse={(kwh) => (setError(""), set({ kwh }))} />
          </Question>
        )}

        {error ? <ErrorNote>{error}</ErrorNote> : null}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        {step > 1 ? (
          <Button type="button" variant="ghost" onClick={() => (setError(""), setStep(step - 1))}>
            <ArrowLeft size={20} strokeWidth={2} aria-hidden /> {c.back}
          </Button>
        ) : (
          <span />
        )}
        <Button type="submit" disabled={sending}>
          {step < TOTAL ? c.next : sending ? c.working : c.show}
          <ArrowRight size={20} strokeWidth={2} aria-hidden />
        </Button>
      </div>
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
