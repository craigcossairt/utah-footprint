# Gotchas

Known traps, collected from past events. One line each: the symptom, then the fix.

## Next.js and Vercel
- Vercel build fails on a type error that `next dev` ignored → run `npm run build` before every push.
- A JSON or data file read at runtime is missing in production → add it to
  `outputFileTracingIncludes` in `next.config.ts`, or import it.
- `NEXT_PUBLIC_*` values are inlined at build time → changing them in Vercel needs a redeploy, and every visitor can see them.
- A monorepo or subfolder app deploys the wrong thing → set the Vercel project's Root Directory
  in the dashboard. Don't fight it with `vercel.json`.
- Next 16 dev blocks requests from `127.0.0.1` or tunnel origins → add them to `allowedDevOrigins`.
- Env added in Vercel doesn't show up → it's scoped to the wrong environment (Preview or Production), or no redeploy happened.
- Build fails with `Route segment config "runtime" is not compatible with nextConfig.cacheComponents` → delete `export const runtime` from the route; `maxDuration` is fine.
- Serverless function timeout on slow AI calls → stream the response, or run the call in the
  background and poll. Raise `maxDuration` if the plan allows.
- Gateways and proxies can cut long-lived streams (one cut every SSE at exactly 15 s) → test a
  60-second stream against the deployed URL in the first 30 minutes.

## Supabase
- "Sensitive" env vars in Vercel or Supabase can't be read back by agents → paste the value into `.env.local` yourself.
- Postgres TLS errors during the build → use the pooler URL and set `sslmode` explicitly.
- Apply the schema from a script (`scripts/apply-schema.mjs`), not by clicking in the dashboard, so agents can rerun it.

## AI providers
- The shell has an empty `ANTHROPIC_API_KEY` (or `OPENAI_API_KEY`) exported, which overrides `.env.local` → `unset` it.
- Rate limits on small or fast models (for example 50 requests per minute) → cache, batch,
  and pre-warm the demo queries.
- SDK major versions change APIs → pin the version from the plan; don't let agents upgrade mid-event.

## Agents
- Several agents sharing one checkout keep switching its branch → one git worktree per agent.
- Deleting a branch on merge auto-closes PRs stacked on it → don't stack PRs, or retarget the
  stacked ones before deleting.
- An agent left alone overnight grows scope → give it an explicit stop condition and a freeze time.
- Review bots (CodeRabbit and similar) hit rate limits mid-event → don't depend on them.
