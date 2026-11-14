import type { AreaResult } from "@/lib/contract";

export default function Card({ result }: { result: AreaResult }) {
  return (
    <section>
      <h2>Water</h2>
      <p>{result.summary}</p>
    </section>
  );
}
