import { useState, useRef, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Bot, X, Send, Sparkles, Wheat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/lib/app-context";
import { cn } from "@/lib/utils";

export function ChatbotWidget() {
  const { t, role } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{text: string, isUser: boolean}[]>([
    {
      text: "Namaste! I can help with finding storage, payments, or your bookings. What do you need?",
      isUser: false
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { text, isUser: true }]);
    setMessage("");

      // Simulate bot thinking
      setTimeout(() => {
        const lower = text.toLowerCase();
        let reply = t("I'm still learning! But I can take you to your dashboard to manage your crops.", "ನಾನು ಇನ್ನೂ ಕಲಿಯುತ್ತಿದ್ದೇನೆ! ಆದರೆ ನಿಮ್ಮ ಬೆಳೆಗಳನ್ನು ನಿರ್ವಹಿಸಲು ನಾನು ನಿಮ್ಮನ್ನು ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಕರೆದೊಯ್ಯಬಲ್ಲೆ.");
        let route = "";
        const isOwner = role === "owner" || window.location.pathname.startsWith("/owner");

        if (lower.includes("storage") || lower.includes("ಸಂಗ್ರಹಣೆ") || lower.includes("near me")) {
          reply = t("I can help you find storage! Taking you to the search page...", "ಸಂಗ್ರಹಣೆಯನ್ನು ಹುಡುಕಲು ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ! ಹುಡುಕಾಟ ಪುಟಕ್ಕೆ ನಿಮ್ಮನ್ನು ಕರೆದೊಯ್ಯಲಾಗುತ್ತಿದೆ...");
          route = isOwner ? "/owner" : "/farmer";
        } else if (lower.includes("escrow") || lower.includes("ಎಸ್ಕ್ರೋ")) {
          reply = t("Escrow holds your payment securely until the storage begins. The owner gets paid only when your crops are safely stored.", "ಸಂಗ್ರಹಣೆ ಪ್ರಾರಂಭವಾಗುವವರೆಗೆ ಎಸ್ಕ್ರೋ ನಿಮ್ಮ ಪಾವತಿಯನ್ನು ಸುರಕ್ಷಿತವಾಗಿರಿಸುತ್ತದೆ.");
        } else if (lower.includes("payment") || lower.includes("ಪಾವತಿ")) {
          reply = t("Taking you to your active bookings where you can manage payments.", "ನಿಮ್ಮ ಪಾವತಿಗಳನ್ನು ನಿರ್ವಹಿಸಲು ನಿಮ್ಮ ಸಕ್ರಿಯ ಬುಕಿಂಗ್‌ಗಳಿಗೆ ಕರೆದೊಯ್ಯಲಾಗುತ್ತಿದೆ.");
          route = isOwner ? "/owner/bookings" : "/farmer/active";
        } else if (lower.includes("offline") || lower.includes("ಆಫ್‌ಲೈನ್")) {
          reply = t("Yes! GrainGuard uses SMS to work even without mobile data.", "ಹೌದು! ಮೊಬೈಲ್ ಡೇಟಾ ಇಲ್ಲದೆಯೂ ಕೆಲಸ ಮಾಡಲು GrainGuard SMS ಬಳಸುತ್ತದೆ.");
        } else if (lower.includes("market") || lower.includes("ಮಾರುಕಟ್ಟೆ") || lower.includes("price") || lower.includes("ಬೆಲೆ")) {
          reply = t("Market prices are updated daily. Taking you to market insights.", "ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳನ್ನು ಪ್ರತಿದಿನ ನವೀಕರಿಸಲಾಗುತ್ತದೆ. ನಿಮ್ಮನ್ನು ಮಾರುಕಟ್ಟೆ ಒಳನೋಟಗಳಿಗೆ ಕರೆದೊಯ್ಯಲಾಗುತ್ತಿದೆ.");
          route = isOwner ? "/owner/market-insights" : "/farmer/insights";
        } else if (lower.includes("insured") || lower.includes("ವಿಮೆ")) {
          reply = t("All verified warehouses provide basic insurance against fire and theft.", "ಎಲ್ಲಾ ಪರಿಶೀಲಿಸಿದ ಗೋದಾಮುಗಳು ಬೆಂಕಿ ಮತ್ತು ಕಳ್ಳತನದ ವಿರುದ್ಧ ಮೂಲ ವಿಮೆಯನ್ನು ಒದಗಿಸುತ್ತವೆ.");
        }

        setMessages(prev => [...prev, { text: reply, isUser: false }]);
        
        if (route) {
          setTimeout(() => {
            navigate({ to: route as any });
            // Optional: close it after navigating
            // setOpen(false); 
          }, 1500);
        }
      }, 600);
  };

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open chatbot"
        className={cn(
          "fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-elevated)] transition-all hover:scale-105 active:scale-95",
          open && "rotate-90",
        )}
      >
        {open ? <X className="h-6 w-6" /> : <Wheat className="h-6 w-6" />}
        {!open && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-success" />
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-elevated)] sm:w-96">
          <div className="flex items-center gap-3 border-b border-border bg-primary-soft px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold">
                {t("GrainGuard Sathi", "GrainGuard ಸಾಥಿ")}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("Ready to help", "ಸಹಾಯಕ್ಕೆ ಸಿದ್ಧ")}
              </div>
            </div>
          </div>

          <div
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm"
            style={{ maxHeight: 320 }}
          >
            {messages.map((msg, idx) => (
              <div key={idx} className={cn("flex items-start gap-2", msg.isUser && "flex-row-reverse")}>
                {!msg.isUser && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft">
                    <Bot className="h-3.5 w-3.5 text-primary" />
                  </div>
                )}
                <div 
                  className={cn(
                    "rounded-2xl px-3 py-2",
                    msg.isUser ? "rounded-tr-sm bg-primary text-primary-foreground" : "rounded-tl-sm bg-muted text-foreground"
                  )}
                >
                  {msg.isUser ? msg.text : t(msg.text, msg.text)}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
            
            <div className="flex flex-wrap gap-2 pt-2">
              {[
                t("How does escrow work?", "ಎಸ್ಕ್ರೋ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ?"),
                t("Find storage near me", "ಸಮೀಪದ ಸಂಗ್ರಹಣೆ"),
                t("Payment failed", "ಪಾವತಿ ವಿಫಲ"),
                t("Does it work offline without mobile data?", "ಮೊಬೈಲ್ ಡೇಟಾ ಇಲ್ಲದೆ ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ ಕೆಲಸ ಮಾಡುತ್ತದೆಯೇ?"),
                t("How to check market prices?", "ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸುವುದು ಹೇಗೆ?"),
                t("Is my grain insured?", "ನನ್ನ ಧಾನ್ಯಕ್ಕೆ ವಿಮೆ ಇದೆಯೇ?"),
              ].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSend(s)}
                  className="rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground hover:border-primary hover:bg-primary-soft text-left"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(message);
            }}
            className="flex items-center gap-2 border-t border-border bg-background p-3"
          >
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("Type a message...", "ಸಂದೇಶ ಬರೆಯಿರಿ...")}
              className="h-10"
            />
            <Button type="submit" size="icon" disabled={!message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
