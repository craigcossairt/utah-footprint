"use client";

import { MessageCircleQuestion, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SourceLink } from "@/components/ui/area-card";
import { Button } from "@/components/ui/button";
import { ErrorNote, Skeleton } from "@/components/ui/feedback";
import type { Answers } from "@/lib/contract";
import type { AskReply, Citation, Lang, PlanReply } from "@/lib/gemini";
import { t, type Dict } from "@/lib/i18n";

const QUESTIONS = {
  en: ["Does my lawn really affect the lake?", "Which change should I make first?", "Why is my air number so high?"],
  es: ["¿Mi césped de verdad afecta al lago?", "¿Qué cambio debo hacer primero?", "¿Por qué mi número de aire es tan alto?"],
};

async function post<T>(url: string, body: object): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(25000),
  });
  if (!res.ok) throw new Error(String(res.status));
  return res.json();
}

function originNote(o: PlanReply["origin"], d: Dict): string {
  if (o === "gemini" || o === "cache") return d.origin.gemini;
  if (o === "saved") return d.origin.saved;
  if (o === "template") return d.origin.template;
  return "";
}

export function Assistant({ answers, lang = "en" }: { answers: Answers; lang?: Lang }) {
  const [planState, setPlan] = useState<PlanReply | "loading" | "error">("loading");
  const [slow, setSlow] = useState(false);
  const d = t[lang];

  useEffect(() => {
    let live = true;
    setPlan("loading");
    setSlow(false);
    const t = setTimeout(() => live && setSlow(true), 5000);
    post<PlanReply>("/api/plan", { answers, lang })
      .then((p) => live && setPlan(p))
      .catch(() => live && setPlan("error"))
      .finally(() => clearTimeout(t));
    return () => {
      live = false;
      clearTimeout(t);
    };
  }, [answers, lang]);

  return (
    <section aria-labelledby="plan-heading" className="border-t-4 border-ink pt-4">
      <h2 id="plan-heading" className="text-2xl font-extrabold lg:text-3xl">
        {d.planTitle}
      </h2>
      <p className="mt-3 flex max-w-3xl items-start gap-2 border-l-4 border-lake pl-3 text-sm">
        <ShieldCheck size={20} strokeWidth={2} className="mt-0.5 shrink-0 text-lake" aria-hidden />
        <span>
          <strong>{d.trustLead}</strong> {d.trust}
        </span>
      </p>

      <div className="mt-6 grid gap-12 lg:grid-cols-2 lg:gap-10" aria-live="polite">
        <div>
          {planState === "loading" ? (
            <div>
              <p className="text-sm font-semibold">{d.reading}</p>
              <div className="mt-3 space-y-3">
                <Skeleton className="h-5 w-11/12" />
                <Skeleton className="h-5 w-9/12" />
                <Skeleton className="h-5 w-10/12" />
              </div>
              {slow ? (
                <p className="mt-3 text-sm text-muted">
                  {d.slow}
                </p>
              ) : null}
            </div>
          ) : planState === "error" ? (
            <ErrorNote>{d.planError}</ErrorNote>
          ) : (
            <div>
              <p className="text-lg">{planState.intro}</p>
              <ol className="mt-4 space-y-4">
                {planState.steps.map((s, i) => (
                  <li key={i} className="grid grid-cols-[2rem_1fr] gap-3">
                    <span className="num text-2xl font-extrabold text-muted" aria-hidden>
                      {i + 1}
                    </span>
                    <p>{s.text}</p>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-sm text-muted">{originNote(planState.origin, d)}</p>
              <Citations items={planState.citations} d={d} />
            </div>
          )}
        </div>
        <AskBox answers={answers} lang={lang} />
      </div>
    </section>
  );
}

function AskBox({ answers, lang }: { answers: Answers; lang: Lang }) {
  const [q, setQ] = useState("");
  const [state, setState] = useState<{ q: string; reply?: AskReply; error?: boolean; loading?: boolean } | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const d = t[lang];

  async function send(question: string) {
    const text = question.trim();
    if (!text) {
      setState({ q: "", error: true });
      input.current?.focus();
      return;
    }
    setQ(text);
    setState({ q: text, loading: true });
    try {
      const reply = await post<AskReply>("/api/ask", { answers, question: text, lang });
      setState({ q: text, reply });
    } catch {
      setState({ q: text, error: true });
    }
  }

  return (
    <div>
      <h3 className="flex items-center gap-2 text-xl font-extrabold">
        <MessageCircleQuestion size={22} strokeWidth={2} aria-hidden /> {d.askTitle}
      </h3>
      <form
        className="mt-3 flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          send(q);
        }}
      >
        <label htmlFor="ask" className="sr-only">
          {d.askLabel}
        </label>
        <input
          ref={input}
          id="ask"
          value={q}
          maxLength={300}
          onChange={(e) => setQ(e.target.value)}
          placeholder={QUESTIONS[lang][0]}
          className="min-h-12 flex-1 rounded-control border-2 border-ink bg-surface px-3 py-2"
        />
        <Button type="submit" variant="secondary" disabled={state?.loading}>
          {state?.loading ? d.asking : d.askButton}
        </Button>
      </form>
      <p className="mt-3 text-sm text-muted">{d.tryOne}</p>
      <ul className="mt-1 space-y-1">
        {QUESTIONS[lang].map((s) => (
          <li key={s}>
            <button type="button" onClick={() => send(s)} className="text-left text-sm underline underline-offset-4 hover:text-accent">
              {s}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-5">
        {state?.loading ? (
          <div>
            <p className="text-sm font-semibold">{d.checking}</p>
            <div className="mt-3 space-y-3">
              <Skeleton className="h-5 w-11/12" />
              <Skeleton className="h-5 w-8/12" />
            </div>
          </div>
        ) : state?.error ? (
          <ErrorNote>{state.q ? d.askError : d.askEmpty}</ErrorNote>
        ) : state?.reply ? (
          <div className="border-l-4 border-ink pl-3">
            <p className="text-sm text-muted">{d.youAsked} {state.q}</p>
            <p className="mt-2 text-lg">{state.reply.answer}</p>
            {!state.reply.covered && state.reply.origin !== "unavailable" ? (
              <p className="mt-2 text-sm text-muted">
                {d.noSource}{" "}
                <a href="/sources" className="underline underline-offset-4">
                  {d.sourcesPage}
                </a>
                .
              </p>
            ) : null}
            <Citations items={state.reply.citations} d={d} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Citations({ items, d }: { items: Citation[]; d: Dict }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-3">
      <p className="text-sm font-semibold">{d.factsUsed}</p>
      <ul className="mt-1 space-y-1">
        {items.map((c) => (
          <li key={c.key} className="text-sm">
            {c.url.startsWith("http") ? (
              <SourceLink href={c.url}>{c.label}</SourceLink>
            ) : (
              <a href={c.url} className="text-lake underline underline-offset-4">
                {c.label}
              </a>
            )}{" "}
            <code className="text-xs text-muted">{c.key}</code>
          </li>
        ))}
      </ul>
    </div>
  );
}
