import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Wheat, Search, Package, Boxes, ShieldCheck, TrendingUp, BarChart3 } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/lib/app-context";
import { cn } from "@/lib/utils";
import { FlowBreadcrumb } from "@/components/Breadcrumb";

export const Route = createFileRoute("/farmer/")({
  head: () => ({
    meta: [{ title: "Farmer Dashboard — GrainGuard" }],
  }),
  component: FarmerDashboard,
});

export const CROPS = [
  { id: "bajra", label: { en: "Bajra", kn: "ಬಾಜ್ರಾ" }, emoji: "🌾" },
  { id: "barley", label: { en: "Barley", kn: "ಬಾರ್ಲಿ" }, emoji: "🌾" },
  { id: "jowar", label: { en: "Jowar", kn: "ಜೋಳ" }, emoji: "🌾" },
  { id: "maize", label: { en: "Maize", kn: "ಮೆಕ್ಕೆ" }, emoji: "🌽" },
  { id: "paddy", label: { en: "Paddy", kn: "ಭತ್ತ" }, emoji: "🌾" },
  { id: "ragi", label: { en: "Ragi", kn: "ರಾಗಿ" }, emoji: "🌱" },
  { id: "wheat", label: { en: "Wheat", kn: "ಗೋಧಿ" }, emoji: "🌾" },
  { id: "copra", label: { en: "Copra", kn: "ಕೊಬ್ಬರಿ" }, emoji: "🥥" },
  { id: "groundnut", label: { en: "Groundnut", kn: "ಕಡಲೆಕಾಯಿ" }, emoji: "🥜" },
  { id: "mustard", label: { en: "Mustard", kn: "ಸಾಸಿವೆ" }, emoji: "🌼" },
  { id: "safflower", label: { en: "Safflower", kn: "ಕುಸುಬೆ" }, emoji: "🌻" },
  { id: "sesamum", label: { en: "Sesamum", kn: "ಎಳ್ಳು" }, emoji: "🌱" },
  { id: "soyabean", label: { en: "Soyabean", kn: "ಸೋಯಾಬೀನ್" }, emoji: "🫘" },
  { id: "sunflower", label: { en: "Sunflower", kn: "ಸೂರ್ಯಕಾಂತಿ" }, emoji: "🌻" },
  { id: "arhar", label: { en: "Arhar", kn: "ತೊಗರಿ" }, emoji: "🫘" },
  { id: "bengal_gram", label: { en: "Bengal Gram", kn: "ಕಡಲೆ" }, emoji: "🫘" },
  { id: "black_gram", label: { en: "Black Gram", kn: "ಉದ್ದು" }, emoji: "🫘" },
  { id: "green_gram", label: { en: "Green Gram", kn: "ಹೆಸರುಬೇಳೆ" }, emoji: "🫘" },
];

function FarmerDashboard() {
  const { t, language, activeBookings } = useApp();
  const navigate = useNavigate();
  const [crops, setCrops] = useState<string[]>([]);
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duration, setDuration] = useState("1m");
  const [dateError, setDateError] = useState("");

  const validateDates = () => {
    if (!startDate || !endDate) return false;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 15) {
      setDateError(t("Minimum storage duration is 15 days.", "ಕನಿಷ್ಠ ಸಂಗ್ರಹಣಾ ಅವಧಿ 15 ದಿನಗಳು."));
      return false;
    }
    setDateError("");
    return true;
  };

  const durationMap: Record<string, number> = { "15d": 15, "1m": 30, "3m": 90, "6m": 180, "1y": 365 };

  const autoFillEndDate = (start: string, dur: string) => {
    if (!start) return;
    const s = new Date(start);
    s.setDate(s.getDate() + (durationMap[dur] || 30));
    const y = s.getFullYear();
    const m = String(s.getMonth() + 1).padStart(2, "0");
    const d = String(s.getDate()).padStart(2, "0");
    setEndDate(`${y}-${m}-${d}`);
    setDateError("");
  };

  const canSubmit = crops.length > 0 && quantity && startDate && endDate && !dateError;

  return (
    <PageShell>
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <FlowBreadcrumb
          current={1}
          steps={[
            { label: t("Summary", "ಸಾರಾಂಶ") },
            { label: t("Best Matches", "ಉತ್ತಮ ಹೊಂದಿಕೆಗಳು") },
            { label: t("Payment", "ಪಾವತಿ") },
          ]}
        />

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">{t("Farmer Dashboard", "ರೈತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್")}</h1>
            <p className="mt-1 text-muted-foreground">
              {t("Tell us what you need to store.", "ನೀವು ಏನನ್ನು ಸಂಗ್ರಹಿಸಬೇಕು ಎಂದು ತಿಳಿಸಿ.")}
            </p>
          </div>
          {activeBookings.length > 0 && (
            <Button asChild variant="outline">
              <Link to="/farmer/active">
                <Package className="mr-2 h-4 w-4" />
                {t("My Storage", "ನನ್ನ ಸಂಗ್ರಹಣೆ")}
              </Link>
            </Button>
          )}
        </div>

        {/* Services intro */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: t("Verified Storage", "ಪರಿಶೀಲಿತ ಸಂಗ್ರಹಣೆ"),
              desc: t(
                "Vetted P2P and commercial facilities.",
                "ಪರಿಶೀಲಿತ P2P ಮತ್ತು ವಾಣಿಜ್ಯ ಸೌಲಭ್ಯಗಳು.",
              ),
            },
            {
              icon: Package,
              title: t("Active Bookings Overview", "ಸಕ್ರಿಯ ಬುಕಿಂಗ್ ಅವಲೋಕನ"),
              desc: t("Quickly view and manage your current storage.", "ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಸಂಗ್ರಹಣೆಯನ್ನು ನಿರ್ವಹಿಸಿ."),
              link: "/farmer/active"
            },
            {
              icon: TrendingUp,
              title: t("Dedicated Market Trends", "ಮಾರುಕಟ್ಟೆ ಪ್ರವೃತ್ತಿಗಳು"),
              desc: t("Live price insights to maximize your profit.", "ಹೆಚ್ಚಿನ ಲಾಭಕ್ಕಾಗಿ ಲೈವ್ ಬೆಲೆ ಒಳನೋಟಗಳು."),
              link: "/farmer/insights"
            },
          ].map((s) => (
            <Link
              key={s.title}
              to={s.link || "#"}
              className="flex items-start gap-3 rounded-xl border border-border bg-card/80 p-4 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)] hover:border-primary hover:bg-primary/5"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft">
                <s.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold">{s.title}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{s.desc}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] md:p-8">
          <h2 className="text-lg font-semibold">{t("Select your crop", "ನಿಮ್ಮ ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("Tap the icon that matches your harvest.", "ನಿಮ್ಮ ಫಸಲಿಗೆ ಹೊಂದುವ ಐಕಾನ್ ಒತ್ತಿರಿ.")}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {CROPS.map((c) => {
              const active = crops.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setCrops((prev) =>
                      prev.includes(c.id) ? prev.filter((id) => id !== c.id) : [...prev, c.id]
                    );
                  }}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-300 active:scale-[0.97] hover:shadow-[var(--shadow-soft)] focus-visible:ring-2 focus-visible:ring-primary/50 outline-none",
                    active
                      ? "border-primary bg-primary-soft shadow-[var(--shadow-soft)]"
                      : "border-border bg-background hover:border-primary/50",
                  )}
                >
                  <span className="text-3xl" aria-hidden>
                    {c.emoji}
                  </span>
                  <Wheat
                    className={cn(
                      "hidden h-5 w-5",
                      active ? "text-primary" : "text-muted-foreground",
                    )}
                  />
                  <span className="text-sm font-medium">{c.label[language]}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <div>
              <Label htmlFor="start-date">{t("Start Date", "ಪ್ರಾರಂಭ ದಿನಾಂಕ")}</Label>
              <Input
                id="start-date"
                type="date"
                className="mt-1.5 h-12"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  autoFillEndDate(e.target.value, duration);
                }}
              />
            </div>
            <div>
              <Label htmlFor="duration">{t("Duration", "ಅವಧಿ")}</Label>
              <Select value={duration} onValueChange={(v) => { setDuration(v); autoFillEndDate(startDate, v); }}>
                <SelectTrigger id="duration" className="mt-1.5 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15d">{t("15 days", "15 ದಿನ")}</SelectItem>
                  <SelectItem value="1m">{t("1 month", "1 ತಿಂಗಳು")}</SelectItem>
                  <SelectItem value="3m">{t("3 months", "3 ತಿಂಗಳು")}</SelectItem>
                  <SelectItem value="6m">{t("6 months", "6 ತಿಂಗಳು")}</SelectItem>
                  <SelectItem value="1y">{t("1 year", "1 ವರ್ಷ")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="end-date">{t("End Date", "ಮುಕ್ತಾಯ ದಿನಾಂಕ")}</Label>
              <Input
                id="end-date"
                type="date"
                className="mt-1.5 h-12"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setTimeout(validateDates, 0);
                }}
              />
            </div>
            <div>
              <Label htmlFor="dur">{t("Quantity", "ಪ್ರಮಾಣ")}</Label>
              <div className="relative mt-1.5 flex">
                <Boxes className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="qty"
                  type="number"
                  min={1}
                  placeholder="500"
                  className="h-12 rounded-r-none border-r-0 pl-10 text-base"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger className="h-12 w-28 rounded-l-none border-l-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">{t("kg", "ಕೆಜಿ")}</SelectItem>
                    <SelectItem value="quintal">{t("Quintal", "ಕ್ವಿಂಟಾಲ್")}</SelectItem>
                    <SelectItem value="ton">{t("Ton", "ಟನ್")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {dateError && (
            <p className="mt-2 text-sm font-medium text-destructive">{dateError}</p>
          )}

          <Button
            size="lg"
            className="mt-6 h-12 w-full gap-2 text-base sm:w-auto transition-all duration-300 active:scale-[0.98] hover:shadow-lg hover:shadow-primary/25"
            disabled={!canSubmit}
            onClick={() => {
              if (validateDates()) {
                navigate({
                  to: "/farmer/storage",
                  search: { crop: crops.join(","), quantity, startDate, endDate, unit },
                });
              }
            }}
          >
            <Search className="h-4 w-4" />
            {t("Find Storage", "ಸಂಗ್ರಹಣೆ ಹುಡುಕಿ")}
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
