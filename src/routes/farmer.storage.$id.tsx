import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  MapPin,
  Boxes,
  IndianRupee,
  ArrowLeft,
  Phone,
  Warehouse,
  Image as ImageIcon,
  Cloud,
  Star,
  ShieldCheck,
  Building2,
  BadgeCheck,
  Navigation,
  Lock,
  Thermometer,
  Droplets,
  CalendarDays,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { FlowBreadcrumb } from "@/components/Breadcrumb";
import { useSearchFacilities } from "@/hooks/useFacilities";
import { useApp } from "@/lib/app-context";
import { cn } from "@/lib/utils";

interface SearchParams {
  quantity?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  unit?: string;
}

export const Route = createFileRoute("/farmer/storage/$id")({
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    quantity: typeof s.quantity === "string" ? s.quantity : undefined,
    startDate: typeof s.startDate === "string" ? s.startDate : undefined,
    endDate: typeof s.endDate === "string" ? s.endDate : undefined,
    duration: typeof s.duration === "string" ? s.duration : undefined,
    unit: typeof s.unit === "string" ? s.unit : undefined,
  }),
  head: () => ({ meta: [{ title: "Facility Profile — GrainGuard" }] }),
  component: StorageDetail,
  notFoundComponent: () => (
    <PageShell>
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h2 className="text-xl font-semibold">Storage not found</h2>
        <Button asChild className="mt-4">
          <Link
            to="/farmer/storage"
            search={{ crop: undefined, quantity: undefined, duration: undefined, unit: undefined }}
          >
            Back to list
          </Link>
        </Button>
      </div>
    </PageShell>
  ),
});

function StorageDetail() {
  const { id } = Route.useParams();
  const search = Route.useSearch();
  const { t, language } = useApp();
  const navigate = useNavigate();
  const { data: backendFacilities = [] } = useSearchFacilities({});
  const storageData = backendFacilities.find((s: any) => s.id === id);
  const storage = storageData ? {
    id: storageData.id,
    name: storageData.name,
    location: storageData.address,
    distanceKm: (String(storageData.id).charCodeAt(String(storageData.id).length - 1) % 10) + 2,
    capacity: storageData.capacity_kg,
    occupied: storageData.capacity_kg - storageData.available_capacity_kg,
    price: storageData.price_per_kg_per_month,
    rating: 4.5,
    tempMonitor: storageData.climate_control,
    type: storageData.storage_type,
    security: storageData.security_features,
    images: storageData.images || [],
    payments: ["UPI", "Bank Transfer"],
    crops: storageData.accepted_grains || [],
    ownerName: "Verified Owner",
    temperature: storageData.temperature || "22°C",
    humidity: storageData.humidity || "50%",
    lat: storageData.lat,
    lng: storageData.lng,
  } : undefined;
  const [lockSeconds, setLockSeconds] = useState(300);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (lockSeconds <= 0) {
      alert(t("Your session timed out. Please restart your storage process.", "ನಿಮ್ಮ ಸೆಶನ್ ಅವಧಿ ಮೀರಿದೆ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸಂಗ್ರಹಣಾ ಪ್ರಕ್ರಿಯೆಯನ್ನು ಮರುಪ್ರಾರಂಭಿಸಿ."));
      navigate({ to: "/farmer" });
      return;
    }
    const timer = setInterval(() => setLockSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [lockSeconds, navigate]);

  if (!storage) {
    return (
      <PageShell>
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <h2 className="text-xl font-semibold">{t("Storage not found", "ಸಂಗ್ರಹಣೆ ಸಿಗಲಿಲ್ಲ")}</h2>
          <Button asChild className="mt-4">
            <Link
              to="/farmer/storage"
              search={{
                crop: undefined,
                quantity: undefined,
                duration: undefined,
                unit: undefined,
              }}
            >
              {t("Back to list", "ಪಟ್ಟಿಗೆ ಹಿಂದಿರುಗಿ")}
            </Link>
          </Button>
        </div>
      </PageShell>
    );
  }

  const qty = Number(search.quantity) || 100;
  
  const calculateDays = () => {
    if (!search.startDate || !search.endDate) return 30;
    const s = new Date(search.startDate);
    const e = new Date(search.endDate);
    return Math.ceil(Math.abs(e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
  };
  
  const days = calculateDays();
  const durMonths = Math.max(1, Math.round(days / 30));
  const total = (storage.price || 0) * qty * durMonths;
  const available = storage.capacity - storage.occupied;
  const occupiedPct = Math.round((storage.occupied / storage.capacity) * 100);

  const mins = Math.floor(lockSeconds / 60);
  const secs = String(lockSeconds % 60).padStart(2, "0");

  const typeBadge =
    storage.type === "p2p"
      ? {
          label: t("P2P Community", "P2P ಸಮುದಾಯ"),
          cls: "bg-secondary/40 text-secondary-foreground",
        }
      : storage.type === "commercial"
        ? { label: t("Private Commercial", "ಖಾಸಗಿ ವಾಣಿಜ್ಯ"), cls: "bg-primary/15 text-primary" }
        : { label: t("Govt Approved", "ಸರ್ಕಾರ ಅನುಮೋದಿತ"), cls: "bg-earth/15 text-earth" };

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Button asChild variant="ghost" className="mb-2 text-muted-foreground">
          <Link
            to="/farmer/storage"
            search={{
              crop: undefined,
              quantity: search.quantity,
              duration: search.duration,
              unit: search.unit,
            }}
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" /> {t("Back to results", "ಫಲಿತಾಂಶಗಳಿಗೆ ಹಿಂದೆ")}
          </Link>
        </Button>

        {/* Capacity lock banner */}
        {lockSeconds > 0 && (
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-warning/40 bg-warning/10 p-3 text-sm">
            <Lock className="h-4 w-4 text-warning-foreground" />
            <span className="font-medium">
              {t("Capacity locked for", "ಸಾಮರ್ಥ್ಯ ಲಾಕ್ ಆಗಿದೆ —")}{" "}
              <span className="font-mono font-bold">
                {mins}:{secs}
              </span>
            </span>
            <span className="text-muted-foreground">
              {t("Complete booking before timer ends.", "ಟೈಮರ್ ಮುಗಿಯುವ ಮೊದಲು ಬುಕಿಂಗ್ ಪೂರ್ಣಗೊಳಿಸಿ.")}
            </span>
          </div>
        )}

        {/* Image gallery */}
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-xl bg-primary-soft sm:col-span-3">
            {storage.images && storage.images.length > 0 ? (
              <img src={storage.images[activeImg] || storage.images[0]} className="h-full w-full object-cover" alt="Storage facility" />
            ) : (
              <Warehouse className="h-24 w-24 text-primary/60" />
            )}
            <span className="absolute bottom-3 right-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium">
              {t("Image", "ಚಿತ್ರ")} {activeImg + 1} / {storage.images && storage.images.length > 0 ? storage.images.length : 4}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-1">
            {(storage.images && storage.images.length > 0 ? storage.images.slice(0, 3) : [0, 1, 2]).map((img, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setActiveImg(i)}
                className={cn(
                  "relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-muted transition-all hover:opacity-80",
                  activeImg === i && "ring-2 ring-primary",
                )}
              >
                {typeof img === "string" ? (
                  <img src={img} className="h-full w-full object-cover" alt={`Thumbnail ${i+1}`} />
                ) : (
                  <ImageIcon className="h-7 w-7 text-muted-foreground" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_360px]">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-3xl font-bold">{storage.name}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {storage.location}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2 py-0.5 font-semibold text-warning-foreground">
                    <Star className="h-3 w-3 fill-current" />
                    {storage.rating.toFixed(1)}
                  </span>
                </div>
              </div>
              <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", typeBadge.cls)}>
                {typeBadge.label}
              </span>
            </div>

            {/* Owner Details */}
            <div className="mt-6 rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold">{t("Owner Details", "ಮಾಲೀಕರ ವಿವರಗಳು")}</h3>
              <div className="mt-3 flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {storage.ownerName
                    .split(" ")
                    .map((p) => p[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{storage.ownerName}</span>
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-success/15 px-2 py-0.5 text-xs font-semibold text-success">
                      <BadgeCheck className="h-3 w-3" />
                      {t("Verified", "ಪರಿಶೀಲಿತ")}
                    </span>
                  </div>
                  <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <BadgeCheck className="h-3 w-3" />
                      <span className="font-mono">OWN-{storage.id.toUpperCase()}-9421</span>
                    </div>
                    <div 
                      className="group relative flex items-center gap-1.5"
                    >
                      <Phone className="h-3 w-3" /> 
                      <span className="cursor-help blur-[4px] transition-all hover:blur-none select-none">
                        +91 99999 00{storage.id.replace(/\D/g, "")}
                      </span>
                      <div className="absolute left-0 top-full z-10 mt-1 hidden w-48 rounded bg-background p-2 text-[10px] shadow-lg border border-border group-hover:block">
                        {t("Contact GrainGuard Support to speak with the owner before booking.", "ಬುಕಿಂಗ್ ಮಾಡುವ ಮೊದಲು ಮಾಲೀಕರೊಂದಿಗೆ ಮಾತನಾಡಲು GrainGuard ಬೆಂಬಲವನ್ನು ಸಂಪರ್ಕಿಸಿ.")}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-3 w-3" /> {storage.location} District, Karnataka
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Storage details */}
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <InfoBlock
                icon={Boxes}
                label={t("Available", "ಲಭ್ಯ")}
                value={`${available.toLocaleString()} kg`}
              />
              <InfoBlock
                icon={IndianRupee}
                label={t("Price", "ಬೆಲೆ")}
                value={`₹${storage.price}/kg/${language === "en" ? "mo" : "ತಿ"}`}
              />
              <InfoBlock
                icon={Warehouse}
                label={t("Total", "ಒಟ್ಟು")}
                value={`${storage.capacity.toLocaleString()} kg`}
              />
              <InfoBlock
                icon={Thermometer}
                label={t("Temp", "ತಾಪಮಾನ")}
                value={storage.temperature}
              />
              <InfoBlock
                icon={Droplets}
                label={t("Humidity", "ತೇವಾಂಶ")}
                value={storage.humidity}
              />
              <InfoBlock
                icon={Thermometer}
                label={t("Climate", "ವಾತಾವರಣ")}
                value={storage.tempMonitor ? t("Monitored", "ಮಾನಿಟರ್") : t("Standard", "ಸಾಮಾನ್ಯ")}
              />
            </div>

            {/* Capacity meter */}
            <div className="mt-4 rounded-xl border border-border bg-card p-5">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold">{t("Real-time capacity", "ನೈಜ-ಸಮಯ ಸಾಮರ್ಥ್ಯ")}</span>
                <span className="text-muted-foreground">
                  {occupiedPct}% {t("occupied", "ಆಕ್ರಮಿತ")}
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full",
                    occupiedPct > 85
                      ? "bg-destructive"
                      : occupiedPct > 60
                        ? "bg-warning"
                        : "bg-primary",
                  )}
                  style={{ width: `${occupiedPct}%` }}
                />
              </div>
            </div>

            {/* Amenities & crops */}
            <div className="mt-4 rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold">{t("Amenities & Crops", "ಸೌಲಭ್ಯಗಳು ಮತ್ತು ಬೆಳೆಗಳು")}</h3>
              <div className="mt-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("Security", "ಸುರಕ್ಷತೆ")}
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {(storage.security || []).map((s: string) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-medium"
                    >
                      <ShieldCheck className="h-3 w-3 text-primary" />
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("Compatible crops", "ಹೊಂದಾಣಿಕೆ ಬೆಳೆಗಳು")}
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {storage.crops.map((c) => (
                    <span
                      key={c}
                      className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Weather widget */}
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Cloud className="h-3.5 w-3.5" />
                  {t("Weather", "ಹವಾಮಾನ")}
                </div>
                <div className="mt-1 text-2xl font-bold">28°C</div>
                <div className="text-xs text-muted-foreground">
                  {t("Partly cloudy", "ಭಾಗಶಃ ಮೋಡ")}
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Thermometer className="h-3.5 w-3.5" />
                  {t("Storage temp", "ಸಂಗ್ರಹ ತಾಪಮಾನ")}
                </div>
                <div className="mt-1 text-2xl font-bold">{storage.temperature}</div>
                <div className="text-xs text-muted-foreground">
                  {t("Within range", "ಸೂಕ್ತ ವ್ಯಾಪ್ತಿ")}
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Droplets className="h-3.5 w-3.5" />
                  {t("Humidity", "ಆರ್ದ್ರತೆ")}
                </div>
                <div className="mt-1 text-2xl font-bold">{storage.humidity}</div>
                <div className="text-xs text-muted-foreground">
                  {t("Good for grain", "ಧಾನ್ಯಕ್ಕೆ ಒಳ್ಳೆಯದು")}
                </div>
              </div>
            </div>

            {/* Address & directions */}
            <div className="mt-4 rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold">{t("Location", "ಸ್ಥಳ")}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {storage.name}, {storage.location} District, Karnataka — 570001
              </p>
              <div className="mt-3 flex h-44 items-center justify-center rounded-lg bg-muted">
                <MapPin className="h-8 w-8 text-muted-foreground" />
              </div>
              <Button asChild variant="outline" className="mt-3 w-full gap-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${storage.lat},${storage.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation className="h-4 w-4" />
                  {t("Get Directions", "ದಿಕ್ಕು ಪಡೆಯಿರಿ")}
                </a>
              </Button>
            </div>
          </div>

          {/* Booking summary */}
          <aside className="h-fit rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)] md:sticky md:top-20">
            <h3 className="font-semibold">{t("Booking Summary", "ಬುಕಿಂಗ್ ಸಾರಾಂಶ")}</h3>
            <div className="mt-4 space-y-2 text-sm">
              <Row label={t("Quantity", "ಪ್ರಮಾಣ")} value={`${qty} ${search.unit ?? "kg"}`} />
              <Row label={t("Duration", "ಅವಧಿ")} value={`${days} ${t("days", "ದಿನಗಳು")}`} />
              <Row
                label={t("Rate", "ದರ")}
                value={`₹${storage.price}/kg/${language === "en" ? "mo" : "ತಿ"}`}
              />
              <div className="my-2 border-t border-border" />
              <Row
                label={t("Estimated total", "ಅಂದಾಜು ಒಟ್ಟು")}
                value={`₹${total.toLocaleString()}`}
                bold
              />
            </div>
            <Button
              size="lg"
              className="mt-5 h-12 w-full text-base"
              onClick={() =>
                navigate({
                  to: "/farmer/contract",
                  search: {
                    id: storage.id,
                    quantity: String(qty),
                    startDate: search.startDate,
                    endDate: search.endDate,
                    unit: search.unit,
                  },
                })
              }
            >
              <CalendarDays className="h-4 w-4" />
              {t("Proceed to Book", "ಬುಕ್ ಮಾಡಲು ಮುಂದುವರಿಯಿರಿ")}
            </Button>
            <Button
              size="lg"
              className="mt-2 h-12 w-full gap-2 text-base transition-all grayscale-[0.5] blur-[1.5px] hover:blur-none select-none"
              disabled
            >
              <Phone className="h-4 w-4" />
              {t("Call Owner", "ಮಾಲೀಕರನ್ನು ಕರೆ ಮಾಡಿ")}
            </Button>
            <p className="mt-2 text-center text-[10px] text-muted-foreground italic">
              {t("Call active after confirmed booking.", "ಸ್ಥಿರಪಡಿಸಿದ ಬುಕಿಂಗ್ ನಂತರ ಕರೆ ಸಕ್ರಿಯವಾಗುತ್ತದೆ.")}
            </p>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              {t(
                "Payment held in escrow until storage starts.",
                "ಸಂಗ್ರಹಣೆ ಪ್ರಾರಂಭದವರೆಗೆ ಪಾವತಿ ಎಸ್ಕ್ರೋದಲ್ಲಿರುತ್ತದೆ.",
              )}
            </p>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}

function InfoBlock({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={bold ? "text-base font-bold" : "font-medium"}>{value}</span>
    </div>
  );
}
