import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ChatbotWidget } from "./ChatbotWidget";
import { Watermark } from "./Watermark";

export function PageShell({
  children,
  watermark = true,
}: {
  children: ReactNode;
  watermark?: boolean;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {watermark && <Watermark />}
      <Navbar />
      <main className="page-fade-in relative z-10 flex-1">{children}</main>
      <Footer />
      <ChatbotWidget />
    </div>
  );
}
