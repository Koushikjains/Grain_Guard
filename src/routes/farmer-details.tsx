import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { User as UserIcon, MapPin, Phone, Mail, IdCard, Camera, Warehouse, Edit, BadgeCheck } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-context";

export const Route = createFileRoute("/farmer-details")({
  head: () => ({ meta: [{ title: "My Details — GrainGuard" }] }),
  component: FarmerDetails,
});

function FarmerDetails() {
  const { t, user, updateUser, activeBookings, isKycVerified, role } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(user?.photo ?? null);

  if (!user) return null;

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
    updateUser({ photo: url });
  };

  const initials = (user.name || "U")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const activeFacilities = activeBookings.map((b) => ({
    name: b.storageName,
    location: b.location,
    crop: b.crop,
  }));

  return (
    <PageShell>
      <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-bold">{t("My Details", "ನನ್ನ ವಿವರಗಳು")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("Your profile information and active bookings.", "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಮಾಹಿತಿ ಮತ್ತು ಸಕ್ರಿಯ ಬುಕಿಂಗ್‌ಗಳು.")}
        </p>

        {/* Profile Photo */}
        <div className="mt-8 flex flex-col items-center">
          <div className="relative">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-primary/20 bg-primary-soft text-3xl font-bold text-foreground shadow-[var(--shadow-card)]">
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-110"
              aria-label="Upload photo"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          </div>
          <h2 className="mt-4 text-xl font-bold">{user.name || t("No name set", "ಹೆಸರು ಹೊಂದಿಸಿಲ್ಲ")}</h2>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-mono font-semibold text-primary">{user.uniqueId}</span>
            {isKycVerified && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">
                <BadgeCheck className="h-3 w-3" /> {t("Verified", "ಪರಿಶೀಲಿಸಲಾಗಿದೆ")}
              </span>
            )}
          </div>
        </div>

        {/* Personal Details Card */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{t("Personal Information", "ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ")}</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg bg-muted/40 p-3">
              <UserIcon className="h-4 w-4 text-primary shrink-0" />
              <div>
                <div className="text-xs text-muted-foreground">{t("Full Name", "ಪೂರ್ಣ ಹೆಸರು")}</div>
                <div className="font-medium">{user.name || "—"}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted/40 p-3">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <div>
                <div className="text-xs text-muted-foreground">{t("Address", "ವಿಳಾಸ")}</div>
                <div className="font-medium">{t("On file from registration", "ನೋಂದಣಿಯಿಂದ ದಾಖಲಿಸಲಾಗಿದೆ")}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted/40 p-3">
              <IdCard className="h-4 w-4 text-primary shrink-0" />
              <div>
                <div className="text-xs text-muted-foreground">
                  {role === "farmer" ? t("Aadhaar / Kisan Card", "ಆಧಾರ್ / ಕಿಸಾನ್ ಕಾರ್ಡ್") : t("Aadhaar", "ಆಧಾರ್")}
                </div>
                <div className="font-medium font-mono">XXXX XXXX ••••</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted/40 p-3">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <div>
                <div className="text-xs text-muted-foreground">{t("Email", "ಇಮೇಲ್")}</div>
                <div className="font-medium">{user.email || t("Not provided", "ಒದಗಿಸಲಾಗಿಲ್ಲ")}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted/40 p-3">
              <Phone className="h-4 w-4 text-primary shrink-0" />
              <div>
                <div className="text-xs text-muted-foreground">{t("Mobile Number", "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ")}</div>
                <div className="font-medium">+91 {user.phone}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Facilities */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h3 className="text-lg font-semibold mb-4">{t("Active Facilities", "ಸಕ್ರಿಯ ಸೌಲಭ್ಯಗಳು")}</h3>
          {activeFacilities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Warehouse className="mx-auto h-10 w-10 mb-2 opacity-40" />
              <p className="text-sm">{t("No active storage bookings yet.", "ಇನ್ನೂ ಯಾವುದೇ ಸಕ್ರಿಯ ಸಂಗ್ರಹಣಾ ಬುಕಿಂಗ್ ಇಲ್ಲ.")}</p>
              <Button asChild size="sm" className="mt-3">
                <Link to="/farmer">{t("Find Storage", "ಸಂಗ್ರಹಣೆ ಹುಡುಕಿ")}</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {activeFacilities.map((f, i) => (
                <Link
                  key={i}
                  to="/farmer/active"
                  className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-4 transition-all hover:border-primary hover:bg-primary-soft/20"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <Warehouse className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{f.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {f.location} · {f.crop}
                    </div>
                  </div>
                  <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-[10px] font-bold text-success">
                    {t("Active", "ಸಕ್ರಿಯ")}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6">
          <Button asChild variant="ghost">
            <Link to="/farmer/active">{t("Back to My Storage", "ನನ್ನ ಸಂಗ್ರಹಣೆಗೆ ಹಿಂದಿರುಗಿ")}</Link>
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
