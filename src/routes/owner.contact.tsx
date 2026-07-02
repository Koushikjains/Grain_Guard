import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, Clock, MessageSquare, Send } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useApp } from "@/lib/app-context";
import { useState } from "react";

export const Route = createFileRoute("/owner/contact")({
  head: () => ({ meta: [{ title: "Contact Support — GrainGuard" }] }),
  component: OwnerContact,
});

function OwnerContact() {
  const { t, user } = useApp();
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <PageShell>
        <section className="mx-auto max-w-md px-4 py-16 text-center sm:px-6">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-elevated)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
              <MessageSquare className="h-8 w-8 text-success" />
            </div>
            <h1 className="mt-4 text-2xl font-bold">{t("Message Sent!", "ಸಂದೇಶ ಕಳುಹಿಸಲಾಗಿದೆ!")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("Our support team will get back to you within 24 hours.", "ನಮ್ಮ ಬೆಂಬಲ ತಂಡ 24 ಗಂಟೆಗಳೊಳಗೆ ಪ್ರತಿಕ್ರಿಯಿಸುತ್ತದೆ.")}
            </p>
            <Button className="mt-6 w-full" onClick={() => setSubmitted(false)}>
              {t("Send Another Message", "ಮತ್ತೊಂದು ಸಂದೇಶ ಕಳುಹಿಸಿ")}
            </Button>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-bold">{t("Contact Support", "ಬೆಂಬಲ ಸಂಪರ್ಕಿಸಿ")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("Need help managing your facility? We're here.", "ನಿಮ್ಮ ಸೌಲಭ್ಯ ನಿರ್ವಹಣೆಗೆ ಸಹಾಯ ಬೇಕೇ? ನಾವು ಇಲ್ಲಿದ್ದೇವೆ.")}
        </p>
        <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
            <div>
              <Label htmlFor="name">{t("Your Name", "ನಿಮ್ಮ ಹೆಸರು")}</Label>
              <Input id="name" required defaultValue={user?.name || ""} className="mt-1.5 h-12" />
            </div>
            <div>
              <Label htmlFor="subject">{t("Subject", "ವಿಷಯ")}</Label>
              <Input id="subject" required className="mt-1.5 h-12" placeholder={t("What do you need help with?", "ನಿಮಗೆ ಯಾವ ಸಹಾಯ ಬೇಕು?")} />
            </div>
            <div>
              <Label htmlFor="message">{t("Message", "ಸಂದೇಶ")}</Label>
              <Textarea id="message" required rows={4} className="mt-1.5 resize-none" />
            </div>
            <Button type="submit" size="lg" className="h-12 w-full gap-2">
              <Send className="h-4 w-4" /> {t("Send Message", "ಸಂದೇಶ ಕಳುಹಿಸಿ")}
            </Button>
          </form>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
            <Phone className="h-5 w-5 text-primary" />
            <div><div className="text-sm font-medium">+91 80-2345-6789</div><div className="text-xs text-muted-foreground">{t("Helpline", "ಹೆಲ್ಪ್‌ಲೈನ್")}</div></div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
            <Mail className="h-5 w-5 text-primary" />
            <div><div className="text-sm font-medium">support@grainguard.in</div><div className="text-xs text-muted-foreground">{t("Email", "ಇಮೇಲ್")}</div></div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
            <Clock className="h-5 w-5 text-primary" />
            <div><div className="text-sm font-medium">Mon–Sat, 9–6</div><div className="text-xs text-muted-foreground">{t("Hours", "ಸಮಯ")}</div></div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
