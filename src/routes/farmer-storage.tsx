import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Sprout, ShieldCheck, Warehouse, TrendingUp, CheckCircle2, ArrowRight, Lock, Star, BarChart3, Wheat as WheatIcon } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-context";
import { useEffect } from "react";

export const Route = createFileRoute("/farmer-storage")({
  head: () => ({
    meta: [
      { title: "Farmer Storage — GrainGuard" },
      { name: "description", content: "Discover how GrainGuard helps farmers store grain safely." },
    ],
  }),
  component: FarmerStorageLanding,
});

function FarmerStorageLanding() {
  const { t, isAuthed, role, setPreAuthRole } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    setPreAuthRole("farmer");
  }, [setPreAuthRole]);

  useEffect(() => {
    if (isAuthed) {
      navigate({ to: role === "farmer" ? "/farmer" : "/owner", replace: true });
    }
  }, [isAuthed, role, navigate]);

  return (
    <PageShell>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#1C2216] text-[#EFEFEF]">
        <div className="absolute inset-0 topo-pattern opacity-10" aria-hidden />
        <div className="absolute inset-0 hero-glow" aria-hidden />
        <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 md:py-28 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#9CAF88]/20 px-3 py-1 text-xs font-semibold text-[#9CAF88]">
            <Sprout className="h-3.5 w-3.5" />
            {t("For Farmers", "ರೈತರಿಗಾಗಿ")}
          </span>
          <h1 className="mt-4 text-4xl font-black leading-tight text-white md:text-5xl tracking-tight">
            {t("Store Your Grain Safely, Get Paid Fairly", "ನಿಮ್ಮ ಧಾನ್ಯವನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಸಂಗ್ರಹಿಸಿ")}
          </h1>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-[#A1A896]">
            {t(
              "GrainGuard connects you to verified, climate-controlled storage facilities with secure escrow payments. No middlemen. No risk.",
              "GrainGuard ನಿಮ್ಮನ್ನು ಪರಿಶೀಲಿಸಿದ, ಹವಾಮಾನ-ನಿಯಂತ್ರಿತ ಸಂಗ್ರಹಣಾ ಸೌಲಭ್ಯಗಳಿಗೆ ಸಂಪರ್ಕಿಸುತ್ತದೆ."
            )}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button
              size="lg"
              onClick={() => navigate({ to: "/login" })}
              className="h-14 gap-2 rounded-full bg-[#9CAF88] px-8 text-lg text-[#1C2216] hover:bg-[#87A96B]"
            >
              {t("Sign In to Book Storage", "ಸಂಗ್ರಹಣೆ ಬುಕ್ ಮಾಡಲು ಸೈನ್ ಇನ್")}
              <ArrowRight className="h-5 w-5" />
            </Button>
            <a href="#journey" className="inline-flex h-14 items-center gap-2 rounded-full border border-[#9CAF88]/30 px-8 text-lg font-medium text-[#9CAF88] hover:bg-[#9CAF88]/10">
              {t("How it Works", "ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ")}
            </a>
          </div>
        </div>
      </section>

      {/* Farmer Journey */}
      <section id="journey" className="mx-auto max-w-4xl px-4 py-24 sm:px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-black md:text-4xl">{t("Your Farming Journey", "ನಿಮ್ಮ ಕೃಷಿ ಪ್ರಯಾಣ")}</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("Four simple steps to secure your harvest.", "ನಿಮ್ಮ ಸುಗ್ಗಿಯನ್ನು ಸುರಕ್ಷಿತಗೊಳಿಸಲು ನಾಲ್ಕು ಸರಳ ಹಂತಗಳು.")}
          </p>
        </div>
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-border md:left-1/2 md:-translate-x-1/2" />
          {[
            { step: 1, title: t("Sign Up & Choose Crop", "ಸೈನ್ ಅಪ್ ಮಾಡಿ ಮತ್ತು ಬೆಳೆ ಆರಿಸಿ"), desc: t("Create your account, verify identity, and select from 20+ crop varieties.", "ಖಾತೆ ರಚಿಸಿ, ಗುರುತು ಪರಿಶೀಲಿಸಿ ಮತ್ತು 20+ ಬೆಳೆ ಪ್ರಕಾರಗಳಿಂದ ಆಯ್ಕೆ."), icon: Sprout },
            { step: 2, title: t("Find Verified Storage", "ಪರಿಶೀಲಿಸಿದ ಸಂಗ್ರಹಣೆ ಹುಡುಕಿ"), desc: t("Browse nearby facilities on map or list view. Filter by crop type, distance, and rating.", "ನಕ್ಷೆ ಅಥವಾ ಪಟ್ಟಿ ವೀಕ್ಷಣೆಯಲ್ಲಿ ಸಮೀಪದ ಸೌಲಭ್ಯಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ."), icon: Warehouse },
            { step: 3, title: t("Sign Smart Contract", "ಸ್ಮಾರ್ಟ್ ಒಪ್ಪಂದಕ್ಕೆ ಸಹಿ"), desc: t("Review terms in plain language and digitally sign the agreement.", "ಸರಳ ಭಾಷೆಯಲ್ಲಿ ನಿಯಮಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಡಿಜಿಟಲ್ ಸಹಿ ಮಾಡಿ."), icon: ShieldCheck },
            { step: 4, title: t("Pay via Escrow & Track", "ಎಸ್ಕ್ರೋ ಮೂಲಕ ಪಾವತಿ & ಟ್ರ್ಯಾಕ್"), desc: t("Funds held securely until check-out. Monitor climate conditions 24/7.", "ಚೆಕ್-ಔಟ್ ವರೆಗೆ ಹಣ ಸುರಕ್ಷಿತ. 24/7 ಹವಾಮಾನ ಮೇಲ್ವಿಚಾರಣೆ."), icon: TrendingUp },
          ].map((item, i) => (
            <div key={item.step} className={`relative mb-12 flex w-full items-center ${i % 2 === 0 ? "md:justify-start" : "md:justify-end"}`}>
              <div className="tree-dot animate-pulse-glow absolute left-8 h-8 w-8 -translate-x-1/2 rounded-full border-4 border-background bg-primary md:left-1/2" />
              <div className={`tree-node ml-16 w-full cursor-default rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] md:ml-0 md:w-[45%] ${i % 2 === 0 ? "md:pr-8" : "md:pl-8"}`}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold">{item.title}</h3>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Farmer Pricing */}
      <section id="pricing" className="bg-muted/30 py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-black md:text-4xl">{t("Farmer Pricing", "ರೈತರ ಬೆಲೆ")}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{t("Free to browse. Only pay when you book.", "ಬ್ರೌಸ್ ಮಾಡಲು ಉಚಿತ. ಬುಕ್ ಮಾಡಿದಾಗ ಮಾತ್ರ ಪಾವತಿ.")}</p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-4xl font-black text-primary">{t("Free", "ಉಚಿತ")}</span>
              <span className="text-lg text-muted-foreground">{t("to browse & search", "ಹುಡುಕಲು ಮತ್ತು ಬ್ರೌಸ್ ಮಾಡಲು")}</span>
            </div>
            <p className="text-muted-foreground mb-6">
              {t("Storage fees are calculated based on duration, grain type, and weight — set transparently by each facility owner.", "ಸಂಗ್ರಹಣಾ ಶುಲ್ಕಗಳನ್ನು ಅವಧಿ, ಧಾನ್ಯದ ಪ್ರಕಾರ ಮತ್ತು ತೂಕದ ಆಧಾರದ ಮೇಲೆ ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತದೆ.")}
            </p>
            <div className="flex flex-wrap gap-3 mb-6">
              {["Free Search", "Free Market Insights", "Secure Transactions", "Climate Monitoring"].map((f) => (
                <span key={f} className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">{f}</span>
              ))}
            </div>
            <div className="rounded-xl bg-success/10 border border-success/20 p-4">
              <div className="flex items-center gap-2 mb-2 font-bold text-success">
                <ShieldCheck className="h-5 w-5" />
                {t("Secure Escrow Protection", "ಸುರಕ್ಷಿತ ಎಸ್ಕ್ರೋ ರಕ್ಷಣೆ")}
              </div>
              <p className="text-sm text-foreground/80">
                {t("Payments are held in a secure escrow account and only released to the owner after you confirm Check-Out. 100% money-back protection if the facility fails standards.", "ಪಾವತಿಗಳನ್ನು ಸುರಕ್ಷಿತ ಎಸ್ಕ್ರೋ ಖಾತೆಯಲ್ಲಿ ಇರಿಸಲಾಗುತ್ತದೆ. ನೀವು ಚೆಕ್-ಔಟ್ ದೃಢಪಡಿಸಿದ ನಂತರವೇ ಮಾಲೀಕರಿಗೆ ಬಿಡುಗಡೆ.")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Market Insights Preview */}
      <section id="market" className="py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-black md:text-4xl">{t("Market Insights", "ಮಾರುಕಟ್ಟೆ ಒಳನೋಟಗಳು")}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{t("Free access to real-time crop price trends for all farmers.", "ಎಲ್ಲ ರೈತರಿಗೆ ನೈಜ-ಸಮಯದ ಬೆಳೆ ಬೆಲೆ ಒಳನೋಟಗಳಿಗೆ ಉಚಿತ ಪ್ರವೇಶ.")}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { crop: t("Rice", "ಅಕ್ಕಿ"), price: "₹2,140", change: "+4.2%", up: true },
              { crop: t("Wheat", "ಗೋಧಿ"), price: "₹2,275", change: "+1.8%", up: true },
              { crop: t("Ragi", "ರಾಗಿ"), price: "₹3,520", change: "+6.1%", up: true },
              { crop: t("Maize", "ಮೆಕ್ಕೆಜೋಳ"), price: "₹1,890", change: "-0.5%", up: false },
            ].map((c) => (
              <div key={c.crop} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold">{c.crop}</span>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-black">{c.price}</div>
                <div className="text-xs text-muted-foreground">{t("per Quintal", "ಪ್ರತಿ ಕ್ವಿಂಟಾಲ್")}</div>
                <div className={`mt-2 text-sm font-bold ${c.up ? "text-success" : "text-destructive"}`}>{c.change}</div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">{t("Sign in for full predictive analytics and sell recommendations.", "ಸಂಪೂರ್ಣ ಊಹೆ ವಿಶ್ಲೇಷಣೆಗಾಗಿ ಸೈನ್ ಇನ್ ಮಾಡಿ.")}</p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-muted/30 py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-black md:text-4xl">{t("Contact Us", "ಸಂಪರ್ಕಿಸಿ")}</h2>
          <p className="mt-4 text-muted-foreground">support@grainguard.in · +91 80000 00000</p>
          <p className="mt-2 text-muted-foreground">GrainGuard HQ, Bengaluru, Karnataka, India</p>
        </div>
      </section>
    </PageShell>
  );
}
