import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, FileText, Download, Receipt, Inbox } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-context";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "Orders & Invoices — GrainGuard" }] }),
  component: Orders,
});

function Orders() {
  const { t, activeBookings } = useApp();

  // Build invoice list from real state only (no dummy data)
  const invoices = activeBookings.map((b, i) => ({
    id: `INV-${(Date.now() + i).toString(36).slice(-6).toUpperCase()}`,
    date: new Date().toLocaleDateString(),
    desc: `${b.storageName} — ${b.quantity}`,
    location: b.location,
  }));

  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Button asChild variant="ghost" className="mb-2 text-muted-foreground">
          <Link to="/">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> {t("Back", "ಹಿಂದೆ")}
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Receipt className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              {t("Orders & Invoices", "ಆದೇಶಗಳು ಮತ್ತು ಸರಕುಪಟ್ಟಿ")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t(
                "Download all your booking invoices and contracts.",
                "ನಿಮ್ಮ ಎಲ್ಲ ಬುಕಿಂಗ್ ಸರಕುಪಟ್ಟಿ ಮತ್ತು ಒಪ್ಪಂದಗಳನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.",
              )}
            </p>
          </div>
        </div>

        {invoices.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-20 text-center">
            <Inbox className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">
              {t("No invoices yet", "ಇನ್ನೂ ಸರಕುಪಟ್ಟಿ ಇಲ್ಲ")}
            </h3>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              {t(
                "Your invoices appear here after each booking.",
                "ಪ್ರತಿ ಬುಕಿಂಗ್ ನಂತರ ಸರಕುಪಟ್ಟಿ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ.",
              )}
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-3">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">{inv.desc}</div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {inv.id} · {inv.date} · {inv.location}
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Download className="h-4 w-4" />
                  PDF
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
