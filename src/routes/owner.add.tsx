import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, MapPin, Sparkles, Loader2 } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/lib/app-context";
import { cn } from "@/lib/utils";
import { useCreateFacility } from "@/hooks/useFacilities";

export const Route = createFileRoute("/owner/add")({
  head: () => ({ meta: [{ title: "Add Storage — GrainGuard" }] }),
  component: AddStorage,
});

const CROPS = [
  "bajra", "barley", "jowar", "maize", "paddy", "ragi", "wheat", 
  "copra", "groundnut", "mustard", "safflower", "sesamum", 
  "soyabean", "sunflower", "arhar", "bengal_gram", "black_gram", "green_gram"
];

function AddStorage() {
  const { t } = useApp();
  const navigate = useNavigate();
  const { mutateAsync: createFacility, isPending } = useCreateFacility();
  const [selected, setSelected] = useState<string[]>([]);
  const [type, setType] = useState("p2p");
  const [capacity, setCapacity] = useState("");
  const [storageName, setStorageName] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [security, setSecurity] = useState("");
  const [error, setError] = useState("");

  const toggle = (c: string) =>
    setSelected((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const typeMapping: Record<string, string> = {
        "p2p": "peer_to_peer",
        "commercial": "commercial",
        "govt": "government"
      };

      const cap = Number(capacity);
      await createFacility({
        name: storageName,
        address,
        storage_type: typeMapping[type] || "commercial",
        accepted_grains: selected,
        security_details: security,
        google_maps_link: location,
        pricing_structure: { price_per_kg_per_month: Number(price) },
        capacity_kg: cap,
        capacity_quintal: cap / 100,
        capacity_ton: cap / 1000,
      });
      navigate({ to: "/owner/storage-success" });
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map((d: any) => `${d.loc.join('.')}: ${d.msg}`).join(', '));
      } else {
        setError(detail || "Failed to create facility.");
      }
    }
  };

  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Button asChild variant="ghost" className="mb-2 text-muted-foreground">
          <Link to="/owner">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> {t("Back", "ಹಿಂದೆ")}
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">
          {t("Setup Your Storage", "ನಿಮ್ಮ ಸಂಗ್ರಹಣೆಯನ್ನು ಹೊಂದಿಸಿ")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t(
            "Provide details so farmers can find you.",
            "ರೈತರು ನಿಮ್ಮನ್ನು ಹುಡುಕಲು ವಿವರಗಳನ್ನು ಒದಗಿಸಿ.",
          )}
        </p>

        <form
          onSubmit={submit}
          className="mt-6 space-y-5 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] md:p-8"
        >
          <div>
            <Label htmlFor="name">{t("Storage Name", "ಸಂಗ್ರಹಣೆ ಹೆಸರು")}</Label>
            <Input
              id="name"
              required
              placeholder={t("e.g. Green Field Warehouse", "ಉದಾ. ಗ್ರೀನ್ ಫೀಲ್ಡ್")}
              className="mt-1.5 h-12 text-base"
              value={storageName}
              onChange={(e) => setStorageName(e.target.value)}
            />
          </div>

          <div>
            <Label>{t("Storage Type", "ಸಂಗ್ರಹಣೆ ಪ್ರಕಾರ")}</Label>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {[
                { v: "p2p", label: t("P2P Community", "P2P ಸಮುದಾಯ") },
                { v: "commercial", label: t("Commercial", "ವಾಣಿಜ್ಯ") },
                { v: "govt", label: t("Govt Approved", "ಸರ್ಕಾರ ಅನುಮೋದಿತ") },
              ].map((o) => (
                <button
                  key={o.v}
                  type="button"
                  onClick={() => setType(o.v)}
                  className={cn(
                    "rounded-lg border-2 px-3 py-2.5 text-sm font-medium transition-all",
                    type === o.v
                      ? "border-primary bg-primary-soft"
                      : "border-border bg-background hover:border-primary/40",
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="cap">{t("Total Capacity", "ಒಟ್ಟು ಸಾಮರ್ಥ್ಯ")}</Label>
              <Input 
                id="cap" 
                type="number" 
                min={100} 
                required 
                className="mt-1.5 h-12 text-base" 
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="e.g. 1000"
              />
              {capacity && (
                <div className="mt-2 flex gap-3 text-xs text-muted-foreground bg-muted/30 p-2 rounded-md">
                  <span><strong className="text-foreground">{capacity}</strong> kg</span>
                  <span><strong className="text-foreground">{(Number(capacity) / 100).toFixed(2)}</strong> quintal</span>
                  <span><strong className="text-foreground">{(Number(capacity) / 1000).toFixed(2)}</strong> ton</span>
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="price">{t("Price per unit (₹/kg/month)", "ಪ್ರತಿ ಯೂನಿಟ್ ಬೆಲೆ")}</Label>
              <Input
                id="price"
                type="number"
                min={1}
                step="0.5"
                required
                className="mt-1.5 h-12 text-base"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label className="mb-2 block">{t("Accepted crops", "ಸ್ವೀಕರಿಸುವ ಬೆಳೆಗಳು")}</Label>
            {/* Selected chips */}
            {selected.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {selected.map((c) => (
                  <span key={c} className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-medium capitalize text-primary-foreground">
                    {c}
                    <button type="button" onClick={() => toggle(c)} className="ml-0.5 rounded-full hover:bg-primary-foreground/20 p-0.5" aria-label={`Remove ${c}`}>
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            {/* Dropdown to add crops */}
            <Select
              value=""
              onValueChange={(v) => { if (v && !selected.includes(v)) toggle(v); }}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder={t("Select crops to accept...", "ಸ್ವೀಕರಿಸಲು ಬೆಳೆಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿ...")} />
              </SelectTrigger>
              <SelectContent>
                {CROPS.filter((c) => !selected.includes(c)).map((c) => (
                  <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="best">
              <span className="inline-flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                {t("Best crop to store (recommended)", "ಸಂಗ್ರಹಿಸಲು ಉತ್ತಮ ಬೆಳೆ")}
              </span>
            </Label>
            <Select disabled={selected.length === 0}>
              <SelectTrigger id="best" className="mt-1.5 h-12">
                <SelectValue placeholder={selected.length === 0 ? t("Select accepted crops first", "ಮೊದಲು ಸ್ವೀಕೃತ ಬೆಳೆಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿ") : t("Choose your specialty", "ನಿಮ್ಮ ವಿಶೇಷತೆಯನ್ನು ಆರಿಸಿ")} />
              </SelectTrigger>
              <SelectContent>
                {selected.map((c) => (
                  <SelectItem key={c} value={c} className="capitalize">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="security">{t("Security provided", "ಸುರಕ್ಷತೆ ಒದಗಿಸಲಾಗಿದೆ")}</Label>
            <Textarea
              id="security"
              rows={2}
              placeholder={t("e.g. CCTV, Guard, Fire alarm", "ಉದಾ. CCTV, ಗಾರ್ಡ್")}
              className="mt-1.5"
              value={security}
              onChange={(e) => setSecurity(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="loc">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  {t("Google Maps location (link/coords)", "Google Maps ಸ್ಥಳ")}
                </span>
              </Label>
              <Input
                id="loc"
                required
                placeholder="https://maps.google.com/..."
                className="mt-1.5 h-12 text-base"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="addr">{t("Physical address", "ಭೌತಿಕ ವಿಳಾಸ")}</Label>
              <Input
                id="addr"
                required
                placeholder={t("Street, City, Pincode", "ರಸ್ತೆ, ನಗರ, ಪಿನ್")}
                className="mt-1.5 h-12 text-base"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="social">
              {t("Social media / promo links (optional)", "ಸಾಮಾಜಿಕ ಮಾಧ್ಯಮ ಲಿಂಕ್‌ಗಳು")}
            </Label>
            <Input
              id="social"
              placeholder="@yourhandle or https://..."
              className="mt-1.5 h-12 text-base"
            />
          </div>

          {error && <p className="text-sm font-medium text-destructive">{error}</p>}

          <Button
            type="submit"
            size="lg"
            className="h-12 w-full text-base"
            disabled={selected.length === 0 || isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("Submit Storage", "ಸಂಗ್ರಹಣೆ ಸಲ್ಲಿಸಿ")}
          </Button>
        </form>
      </section>
    </PageShell>
  );
}
