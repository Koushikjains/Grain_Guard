export function Watermark({ text = "GRAINGUARD" }: { text?: string }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden select-none"
    >
      <span
        className="font-display font-black tracking-tighter text-foreground/[0.035] dark:text-foreground/[0.05] whitespace-nowrap"
        style={{ fontSize: "clamp(4rem, 15vw, 24rem)", letterSpacing: "-0.05em" }}
      >
        {text}
      </span>
    </div>
  );
}
