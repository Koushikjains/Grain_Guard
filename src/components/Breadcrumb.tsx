import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
}

export function FlowBreadcrumb({
  steps,
  current,
}: {
  steps: Step[];
  current: number; // 1-indexed
}) {
  return (
    <ol className="mb-6 flex w-full items-center gap-2 overflow-x-auto rounded-xl border border-border bg-card/70 p-3 backdrop-blur sm:gap-3">
      {steps.map((s, i) => {
        const idx = i + 1;
        const done = idx < current;
        const active = idx === current;
        return (
          <li key={s.label} className="flex flex-1 items-center gap-2 sm:gap-3 min-w-0">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors",
                done && "border-primary bg-primary text-primary-foreground",
                active && "border-primary bg-primary-soft text-primary",
                !done && !active && "border-border bg-muted text-muted-foreground",
              )}
            >
              {done ? <Check className="h-4 w-4" /> : idx}
            </div>
            <span
              className={cn(
                "truncate text-xs font-medium sm:text-sm",
                active ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {s.label}
            </span>
            {idx < steps.length && (
              <div
                className={cn(
                  "ml-1 hidden h-0.5 flex-1 rounded-full sm:block",
                  done ? "bg-primary" : "bg-border",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
