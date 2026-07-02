import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Warehouse, ShieldCheck, TrendingUp, CheckCircle2, ArrowRight, Lock, Crown, Users, IndianRupee, BarChart3 } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-context";
import { useEffect } from "react";

export const Route = createFileRoute("/owner-facility")({
  head: () => ({
    meta: [
      { title: "Owner Facility — GrainGuard" },
      { name: "description", content: "List your storage facility on GrainGuard and earn." },
    ],
  }),
  component: OwnerFacilityLanding,
});

function OwnerFacilityLanding() {
  const { t, isAuthed, role, setPreAuthRole, setSelectedPlan, selectedPlan } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    setPreAuthRole("owner");
  }, [setPreAuthRole]);

  useEffect(() => {
    if (isAuthed) {
      navigate({ to: role === "owner" ? "/owner" : "/farmer", replace: true });
    }
  }, [isAuthed, role, navigate]);

  const goLogin = (plan: "Basic" | "Prime") => {
    setSelectedPlan(plan);
    navigate({ to: "/login" });
  };

  return (
    <PageShell>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#1C2216] text-[#EFEFEF]">
        <div className="absolute inset-0 topo-pattern opacity-10" aria-hidden />
        <div className="absolute inset-0 hero-glow" aria-hidden />
        <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 md:py-28 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#9CAF88]/20 px-3 py-1 text-xs font-semibold text-[#9CAF88]">
            <Warehouse className="h-3.5 w-3.5" />
            {t("For Facility Owners", "ಸೌಲಭ್ಯ ಮಾಲೀಕರಿಗಾಗಿ")}
          </span>
          <h1 className="mt-4 text-4xl font-black leading-tight text-white md:text-5xl tracking-tight">
            {t("Turn Your Warehouse Into Steady Revenue", "ನಿಮ್ಮ ಗೋದಾಮನ್ನು ಸ್ಥಿರ ಆದಾಯವನ್ನಾಗಿ ಪರಿವರ್ತಿಸಿ")}
          </h1>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-[#A1A896]">
            {t("List your facility, receive verified farmer bookings, and get guaranteed escrow payments. Automated capacity management included.", "ನಿಮ್ಮ ಸೌಲಭ್ಯವನ್ನು ಪಟ್ಟಿ ಮಾಡಿ, ಪರಿಶೀಲಿಸಿದ ರೈತ ಬುಕಿಂಗ್ ಪಡೆಯಿರಿ, ಮತ್ತು ಖಾತರಿಪಡಿಸಿದ ಎಸ್ಕ್ರೋ ಪಾವತಿಗಳನ್ನು ಪಡೆಯಿರಿ.")}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" onClick={() => navigate({ to: "/login" })} className="h-14 gap-2 rounded-full bg-[#9CAF88] px-8 text-lg text-[#1C2216] hover:bg-[#87A96B]">
              {t("Sign In to List Facility", "ಸೌಲಭ್ಯ ಪಟ್ಟಿ ಮಾಡಲು ಸೈನ್ ಇನ್")}
              <ArrowRight className="h-5 w-5" />
            </Button>
            <a href="#journey" className="inline-flex h-14 items-center gap-2 rounded-full border border-[#9CAF88]/30 px-8 text-lg font-medium text-[#9CAF88] hover:bg-[#9CAF88]/10">
              {t("How it Works", "ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ")}
            </a>
          </div>
        </div>
      </section>

      {/* Owner Journey */}
      <section id="journey" className="mx-auto max-w-4xl px-4 py-24 sm:px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-black md:text-4xl">{t("Your Owner Journey", "ನಿಮ್ಮ ಮಾಲೀಕ ಪ್ರಯಾಣ")}</h2>
        </div>
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-border md:left-1/2 md:-translate-x-1/2" />
          {[
            { step: 1, title: t("Sign Up as Owner", "ಮಾಲೀಕರಾಗಿ ಸೈನ್ ಅಪ್"), desc: t("Register, verify identity, and choose your subscription plan.", "ನೋಂದಣಿ, ಗುರುತು ಪರಿಶೀಲಿಸಿ, ಮತ್ತು ಯೋಜನೆ ಆರಿಸಿ."), icon: Users },
            { step: 2, title: t("Add Your Facility", "ನಿಮ್ಮ ಸೌಲಭ್ಯ ಸೇರಿಸಿ"), desc: t("Define capacity, pricing, accepted grains, and pin location on the map.", "ಸಾಮರ್ಥ್ಯ, ಬೆಲೆ, ಸ್ವೀಕರಿಸಿದ ಧಾನ್ಯಗಳು, ಮತ್ತು ನಕ್ಷೆಯಲ್ಲಿ ಸ್ಥಾನ."), icon: Warehouse },
            { step: 3, title: t("Receive Bookings", "ಬುಕಿಂಗ್ ಸ್ವೀಕರಿಸಿ"), desc: t("Verified farmers request storage. Accept or decline within 24 hours.", "ಪರಿಶೀಲಿಸಿದ ರೈತರು ಸಂಗ್ರಹಣೆ ವಿನಂತಿಸುತ್ತಾರೆ. 24 ಗಂಟೆಗಳಲ್ಲಿ ಒಪ್ಪಿ ಅಥವಾ ತಿರಸ್ಕರಿಸಿ."), icon: ShieldCheck },
            { step: 4, title: t("Get Paid via Escrow", "ಎಸ್ಕ್ರೋ ಮೂಲಕ ಪಾವತಿ ಪಡೆಯಿರಿ"), desc: t("Payment auto-released after check-in and check-out are confirmed.", "ಚೆಕ್-ಇನ್ ಮತ್ತು ಚೆಕ್-ಔಟ್ ದೃಢಪಡಿಸಿದ ನಂತರ ಪಾವತಿ ಸ್ವಯಂ-ಬಿಡುಗಡೆ."), icon: TrendingUp },
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

      {/* Owner Pricing */}
      <section id="pricing" className="bg-muted/30 py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-black md:text-4xl">{t("Owner Plans", "ಮಾಲೀಕರ ಯೋಜನೆಗಳು")}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{t("Choose the plan that matches your business.", "ನಿಮ್ಮ ವ್ಯಾಪಾರಕ್ಕೆ ಹೊಂದಿಕೊಳ್ಳುವ ಯೋಜನೆ ಆರಿಸಿ.")}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Basic */}
            <div className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
              <h3 className="text-2xl font-bold">{t("Basic", "ಮೂಲ")}</h3>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-black">₹159</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t("per storage facility listed", "ಪಟ್ಟಿ ಮಾಡಿದ ಪ್ರತಿ ಸಂಗ್ರಹಣಾ ಸೌಲಭ್ಯಕ್ಕೆ")}</p>
              <p className="mt-4 text-sm text-muted-foreground">{t("Pay a fixed listing fee for every new storage facility added.", "ಸೇರಿಸಲಾದ ಪ್ರತಿ ಹೊಸ ಸಂಗ್ರಹಣಾ ಸೌಲಭ್ಯಕ್ಕೂ ನಿಗದಿತ ಪಟ್ಟಿ ಶುಲ್ಕ ಪಾವತಿಸಿ.")}</p>
              <ul className="mt-6 space-y-3">
                {[
                  t("Secure Escrow Payments", "ಸುರಕ್ಷಿತ ಎಸ್ಕ್ರೋ ಪಾವತಿ"),
                  t("Verified Farmer Bookings", "ಪರಿಶೀಲಿಸಿದ ರೈತ ಬುಕಿಂಗ್"),
                  t("Standard Support", "ಸ್ಟ್ಯಾಂಡರ್ಡ್ ಬೆಂಬಲ"),
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-primary" /> {f}</li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-border space-y-2">
                {[
                  t("Current Market Insights Access", "ಪ್ರಸ್ತುತ ಮಾರುಕಟ್ಟೆ ಒಳನೋಟ"),
                  t("Predictive Analytics", "ಊಹಾತ್ಮಕ ವಿಶ್ಲೇಷಣೆ"),
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground"><Lock className="h-4 w-4" /> {f} <span className="ml-auto text-[10px] font-bold text-warning">PRIME ONLY</span></div>
                ))}
              </div>
              <Button size="lg" variant="outline" className="mt-8 w-full rounded-xl" onClick={() => goLogin("Basic")}>
                {t("Start Free", "ಉಚಿತವಾಗಿ ಪ್ರಾರಂಭಿಸಿ")}
              </Button>
            </div>

            {/* Prime */}
            <div className="relative rounded-3xl border-2 border-primary bg-primary/5 p-8 shadow-[var(--shadow-elevated)]">
              <div className="absolute -top-4 right-8 rounded-full bg-primary px-4 py-1 text-sm font-bold text-primary-foreground">
                {t("Recommended", "ಶಿಫಾರಸು")}
              </div>
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2"><Crown className="h-5 w-5" /> {t("Prime", "ಪ್ರೀಮಿಯಂ")}</h3>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-black">₹999</span>
                <span className="text-lg text-muted-foreground">{t("/ month", "/ ತಿಂಗಳು")}</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{t("Unlimited listings. Full analytics.", "ಅನಿಯಮಿತ ಪಟ್ಟಿಗಳು. ಸಂಪೂರ್ಣ ವಿಶ್ಲೇಷಣೆ.")}</p>
              <ul className="mt-6 space-y-3">
                {[
                  t("Unlimited Facility Listings", "ಅನಿಯಮಿತ ಸೌಲಭ್ಯ ಪಟ್ಟಿಗಳು"),
                  t("Priority Search Ranking", "ಆದ್ಯತೆ ಹುಡುಕಾಟ ಶ್ರೇಣೀಕರಣ"),
                  t("Current Market Insights Access", "ಪ್ರಸ್ತುತ ಮಾರುಕಟ್ಟೆ ಒಳನೋಟ"),
                  t("Predictive Analytics", "ಊಹಾತ್ಮಕ ವಿಶ್ಲೇಷಣೆ"),
                  t("24/7 Chat Support", "24/7 ಚಾಟ್ ಬೆಂಬಲ"),
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-primary" /> {f}</li>
                ))}
              </ul>
              <Button size="lg" className="mt-8 w-full rounded-xl" onClick={() => goLogin("Prime")}>
                {t("Go Prime", "ಪ್ರೀಮಿಯಂ ಪಡೆಯಿರಿ")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-black md:text-4xl">{t("Contact Us", "ಸಂಪರ್ಕಿಸಿ")}</h2>
          <p className="mt-4 text-muted-foreground">support@grainguard.in · +91 80000 00000</p>
          <p className="mt-2 text-muted-foreground">GrainGuard HQ, Bengaluru, Karnataka, India</p>
        </div>
      </section>
    </PageShell>
  );
}
