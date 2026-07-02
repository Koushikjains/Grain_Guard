import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-context";

export const Route = createFileRoute("/owner/storage-success")({
  head: () => ({ meta: [{ title: "Storage Added — GrainGuard" }] }),
  component: StorageSuccess,
});

function StorageSuccess() {
  const { t } = useApp();
  const navigate = useNavigate();
  return (
    <PageShell>
      <section className="mx-auto max-w-md px-4 py-16 text-center sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-elevated)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
            <CheckCircle2 className="h-9 w-9 text-success" />
          </div>
          <h1 className="mt-4 text-2xl font-bold">
            {t("Storage Facility Added Successfully!", "ಸಂಗ್ರಹಣಾ ಸೌಲಭ್ಯ ಯಶಸ್ವಿಯಾಗಿ ಸೇರಿಸಲಾಗಿದೆ!")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("Your facility is now listed and visible to farmers.", "ನಿಮ್ಮ ಸೌಲಭ್ಯವನ್ನು ಈಗ ಪಟ್ಟಿ ಮಾಡಲಾಗಿದೆ ಮತ್ತು ರೈತರಿಗೆ ಗೋಚರಿಸುತ್ತದೆ.")}
          </p>
          <Button size="lg" className="mt-6 w-full" onClick={() => navigate({ to: "/owner" })}>
            {t("Go to my storage", "ನನ್ನ ಸಂಗ್ರಹಣೆಗೆ ಹೋಗಿ")}
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
