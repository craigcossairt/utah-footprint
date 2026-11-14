"use client";

import { MessageCircleQuestion, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SourceLink } from "@/components/ui/area-card";
import { Button } from "@/components/ui/button";
import { ErrorNote, Skeleton } from "@/components/ui/feedback";
import type { Answers } from "@/lib/contract";
import type { AskReply, Citation, Lang, PlanReply } from "@/lib/gemini";

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

function originNote(o: PlanReply["origin"]): string {
  if (o === "gemini" || o === "cache") return "Written by Gemini from the facts listed below.";
  if (o === "saved") return "A saved Gemini answer, shown because the live call didn't come back.";
  if (o === "template") return "Gemini isn't available, so this comes straight from our formulas.";
  return "";
}

export function Assistant({ answers, lang = "en" }: { answers: Answers; lang?: Lang }) {
  const [planState, setPlan] = useState<PlanReply | "loading" | "error">("loading");
  const [slow, setSlow] = useState(false);

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
        Your plan, in plain words
      </h2>
      <p className="mt-3 flex max-w-3xl items-start gap-2 border-l-4 border-lake pl-3 text-sm">
        <ShieldCheck size={20} strokeWidth={2} className="mt-0.5 shrink-0 text-lake" aria-hidden />
        <span>
          <strong>Our formulas do the math. Gemini only explains it.</strong> It sees the results above and our sourced
          facts, never your ZIP code or name. It must name the facts it used, and we block any answer with a number
          that isn&apos;t in our data.
        </span>
      </p>

      <div className="mt-6 grid gap-12 lg:grid-cols-2 lg:gap-10" aria-live="polite">
        <div>
          {planState === "loading" ? (
            <div>
              <p className="text-sm font-semibold">Gemini is reading your numbers…</p>
              <div className="mt-3 space-y-3">
                <Skeleton className="h-5 w-11/12" />
                <Skeleton className="h-5 w-9/12" />
                <Skeleton className="h-5 w-10/12" />
              </div>
              {slow ? (
                <p className="mt-3 text-sm text-muted">
                  Still working. If it takes more than 15 seconds, we show the plan from our formulas instead.
                </p>
              ) : null}
            </div>
          ) : planState === "error" ? (
            <ErrorNote>We couldn&apos;t load the plan. The top changes above come from the same numbers.</ErrorNote>
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
              <p className="mt-4 text-sm text-muted">{originNote(planState.origin)}</p>
              <Citations items={planState.citations} />
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
        <MessageCircleQuestion size={22} strokeWidth={2} aria-hidden /> Ask about your numbers
      </h3>
      <form
        className="mt-3 flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          send(q);
        }}
      >
        <label htmlFor="ask" className="sr-only">
          Your question
        </label>
        <input
          ref={input}
          id="ask"
          value={q}
          maxLength={300}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Does my lawn really affect the lake?"
          className="min-h-12 flex-1 rounded-control border-2 border-ink bg-surface px-3 py-2"
        />
        <Button type="submit" variant="secondary" disabled={state?.loading}>
          {state?.loading ? "Asking" : "Ask Gemini"}
        </Button>
      </form>
      <p className="mt-3 text-sm text-muted">Or try one:</p>
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
            <p className="text-sm font-semibold">Gemini is checking our facts…</p>
            <div className="mt-3 space-y-3">
              <Skeleton className="h-5 w-11/12" />
              <Skeleton className="h-5 w-8/12" />
            </div>
          </div>
        ) : state?.error ? (
          <ErrorNote>{state.q ? "That didn't go through. Try again in a moment." : "Type a question first."}</ErrorNote>
        ) : state?.reply ? (
          <div className="border-l-4 border-ink pl-3">
            <p className="text-sm text-muted">You asked: {state.q}</p>
            <p className="mt-2 text-lg">{state.reply.answer}</p>
            {!state.reply.covered && state.reply.origin !== "unavailable" ? (
              <p className="mt-2 text-sm text-muted">
                None of our sourced facts answer this, so Gemini doesn&apos;t guess. See all our facts on the{" "}
                <a href="/sources" className="underline underline-offset-4">
                  Sources page
                </a>
                .
              </p>
            ) : null}
            <Citations items={state.reply.citations} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Citations({ items }: { items: Citation[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-3">
      <p className="text-sm font-semibold">Facts used</p>
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
