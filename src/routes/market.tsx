import { createFileRoute } from "@tanstack/react-router";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart,
  Sparkles,
  Calendar,
  Wheat,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { useApp } from "@/lib/app-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Crown, Lock } from "lucide-react";

export const Route = createFileRoute("/market")({
  head: () => ({
    meta: [
      { title: "Market Insights — GrainGuard" },
      {
        name: "description",
        content:
          "Trend analysis and crop selling predictions to help farmers sell at the right time.",
      },
      { property: "og:title", content: "Market Insights — GrainGuard" },
      { property: "og:description", content: "Crop price trends and AI selling predictions." },
    ],
  }),
  component: Market,
});

function Market() {
  const { t, role, user } = useApp();

  // Frontend-only static placeholder; backend will provide real data.
  const trends = [
    { crop: "Rice", change: 4.2, dir: "up" as const },
    { crop: "Wheat", change: -1.8, dir: "down" as const },
    { crop: "Maize", change: 2.5, dir: "up" as const },
    { crop: "Ragi", change: 6.1, dir: "up" as const },
  ];

  if (role === "owner" && user?.membership === "Basic") {
    return (
      <PageShell>
        <section className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
          <div className="rounded-3xl border-2 border-primary/20 bg-primary/5 p-10 shadow-[var(--shadow-elevated)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <Crown className="h-16 w-16 text-primary/10" />
            </div>
            <Lock className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-6 text-3xl font-black text-foreground">
              {t("Prime Feature", "ಪ್ರೀಮಿಯಂ ವೈಶಿಷ್ಟ್ಯ")}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-md mx-auto">
              {t(
                "Market Insights are exclusive to Prime Owners. Upgrade to get AI predictions and regional price trends.",
                "ಮಾರುಕಟ್ಟೆ ಒಳನೋಟಗಳು ಪ್ರೈಮ್ ಮಾಲೀಕರಿಗೆ ಮಾತ್ರ ಮೀಸಲು. AI ಮುನ್ಸೂಚನೆಗಳನ್ನು ಪಡೆಯಲು ಅಪ್‌ಗ್ರೇಡ್ ಮಾಡಿ."
              )}
            </p>
            <Button size="lg" className="mt-8 gap-2 rounded-full h-12 px-8" onClick={() => alert('Redirecting to payment gateway...')}>
              <Crown className="h-4 w-4" />
              {t("Upgrade to Prime - ₹999/mo", "ಪ್ರೀಮಿಯಂಗೆ ಅಪ್‌ಗ್ರೇಡ್ ಮಾಡಿ - ₹999/ತಿಂಗಳು")}
            </Button>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{t("Market Insights", "ಮಾರುಕಟ್ಟೆ ಒಳನೋಟ")}</h1>
            <p className="mt-1 text-muted-foreground">
              {t(
                "Trend analysis and selling predictions for your crops.",
                "ನಿಮ್ಮ ಬೆಳೆಗಳಿಗೆ ಟ್ರೆಂಡ್ ಮತ್ತು ಮಾರಾಟ ಮುನ್ಸೂಚನೆಗಳು.",
              )}
            </p>
          </div>
          <span className="hidden items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-foreground sm:inline-flex">
            <Calendar className="h-3 w-3" /> {new Date().toLocaleDateString()}
          </span>
        </div>

        {/* Trend cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trends.map((t2) => (
            <div
              key={t2.crop}
              className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                  <Wheat className="h-4 w-4" />
                  {t2.crop}
                </span>
                {t2.dir === "up" ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
              </div>
              <div
                className={cn(
                  "mt-2 text-3xl font-bold",
                  t2.dir === "up" ? "text-success" : "text-destructive",
                )}
              >
                {t2.dir === "up" ? "+" : ""}
                {t2.change}%
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {t("vs last week", "ಕಳೆದ ವಾರಕ್ಕೆ")}
              </div>
            </div>
          ))}
        </div>

        {/* Price chart placeholder */}
        <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LineChart className="h-4 w-4 text-primary" />
              <h2 className="font-semibold">
                {t("Price trend (last 12 weeks)", "ಬೆಲೆ ಟ್ರೆಂಡ್ (ಕಳೆದ 12 ವಾರಗಳು)")}
              </h2>
            </div>
            <span className="text-xs text-muted-foreground">
              {t("Auto-refreshed", "ಸ್ವಯಂ-ರಿಫ್ರೆಶ್")}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-12 items-end gap-2 h-44">
            {Array.from({ length: 12 }).map((_, i) => {
              const h = 30 + Math.abs(Math.sin(i * 0.7)) * 60;
              return (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-primary to-secondary"
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[10px] text-muted-foreground">W{i + 1}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI prediction */}
        <div className="mt-6 rounded-xl border border-primary/30 bg-primary-soft/40 p-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">{t("AI Selling Prediction", "AI ಮಾರಾಟ ಮುನ್ಸೂಚನೆ")}</h2>
            </div>
            <div className="flex items-center gap-3">
              <Button className="bg-success text-success-foreground hover:bg-success/90">
                {t("Sell Crop Now", "ಬೆಳೆ ಈಗ ಮಾರಿ")}
              </Button>
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-card p-4">
              <div className="text-xs text-muted-foreground">
                {t("Best time to sell Rice", "ಅಕ್ಕಿ ಮಾರಲು ಉತ್ತಮ ಸಮಯ")}
              </div>
              <div className="mt-1 text-lg font-bold text-success">
                {t("Next 2 weeks", "ಮುಂದಿನ 2 ವಾರ")}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                +5.4% {t("expected", "ನಿರೀಕ್ಷಿತ")}
              </div>
            </div>
            <div className="rounded-lg bg-card p-4">
              <div className="text-xs text-muted-foreground">
                {t("Hold Wheat for", "ಗೋಧಿ ಹಿಡಿಯಿರಿ")}
              </div>
              <div className="mt-1 text-lg font-bold text-warning-foreground">
                {t("4-6 weeks", "4-6 ವಾರಗಳು")}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {t("Prices recovering", "ಬೆಲೆ ಚೇತರಿಕೆ")}
              </div>
            </div>
            <div className="rounded-lg bg-card p-4">
              <div className="text-xs text-muted-foreground">
                {t("Sell Ragi now", "ರಾಗಿ ಈಗ ಮಾರಿ")}
              </div>
              <div className="mt-1 text-lg font-bold text-success">
                {t("Peak price", "ಉತ್ಕೃಷ್ಟ ಬೆಲೆ")}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                +6.1% {t("vs avg", "ಸರಾಸರಿಗೆ")}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <h2 className="font-semibold">{t("Regional comparison", "ಪ್ರಾದೇಶಿಕ ಹೋಲಿಕೆ")}</h2>
          </div>
          <div className="mt-4 space-y-3">
            {["Mysuru", "Hassan", "Mandya", "Tumakuru", "Belagavi"].map((city, i) => {
              const w = 50 + i * 8;
              return (
                <div key={city}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{city}</span>
                    <span className="text-muted-foreground">₹{2200 + i * 90}/quintal</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${w}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
