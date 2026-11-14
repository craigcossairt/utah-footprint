import type { Metadata } from "next";
import { CheckFlow } from "@/components/check/check-flow";

export const metadata: Metadata = { title: "Check my home | EcoSwitch" };

export default function CheckPage() {
  return (
    <main className="mx-auto w-full max-w-xl px-4 py-6 lg:py-12">
      <CheckFlow />
    </main>
  );
}
