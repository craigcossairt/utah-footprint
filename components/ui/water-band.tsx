import { Wave } from "@/components/home/wave";

// The title band on every page after the home screen: the page starts in the lake,
// with the wave as the band's lower edge. `width` matches the page's content column.
export function WaterBand({ children, width = "max-w-5xl" }: { children: React.ReactNode; width?: string }) {
  return (
    <div className="relative mb-3 overflow-x-clip bg-lake text-bg">
      <div className={`mx-auto w-full ${width} px-4 pb-4 pt-6 lg:px-8 lg:pt-8`}>{children}</div>
      <Wave below />
    </div>
  );
}
