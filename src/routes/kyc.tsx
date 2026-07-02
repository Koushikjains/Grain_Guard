import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import {
  UploadCloud,
  FileCheck2,
  ScanFace,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-context";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/kyc")({
  head: () => ({ meta: [{ title: "KYC Verification — GrainGuard" }] }),
  component: KycPage,
});

type UploadState = "idle" | "uploading" | "scanning" | "success" | "error";

function KycPage() {
  const { t, setKycVerified, role } = useApp();
  const navigate = useNavigate();
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      startVerificationProcess();
    }
  };

  const startVerificationProcess = () => {
    setState("uploading");
    setProgress(0);
    
    // Simulate upload (1s)
    let p = 0;
    const uploadInterval = setInterval(() => {
      p += 10;
      setProgress(p);
      if (p >= 100) {
        clearInterval(uploadInterval);
        setState("scanning");
        setProgress(0);
        
        // Simulate AI scan (3s)
        let scanP = 0;
        const scanInterval = setInterval(() => {
          scanP += 5;
          setProgress(scanP);
          if (scanP >= 100) {
            clearInterval(scanInterval);
            setKycVerified(true);
            setState("success");
          }
        }, 150);
      }
    }, 100);
  };

  const handleDone = () => {
    navigate({ to: role === "farmer" ? "/farmer" : "/owner" });
  };

  return (
    <PageShell>
      <section className="mx-auto max-w-md px-4 py-12 sm:px-6">
        <Button
          variant="ghost"
          className="mb-4 text-muted-foreground"
          onClick={() => navigate({ to: role === "farmer" ? "/farmer" : "/owner" })}
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" /> {t("Back", "ಹಿಂದೆ")}
        </Button>

        <div className="text-center mb-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-elevated)]">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-2xl font-bold">
            {t("Identity Verification", "ಗುರುತು ಪರಿಶೀಲನೆ")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("Verify your identity with Aadhaar or Govt ID.", "ಆಧಾರ್ ಅಥವಾ ಸರ್ಕಾರಿ ID ಯೊಂದಿಗೆ ನಿಮ್ಮ ಗುರುತನ್ನು ಪರಿಶೀಲಿಸಿ.")}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-elevated)]">
          {state === "idle" && (
            <div className="space-y-6">
              <div
                className="relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-primary-soft/30 py-12 px-6 text-center transition-all hover:bg-primary-soft/50 hover:border-primary/50"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                />
                <UploadCloud className="h-10 w-10 text-primary mb-3" />
                <h3 className="font-semibold text-foreground">
                  {t("Tap to upload Govt ID", "ಸರ್ಕಾರಿ ID ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ಒತ್ತಿರಿ")}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("Aadhaar, PAN, or Voter ID", "ಆಧಾರ್, ಪಾನ್, ಅಥವಾ ವೋಟರ್ ID")}
                </p>
              </div>

              <div className="rounded-lg bg-muted/40 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-primary shrink-0" />
                  <div className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground block mb-0.5">
                      {t("Secure & Encrypted", "ಸುರಕ್ಷಿತ ಮತ್ತು ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡಲಾಗಿದೆ")}
                    </span>
                    {t(
                      "Your documents are encrypted and only used for verification. We do not share your data.",
                      "ನಿಮ್ಮ ದಾಖಲೆಗಳನ್ನು ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡಲಾಗಿದೆ ಮತ್ತು ಪರಿಶೀಲನೆಗೆ ಮಾತ್ರ ಬಳಸಲಾಗುತ್ತದೆ. ನಾವು ನಿಮ್ಮ ಡೇಟಾವನ್ನು ಹಂಚಿಕೊಳ್ಳುವುದಿಲ್ಲ.",
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {state === "uploading" && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <UploadCloud className="h-12 w-12 text-primary animate-bounce mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t("Uploading Document...", "ದಾಖಲೆ ಅಪ್‌ಲೋಡ್ ಆಗುತ್ತಿದೆ...")}</h3>
              <div className="w-full max-w-xs h-2 bg-muted rounded-full overflow-hidden mb-2">
                <div className="h-full bg-primary transition-all duration-100 ease-out" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-sm text-muted-foreground">{progress}%</p>
            </div>
          )}

          {state === "scanning" && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="relative mb-6">
                <ScanFace className="h-16 w-16 text-primary" />
                <div className="absolute top-0 left-0 w-full h-1 bg-success animate-scan-line shadow-[0_0_8px_2px_rgba(34,197,94,0.6)]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t("AI Document Scan...", "AI ದಾಖಲೆ ಸ್ಕ್ಯಾನ್...")}</h3>
              <p className="text-sm text-muted-foreground max-w-[250px] mb-4">
                {t("Extracting details and verifying authenticity with Govt servers.", "ವಿವರಗಳನ್ನು ಹೊರತೆಗೆಯಲಾಗುತ್ತಿದೆ ಮತ್ತು ಸರ್ಕಾರಿ ಸರ್ವರ್‌ಗಳೊಂದಿಗೆ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ.")}
              </p>
              <div className="w-full max-w-xs h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-success transition-all duration-150 ease-out" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {state === "success" && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/15 mb-4">
                <CheckCircle2 className="h-10 w-10 text-success" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t("Verification Complete", "ಪರಿಶೀಲನೆ ಪೂರ್ಣಗೊಂಡಿದೆ")}</h3>
              <p className="text-sm text-muted-foreground mb-6">
                {t(
                  "Your identity has been verified successfully. You will now receive a verified badge on your profile.",
                  "ನಿಮ್ಮ ಗುರುತನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಪರಿಶೀಲಿಸಲಾಗಿದೆ. ನಿಮ್ಮ ಪ್ರೊಫೈಲ್‌ನಲ್ಲಿ ನೀವು ಈಗ ಪರಿಶೀಲಿಸಿದ ಬ್ಯಾಡ್ಜ್ ಅನ್ನು ಪಡೆಯುತ್ತೀರಿ.",
                )}
              </p>
              <Button size="lg" className="w-full h-12" onClick={handleDone}>
                {t("Continue to Dashboard", "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಮುಂದುವರಿಯಿರಿ")}
              </Button>
            </div>
          )}

          {state === "error" && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/15 mb-4">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="text-lg font-bold mb-2">{t("Verification Failed", "ಪರಿಶೀಲನೆ ವಿಫಲವಾಗಿದೆ")}</h3>
              <p className="text-sm text-muted-foreground mb-6">
                {t("The document is unclear or invalid. Please try again with a clear photo.", "ದಾಖಲೆ ಅಸ್ಪಷ್ಟವಾಗಿದೆ ಅಥವಾ ಅಮಾನ್ಯವಾಗಿದೆ. ದಯವಿಟ್ಟು ಸ್ಪಷ್ಟ ಫೋಟೋದೊಂದಿಗೆ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.")}
              </p>
              <Button size="lg" variant="outline" className="w-full h-12" onClick={() => setState("idle")}>
                {t("Try Again", "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ")}
              </Button>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
