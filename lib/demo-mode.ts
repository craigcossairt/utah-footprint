// DEMO_MODE=fixtures: no network, saved data only. DEMO_MODE=live: real calls with saved fallbacks.
// Defaults to live so the home page shows today's readings; set fixtures on stage if Wi-Fi fails.
export type DemoMode = "fixtures" | "live";

export function demoMode(): DemoMode {
  return process.env.DEMO_MODE === "fixtures" ? "fixtures" : "live";
}
