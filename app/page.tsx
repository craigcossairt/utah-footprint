import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-3xl font-bold">My Utah Footprint</h1>
      <p className="mt-4">Six questions. See your water, power and air numbers, and what to change first.</p>
      <Link className="mt-6 inline-block underline" href="/results">See a sample home</Link>
    </main>
  );
}
