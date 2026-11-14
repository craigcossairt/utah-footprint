// The moving surface of the lake. Twenty identical crests, drawn twice the width of the screen,
// so sliding it left by half loops without a seam. Decorative: the level is stated in text.
const SURFACE = `M0 6${" q30 -6 60 0 t60 0".repeat(20)} V12 H0 Z`;

export function Wave({ below = false }: { below?: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 2400 12"
      preserveAspectRatio="none"
      className={`waterline-wave absolute left-0 h-3 fill-lake ${below ? "top-full -mt-px -scale-y-100" : "bottom-full -mb-px"}`}
    >
      <path d={SURFACE} />
    </svg>
  );
}
