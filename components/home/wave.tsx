// The moving surface of the lake. Twenty identical crests, drawn twice the width of the screen,
// so sliding it left by half loops without a seam. The wrapper clips it, so it never widens the page. Decorative: the level is stated in text.
const SURFACE = `M0 6${" q30 -6 60 0 t60 0".repeat(20)} V12 H0 Z`;

export function Wave() {
  return (
    <div aria-hidden className="absolute inset-x-0 bottom-full -mb-px h-3 overflow-hidden">
      <svg viewBox="0 0 2400 12" preserveAspectRatio="none" className="waterline-wave h-full fill-lake">
        <path d={SURFACE} />
      </svg>
    </div>
  );
}
