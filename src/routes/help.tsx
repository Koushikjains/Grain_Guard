import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Star,
  MessageSquare,
  LifeBuoy,
  Send,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useApp } from "@/lib/app-context";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & Support — GrainGuard" },
      { name: "description", content: "Get help, share feedback, and rate cold grain storages." },
      { property: "og:title", content: "Help & Support — GrainGuard" },
      {
        property: "og:description",
        content: "Support form and farmer reviews of storage facilities.",
      },
    ],
  }),
  component: Help,
});

function Help() {
  const { t } = useApp();
  const [sent, setSent] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewSent, setReviewSent] = useState(false);

  return (
    <PageShell>
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <LifeBuoy className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{t("Help & Support", "ಸಹಾಯ ಮತ್ತು ಬೆಂಬಲ")}</h1>
            <p className="text-sm text-muted-foreground">
              {t("We're here whenever you need us.", "ನಿಮಗೆ ಬೇಕಾದಾಗ ನಾವು ಇಲ್ಲಿದ್ದೇವೆ.")}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Contact info */}
          <div className="space-y-3">
            <ContactCard
              icon={Mail}
              title={t("Email", "ಇಮೇಲ್")}
              value="support@grainguard.example"
            />
            <ContactCard icon={Phone} title={t("Phone", "ಫೋನ್")} value="+91 00000 00000" />
            <ContactCard icon={MapPin} title={t("Address", "ವಿಳಾಸ")} value="Karnataka, India" />
            <div className="rounded-xl border border-primary/30 bg-primary-soft/40 p-4">
              <h3 className="text-sm font-semibold">{t("Quick FAQ", "ಸಣ್ಣ FAQ")}</h3>
              <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                <li>
                  •{" "}
                  {t(
                    "Escrow releases when storage starts.",
                    "ಸಂಗ್ರಹಣೆ ಪ್ರಾರಂಭವಾದಾಗ ಎಸ್ಕ್ರೋ ಬಿಡುಗಡೆ.",
                  )}
                </li>
                <li>
                  • {t("Refunds happen within 3 working days.", "3 ಕೆಲಸದ ದಿನಗಳಲ್ಲಿ ಮರುಪಾವತಿ.")}
                </li>
                <li>• {t("Owner KYC verified before listing.", "ಮಾಲೀಕರ KYC ಪರಿಶೀಲಿತ.")}</li>
              </ul>
            </div>
          </div>

          {/* Support form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]"
          >
            <h2 className="font-semibold">{t("Send us a message", "ನಮಗೆ ಸಂದೇಶ ಕಳುಹಿಸಿ")}</h2>
            {sent ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-success" />
                <h3 className="text-lg font-semibold">{t("Message sent", "ಸಂದೇಶ ಕಳುಹಿಸಲಾಗಿದೆ")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("We'll get back to you soon.", "ನಾವು ಶೀಘ್ರದಲ್ಲೇ ಪ್ರತಿಕ್ರಿಯಿಸುತ್ತೇವೆ.")}
                </p>
                <Button type="button" variant="outline" onClick={() => setSent(false)}>
                  {t("Send another", "ಇನ್ನೊಂದು ಕಳುಹಿಸಿ")}
                </Button>
              </div>
            ) : (
              <>
                <div>
                  <Label htmlFor="name">{t("Name", "ಹೆಸರು")}</Label>
                  <Input id="name" required className="mt-1.5 h-11" />
                </div>
                <div>
                  <Label htmlFor="phone">{t("Phone", "ಫೋನ್")}</Label>
                  <Input id="phone" type="tel" required className="mt-1.5 h-11" />
                </div>
                <div>
                  <Label htmlFor="msg">{t("Message", "ಸಂದೇಶ")}</Label>
                  <Textarea id="msg" required rows={4} className="mt-1.5" />
                </div>
                <Button type="submit" size="lg" className="w-full gap-2">
                  <Send className="h-4 w-4" />
                  {t("Send Message", "ಸಂದೇಶ ಕಳುಹಿಸಿ")}
                </Button>
              </>
            )}
          </form>
        </div>

        {/* Reviews */}
        <div className="mt-10">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">
              {t("Reviews & Feedback", "ವಿಮರ್ಶೆಗಳು ಮತ್ತು ಪ್ರತಿಕ್ರಿಯೆ")}
            </h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {t(
              "Rate cold grain storages you've used to help other farmers.",
              "ಇತರ ರೈತರಿಗೆ ಸಹಾಯ ಮಾಡಲು ನೀವು ಬಳಸಿದ ಸಂಗ್ರಹಣೆಗಳನ್ನು ರೇಟ್ ಮಾಡಿ.",
            )}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setReviewSent(true);
            }}
            className="mt-4 space-y-4 rounded-xl border border-border bg-card p-6"
          >
            {reviewSent ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <CheckCircle2 className="h-10 w-10 text-success" />
                <p className="font-semibold">
                  {t("Thanks for your review!", "ನಿಮ್ಮ ವಿಮರ್ಶೆಗೆ ಧನ್ಯವಾದಗಳು!")}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setReviewSent(false);
                    setRating(0);
                  }}
                >
                  {t("Submit another", "ಇನ್ನೊಂದು ಸಲ್ಲಿಸಿ")}
                </Button>
              </div>
            ) : (
              <>
                <div>
                  <Label htmlFor="storage">{t("Storage facility name", "ಸೌಲಭ್ಯ ಹೆಸರು")}</Label>
                  <Input id="storage" required className="mt-1.5 h-11" />
                </div>
                <div>
                  <Label>{t("Your rating", "ನಿಮ್ಮ ರೇಟಿಂಗ್")}</Label>
                  <div className="mt-1.5 flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setRating(n)}
                        aria-label={`${n} star`}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={cn(
                            "h-8 w-8",
                            n <= rating
                              ? "fill-warning text-warning-foreground"
                              : "text-muted-foreground",
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="review">{t("Your feedback", "ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆ")}</Label>
                  <Textarea
                    id="review"
                    required
                    rows={3}
                    className="mt-1.5"
                    placeholder={t("How was your experience?", "ನಿಮ್ಮ ಅನುಭವ ಹೇಗಿತ್ತು?")}
                  />
                </div>
                <Button type="submit" disabled={rating === 0} size="lg" className="w-full">
                  {t("Submit Review", "ವಿಮರ್ಶೆ ಸಲ್ಲಿಸಿ")}
                </Button>
              </>
            )}
          </form>
        </div>
      </section>
    </PageShell>
  );
}

function ContactCard({
  icon: Icon,
  title,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
      <Icon className="h-5 w-5 text-primary" />
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{value}</div>
      </div>
    </div>
  );
}
