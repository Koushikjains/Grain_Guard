import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  ScrollText,
  ShieldCheck,
  CheckCircle2,
  FileSignature,
  Hash,
  Clock,
  Coins,
  Boxes,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FlowBreadcrumb } from "@/components/Breadcrumb";
import { useSearchFacilities } from "@/hooks/useFacilities";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/app-context";

interface SearchParams {
  id?: string;
  quantity?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  unit?: string;
}

export const Route = createFileRoute("/farmer/contract")({
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    id: typeof s.id === "string" ? s.id : undefined,
    quantity: typeof s.quantity === "string" ? s.quantity : undefined,
    startDate: typeof s.startDate === "string" ? s.startDate : undefined,
    endDate: typeof s.endDate === "string" ? s.endDate : undefined,
    duration: typeof s.duration === "string" ? s.duration : undefined,
    unit: typeof s.unit === "string" ? s.unit : undefined,
  }),
  head: () => ({ meta: [{ title: "Smart Contract — GrainGuard" }] }),
  component: SmartContract,
});

function SmartContract() {
  const { t } = useApp();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [agreed, setAgreed] = useState(false);
  const [referenceCode, setReferenceCode] = useState<string | null>(null);

  const { data: backendFacilities = [] } = useSearchFacilities({});
  const storageData = backendFacilities.find((s: any) => s.id === search.id);
  const storage = storageData ? {
    id: storageData.id,
    name: storageData.name,
    location: storageData.address,
    price: storageData.price_per_kg_per_month,
  } : undefined;
  const qty = Number(search.quantity) || 0;
  
  const calculateDays = () => {
    if (!search.startDate || !search.endDate) return 30;
    const s = new Date(search.startDate);
    const e = new Date(search.endDate);
    return Math.ceil(Math.abs(e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
  };
  
  const days = calculateDays();
  const durMonths = Math.max(1, Math.round(days / 30));

  if (!storage) {
    return (
      <PageShell>
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <h2 className="text-xl font-semibold">{t("Booking not found", "ಬುಕಿಂಗ್ ಸಿಗಲಿಲ್ಲ")}</h2>
          <Button asChild className="mt-4">
            <Link to="/farmer">{t("Start over", "ಮತ್ತೆ ಪ್ರಾರಂಭಿಸಿ")}</Link>
          </Button>
        </div>
      </PageShell>
    );
  }

  const total = (storage.price || 0) * qty * durMonths;

  const handleAgree = () => {
    const code = `GG-${Date.now().toString(36).slice(-5).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    setReferenceCode(code);
    setTimeout(() => {
      navigate({
        to: "/farmer/payment",
        search: {
          id: storage.id,
          quantity: String(qty),
          startDate: search.startDate,
          endDate: search.endDate,
          unit: search.unit,
          ref: code,
        },
      });
    }, 1600);
  };

  const terms = [
    {
      icon: Boxes,
      title: t("Storage Space", "ಸಂಗ್ರಹಣಾ ಸ್ಥಳ"),
      body: t(
        `You will receive ${qty} ${search.unit ?? "kg"} of grain storage at ${storage.name}, ${storage.location}.`,
        `ನೀವು ${storage.name}, ${storage.location} ನಲ್ಲಿ ${qty} ${search.unit ?? "ಕೆಜಿ"} ಸಂಗ್ರಹಣೆಯನ್ನು ಪಡೆಯುತ್ತೀರಿ.`,
      ),
    },
    {
      icon: Clock,
      title: t("Duration", "ಅವಧಿ"),
      body: t(
        `Storage will be reserved from ${search.startDate} to ${search.endDate} (${days} days).`,
        `ಪ್ರಾರಂಭ ದಿನಾಂಕ ${search.startDate} ರಿಂದ ${search.endDate} ರವರೆಗೆ (${days} ದಿನಗಳು) ಸಂಗ್ರಹಣೆ ಕಾಯ್ದಿರಿಸಲಾಗುತ್ತದೆ.`,
      ),
    },
    {
      icon: Coins,
      title: t("Total Cost", "ಒಟ್ಟು ವೆಚ್ಚ"),
      body: t(
        `Total amount: ₹${total.toLocaleString()}. This will be held in escrow.`,
        `ಒಟ್ಟು ಮೊತ್ತ: ₹${total.toLocaleString()}. ಇದನ್ನು ಎಸ್ಕ್ರೋದಲ್ಲಿ ಇಡಲಾಗುತ್ತದೆ.`,
      ),
    },
    {
      icon: ShieldCheck,
      title: t("Escrow Protection", "ಎಸ್ಕ್ರೋ ರಕ್ಷಣೆ"),
      body: t(
        "Your money is released to the owner only after grain is safely stored. If anything goes wrong, you get a refund.",
        "ಧಾನ್ಯ ಸುರಕ್ಷಿತವಾಗಿ ಸಂಗ್ರಹವಾದ ನಂತರ ಮಾತ್ರ ಮಾಲೀಕರಿಗೆ ಹಣ ಬಿಡುಗಡೆಯಾಗುತ್ತದೆ.",
      ),
    },
  ];

  if (referenceCode) {
    return (
      <PageShell>
        <section className="mx-auto max-w-md px-4 py-16 text-center sm:px-6">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-elevated)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
              <CheckCircle2 className="h-9 w-9 text-success" />
            </div>
            <h1 className="mt-4 text-2xl font-bold">
              {t("Agreement Recorded", "ಒಪ್ಪಂದ ದಾಖಲಾಗಿದೆ")}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("Your reference code", "ನಿಮ್ಮ ಉಲ್ಲೇಖ ಸಂಕೇತ")}:
            </p>
            <div className="mx-auto mt-3 inline-flex items-center gap-2 rounded-lg border-2 border-dashed border-primary bg-primary-soft px-4 py-2 font-mono text-lg font-bold">
              <Hash className="h-4 w-4 text-primary" />
              {referenceCode}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              {t("Redirecting to payment…", "ಪಾವತಿಗೆ ಮರುನಿರ್ದೇಶಿಸಲಾಗುತ್ತಿದೆ…")}
            </p>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Button asChild variant="ghost" className="mb-2 text-muted-foreground">
          <Link
            to="/farmer/storage/$id"
            params={{ id: storage.id }}
            search={{ quantity: search.quantity, duration: search.duration, unit: search.unit }}
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" /> {t("Back", "ಹಿಂದೆ")}
          </Link>
        </Button>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] md:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <ScrollText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {t("Smart Storage Contract", "ಸ್ಮಾರ್ಟ್ ಸಂಗ್ರಹಣಾ ಒಪ್ಪಂದ")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("Plain-language terms. No jargon.", "ಸರಳ ಭಾಷೆಯಲ್ಲಿ ನಿಯಮಗಳು.")}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {terms.map((term) => (
              <div
                key={term.title}
                className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft">
                  <term.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="text-sm">
                  <div className="font-semibold">{term.title}</div>
                  <p className="mt-0.5 text-muted-foreground">{term.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-xl border-2 border-border bg-background p-4">
            <Checkbox
              id="agree"
              checked={agreed}
              onCheckedChange={(v) => setAgreed(v === true)}
              className="mt-0.5"
            />
            <label htmlFor="agree" className="cursor-pointer text-sm">
              <span className="font-semibold">
                {t("I agree to the terms above", "ನಾನು ಮೇಲಿನ ನಿಯಮಗಳಿಗೆ ಒಪ್ಪುತ್ತೇನೆ")}
              </span>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {t(
                  "By tapping below, you accept this digital contract.",
                  "ಕೆಳಗೆ ಒತ್ತುವ ಮೂಲಕ, ನೀವು ಈ ಡಿಜಿಟಲ್ ಒಪ್ಪಂದವನ್ನು ಸ್ವೀಕರಿಸುತ್ತೀರಿ.",
                )}
              </p>
            </label>
          </div>

          <Button
            size="lg"
            className={cn("mt-5 h-14 w-full gap-2 text-base", !agreed && "opacity-50")}
            disabled={!agreed}
            onClick={handleAgree}
          >
            <FileSignature className="h-5 w-5" />
            {t("Tap to Agree", "ಒಪ್ಪಲು ಒತ್ತಿರಿ")}
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
