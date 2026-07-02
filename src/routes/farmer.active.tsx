import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Wheat,
  MapPin,
  Phone,
  Calendar,
  PackageCheck,
  Plus,
  CheckCircle2,
  Cloud,
  Thermometer,
  Droplets,
  TrendingUp,
  Boxes,
  Filter,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-context";
import { cn } from "@/lib/utils";
import { useFarmerBookings, useDeleteBooking, useExtendBooking } from "@/hooks/useBookings";

export const Route = createFileRoute("/farmer/active")({
  head: () => ({ meta: [{ title: "My Storage — GrainGuard" }] }),
  component: FarmerDashboard,
});

// Simulated climate data per booking
function getClimate(crop: string) {
  const map: Record<string, { temp: string; hum: string; status: "Good" | "Fair" }> = {
    rice: { temp: "22°C", hum: "52%", status: "Good" },
    wheat: { temp: "20°C", hum: "48%", status: "Good" },
    ragi: { temp: "24°C", hum: "55%", status: "Good" },
    maize: { temp: "23°C", hum: "50%", status: "Good" },
    jowar: { temp: "25°C", hum: "45%", status: "Fair" },
  };
  return map[crop] || { temp: "22°C", hum: "50%", status: "Good" };
}

// Crop emoji map
function getCropEmoji(crop: string) {
  const map: Record<string, string> = {
    bajra: "🌾", barley: "🌾", jowar: "🌾", maize: "🌽", paddy: "🌾",
    ragi: "🌱", wheat: "🌾", copra: "🥥", groundnut: "🥜", mustard: "🌼",
    safflower: "🌻", sesamum: "🌱", soyabean: "🫘", sunflower: "🌻",
    arhar: "🫘", bengal_gram: "🫘", black_gram: "🫘", green_gram: "🫘",
    rice: "🌾", pulses: "🫘",
  };
  return map[crop] || "🌾";
}

function FarmerDashboard() {
  const { t } = useApp();
  const { data: rawBookings = [], isLoading } = useFarmerBookings();
  const { mutate: delBooking } = useDeleteBooking();
  const { mutate: extBooking } = useExtendBooking();

  const activeBookings = rawBookings.map(b => {
    const created = new Date(b.created_at);
    const now = new Date();
    const elapsedDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    return {
      id: b.id,
      storageName: b.facility?.name || "Unknown Facility",
      crop: b.crop_types[0] || "Unknown",
      quantity: `${b.quantity_kg}`,
      duration: b.duration_days,
      daysRemaining: Math.max(0, b.duration_days - elapsedDays),
      location: b.facility?.address || "",
    };
  });

  const [retrievingId, setRetrievingId] = useState<string | null>(null);
  const [extendingId, setExtendingId] = useState<string | null>(null);
  const [extSuccess, setExtSuccess] = useState(false);
  const [filterCrop, setFilterCrop] = useState("all");

  const hasBookings = activeBookings.length > 0;

  // Total weight across all bookings
  const totalWeight = activeBookings.reduce((sum, b) => {
    const num = parseFloat(b.quantity) || 0;
    return sum + num;
  }, 0);

  const filteredBookings = filterCrop === "all"
    ? activeBookings
    : activeBookings.filter((b) => b.crop === filterCrop);

  const uniqueCrops = [...new Set(activeBookings.map((b) => b.crop))];

  // Handle retrieval confirmation
  if (retrievingId) {
    const booking = activeBookings.find((b) => b.id === retrievingId);
    return (
      <PageShell>
        <section className="mx-auto max-w-md px-4 py-16 text-center sm:px-6">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
              <CheckCircle2 className="h-9 w-9 text-success" />
            </div>
            <h1 className="mt-4 text-2xl font-bold">
              {t("Retrieval Requested", "ಮರುಪಡೆಯುವಿಕೆ ವಿನಂತಿಸಲಾಗಿದೆ")}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {booking
                ? `${booking.storageName} — ${booking.crop}`
                : t("The storage owner has been notified.", "ಸಂಗ್ರಹಣಾ ಮಾಲೀಕರಿಗೆ ತಿಳಿಸಲಾಗಿದೆ.")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t(
                "Escrow will be released on completion.",
                "ಪೂರ್ಣಗೊಂಡ ನಂತರ ಎಸ್ಕ್ರೋ ಬಿದುಗಡೆಯಾಗುತ್ತದೆ.",
              )}
            </p>
            <Button
              size="lg"
              className="mt-6 w-full"
              onClick={() => {
                delBooking(retrievingId);
                setRetrievingId(null);
              }}
            >
              {t("Done", "ಮುಗಿದಿದೆ")}
            </Button>
          </div>
        </section>
      </PageShell>
    );
  }

  // Handle Extension Success view
  if (extSuccess) {
    return (
      <PageShell>
        <section className="mx-auto max-w-md px-4 py-16 text-center sm:px-6">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-elevated)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
              <CheckCircle2 className="h-9 w-9 text-success" />
            </div>
            <h1 className="mt-4 text-2xl font-bold">
              {t("Storage Extended", "ಸಂಗ್ರಹಣೆ ವಿಸ್ತರಿಸಲಾಗಿದೆ")}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t(
                "Your storage contract has been successfully extended.",
                "ನಿಮ್ಮ ಸಂಗ್ರಹಣಾ ಒಪ್ಪಂದವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ವಿಸ್ತರಿಸಲಾಗಿದೆ.",
              )}
            </p>
            <Button
              size="lg"
              className="mt-6 w-full"
              onClick={() => {
                setExtSuccess(false);
                setExtendingId(null);
              }}
            >
              {t("View My Storage", "ನನ್ನ ಸಂಗ್ರಹಣೆ ನೋಡಿ")}
            </Button>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">{t("My Storage", "ನನ್ನ ಸಂಗ್ರಹಣೆ")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isLoading ? t("Loading your active bookings...", "ನಿಮ್ಮ ಸಕ್ರಿಯ ಬುಕಿಂಗ್‌ಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...") : hasBookings
                ? t(
                    `${activeBookings.length} active booking(s) · Live monitoring`,
                    `${activeBookings.length} ಸಕ್ರಿಯ ಬುಕಿಂಗ್(ಗಳು) · ನೈಜ ಮೇಲ್ವಿಚಾರಣೆ`,
                  )
                : t("No active storage bookings yet.", "ಇನ್ನೂ ಯಾವುದೇ ಸಕ್ರಿಯ ಸಂಗ್ರಹಣಾ ಬುಕಿಂಗ್ ಇಲ್ಲ.")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {hasBookings && uniqueCrops.length > 1 && (
              <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                <select
                  className="bg-transparent text-sm font-medium outline-none"
                  value={filterCrop}
                  onChange={(e) => setFilterCrop(e.target.value)}
                >
                  <option value="all">{t("All Crops", "ಎಲ್ಲಾ ಬೆಳೆ")}</option>
                  {uniqueCrops.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <Button asChild className="gap-2">
              <Link to="/farmer">
                <Plus className="h-4 w-4" />
                {t("Add Storage", "ಸಂಗ್ರಹಣೆ ಸೇರಿಸಿ")}
              </Link>
            </Button>
          </div>
        </div>

        {/* Summary Bento Cards — only when bookings exist */}
        {hasBookings && (
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Boxes className="h-4 w-4 text-primary" />
                {t("Total Stored", "ಒಟ್ಟು ಸಂಗ್ರಹ")}
              </div>
              <div className="mt-2 text-3xl font-black">{totalWeight.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">
                {t("kg across all facilities", "ಎಲ್ಲ ಸೌಲಭ್ಯಗಳಲ್ಲಿ ಕೆಜಿ")}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Wheat className="h-4 w-4 text-primary" />
                {t("Active Crops", "ಸಕ್ರಿಯ ಬೆಳೆಗಳು")}
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black">{uniqueCrops.length}</span>
                <span className="flex gap-1">
                  {uniqueCrops.map((c) => (
                    <span key={c} className="text-lg" title={c}>
                      {getCropEmoji(c)}
                    </span>
                  ))}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {uniqueCrops.map((c) => c).join(", ")}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Cloud className="h-4 w-4 text-primary" />
                {t("Climate Status", "ವಾತಾವರಣ ಸ್ಥಿತಿ")}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-success" />
                <span className="text-xl font-bold text-success">{t("All Good", "ಎಲ್ಲ ಒಳ್ಳೆಯದು")}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {t("All facilities within optimal range", "ಎಲ್ಲ ಸೌಲಭ್ಯ ಉತ್ತಮ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ")}
              </div>
            </div>
          </div>
        )}

        {/* Empty State — only when NO bookings */}
        {!hasBookings && (
          <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/50 py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-soft">
              <Wheat className="h-10 w-10 text-primary" />
            </div>
            <h2 className="mt-5 text-xl font-semibold">
              {t("Start your storage journey", "ನಿಮ್ಮ ಸಂಗ್ರಹಣಾ ಪ್ರಯಾಣ ಪ್ರಾರಂಭಿಸಿ")}
            </h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              {t(
                "Select your crops, find a verified facility, and book secure storage with escrow protection.",
                "ನಿಮ್ಮ ಬೆಳೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ, ಪರಿಶೀಲಿತ ಸೌಲಭ್ಯ ಹುಡುಕಿ, ಮತ್ತು ಎಸ್ಕ್ರೋ ರಕ್ಷಣೆಯೊಂದಿಗೆ ಸಂಗ್ರಹಣೆ ಬುಕ್ ಮಾಡಿ.",
              )}
            </p>
            <Button asChild size="lg" className="mt-6 gap-2">
              <Link to="/farmer">
                <Plus className="h-4 w-4" />
                {t("Find Storage", "ಸಂಗ್ರಹಣೆ ಹುಡುಕಿ")}
              </Link>
            </Button>
          </div>
        )}

        {/* Active Storage Cards Grid */}
        {hasBookings && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {filteredBookings.map((booking) => {
              const totalDays = booking.duration * 30;
              const elapsed = totalDays - booking.daysRemaining;
              const pct = Math.min(100, Math.round((elapsed / totalDays) * 100));
              const climate = getClimate(booking.crop);
              const emoji = getCropEmoji(booking.crop);

              return (
                <div
                  key={booking.id}
                  className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition-all hover:border-primary/40 hover:shadow-[var(--shadow-card)]"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-xl">
                        {emoji}
                      </div>
                      <div>
                        <h3 className="font-bold">{booking.storageName}</h3>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" /> {booking.location}
                        </div>
                      </div>
                    </div>
                    <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-[10px] font-bold text-success">
                      {t("Active", "ಸಕ್ರಿಯ")}
                    </span>
                  </div>

                  {/* Crop & Weight */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-muted/50 p-3">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {t("Crop", "ಬೆಳೆ")}
                      </div>
                      <div className="mt-1 text-sm font-bold capitalize">{booking.crop}</div>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {t("Weight", "ತೂಕ")}
                      </div>
                      <div className="mt-1 text-sm font-bold">{booking.quantity}</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {t("Storage Progress", "ಸಂಗ್ರಹಣೆ ಪ್ರಗತಿ")}
                      </span>
                      <span className="font-semibold">
                        {booking.daysRemaining} {t("days left", "ದಿನ ಉಳಿದಿವೆ")}
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Climate Mini-Widget */}
                  <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg border border-border bg-muted/30 p-2.5 text-center">
                    <div>
                      <Thermometer className="mx-auto h-3.5 w-3.5 text-muted-foreground" />
                      <div className="mt-0.5 text-sm font-bold">{climate.temp}</div>
                      <div className="text-[10px] text-muted-foreground">{t("Temp", "ತಾಪ")}</div>
                    </div>
                    <div>
                      <Droplets className="mx-auto h-3.5 w-3.5 text-muted-foreground" />
                      <div className="mt-0.5 text-sm font-bold">{climate.hum}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {t("Humidity", "ಆರ್ದ್ರತೆ")}
                      </div>
                    </div>
                    <div>
                      <TrendingUp className="mx-auto h-3.5 w-3.5 text-success" />
                      <div className="mt-0.5 text-sm font-bold text-success">
                        {t(climate.status, climate.status === "Good" ? "ಒಳ್ಳೆಯದು" : "ಸಾಕಷ್ಟು")}
                      </div>
                      <div className="text-[10px] text-muted-foreground">{t("Status", "ಸ್ಥಿತಿ")}</div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant={booking.daysRemaining <= 5 ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "flex-1 gap-1 text-xs",
                        booking.daysRemaining <= 5 &&
                          "animate-pulse border-primary bg-primary text-primary-foreground shadow-[var(--shadow-elevated)]",
                      )}
                      onClick={() => {
                        setExtendingId(booking.id);
                      }}
                    >
                      <Calendar className="h-3 w-3" /> {t("Extend", "ವಿಸ್ತರಿಸಿ")}
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 gap-1 text-xs"
                      onClick={() => setRetrievingId(booking.id)}
                    >
                      <PackageCheck className="h-3 w-3" /> {t("Retrieve", "ಮರುಪಡೆಯಿರಿ")}
                    </Button>
                    <Button asChild variant="outline" size="sm" className="gap-1 text-xs">
                      <a href="tel:+910000000000">
                        <Phone className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              );
            })}

            {/* Add Storage Card — always visible at the end */}
            <Link
              to="/farmer"
              className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/50 p-8 text-center transition-all hover:border-primary hover:bg-primary-soft/20"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary transition-transform group-hover:scale-110">
                <Plus className="h-7 w-7" />
              </div>
              <h3 className="mt-3 font-semibold">{t("Add Storage", "ಸಂಗ್ರಹಣೆ ಸೇರಿಸಿ")}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("Book another crop", "ಮತ್ತೊಂದು ಬೆಳೆ ಬುಕ್ ಮಾಡಿ")}
              </p>
            </Link>
          </div>
        )}
      </section>

      {extendingId && (
        <ExtensionModal
          booking={activeBookings.find(b => b.id === extendingId)}
          onClose={() => setExtendingId(null)}
          onSuccess={(additionalDays) => {
            const booking = activeBookings.find((b) => b.id === extendingId);
            if (booking) {
              extBooking({
                id: extendingId,
                days: Math.max(1, Math.round(additionalDays / 30)) * 30, // Rough conversion from days to days
              });
              setExtSuccess(true);
            }
          }}
        />
      )}
    </PageShell>
  );
}

function ExtensionModal({ 
  booking, 
  onClose, 
  onSuccess 
}: { 
  booking: any, 
  onClose: () => void,
  onSuccess: (days: number) => void 
}) {
  const { t } = useApp();
  const [start, setStart] = useState(new Date().toISOString().split('T')[0]);
  const [end, setEnd] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  if (!booking) return null;

  const handleExtend = () => {
    if (!start || !end) return;
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.ceil(Math.abs(e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff < 15) {
      setError(t("Minimum extension is 15 days.", "ಕನಿಷ್ಠ 15 ದಿನಗಳ ವಿಸ್ತರಣೆ ಅಗತ್ಯ."));
      return;
    }

    setProcessing(true);
    setTimeout(() => {
      onSuccess(diff);
      setProcessing(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-card p-6 shadow-2xl border border-border">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          {t("Extend Storage", "ಸಂಗ್ರಹಣೆ ವಿಸ್ತರಿಸಿ")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {booking.storageName} — {booking.crop} ({booking.quantity})
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("New End Date", "ಹೊಸ ಮುಕ್ತಾಯ ದಿನಾಂಕ")}</label>
            <input 
              type="date" 
              className="mt-1.5 h-12 w-full rounded-lg border border-border bg-background px-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>

          {error && <p className="text-xs font-medium text-destructive">{error}</p>}

          <div className="rounded-lg bg-primary-soft/30 p-3 text-xs text-primary">
            {t("Extending storage will hold the additional payment in escrow until the storage is completed.", "ಸಂಗ್ರಹಣೆಯನ್ನು ವಿಸ್ತರಿಸುವುದರಿಂದ ಹೆಚ್ಚುವರಿ ಪಾವತಿಯನ್ನು ಎಸ್ಕ್ರೋದಲ್ಲಿ ಇಡಲಾಗುತ್ತದೆ.")}
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose} disabled={processing}>
              {t("Cancel", "ರದ್ದು")}
            </Button>
            <Button className="flex-1 gap-2" onClick={handleExtend} disabled={processing || !end}>
              {processing ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              {t("Confirm Extension", "ವಿಸ್ತರಣೆ ಖಚಿತಪಡಿಸಿ")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
