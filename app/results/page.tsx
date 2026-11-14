import { areas } from "@/lib/areas";
import { sample } from "@/lib/sample";

export default function Results() {
  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold">{sample.name}, {sample.neighborhood}</h1>
      <div className="mt-6 space-y-6">
        {areas.map(({ area, Card }) => (
          <Card key={area.id} result={area.calculate(sample.answers)} />
        ))}
      </div>
    </main>
  );
}
