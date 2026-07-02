import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Wheat,
  Moon,
  Sun,
  Languages,
  LogIn,
  Menu,
  X,
  TrendingUp,
  LifeBuoy,
  Home,
  Info,
  CreditCard,
  Phone,
  Warehouse,
  Bell,
  BarChart3,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useApp } from "@/lib/app-context";
import { Button } from "@/components/ui/button";
import { ProfileMenu } from "./ProfileMenu";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/useInsightsAndAlerts";

export function Navbar() {
  const { theme, toggleTheme, language, setLanguage, t, isAuthed, role, preAuthRole, setPreAuthRole, user } = useApp();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: notifications = [] } = useNotifications(isAuthed);
  const unreadCount = notifications.filter((n: any) => !n.is_read).length;

  // Transparent-to-solid navbar on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isLanding = path === "/";
  const isFarmerLanding = path === "/farmer-storage";
  const isOwnerLanding = path === "/owner-facility";
  const isRoleLanding = isFarmerLanding || isOwnerLanding;
  const showSignIn = isRoleLanding && !isAuthed;

  // Role-aware navigation
  const links = isAuthed
    ? role === "owner"
      ? [
          { to: "/owner", label: t("Dashboard", "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್"), icon: Warehouse },
          { to: "/owner/bookings", label: t("Bookings", "ಬುಕಿಂಗ್"), icon: TrendingUp },
          { to: "/owner/market-insights", label: t("Market Insights", "ಮಾರುಕಟ್ಟೆ ಒಳನೋಟ"), icon: BarChart3 },
          { to: "/owner/contact", label: t("Contact Us", "ಸಂಪರ್ಕಿಸಿ"), icon: Phone },
        ]
      : [
          { to: "/farmer/active", label: t("My Storage", "ನನ್ನ ಸಂಗ್ರಹಣೆ"), icon: Home },
          { to: "/farmer/payment", label: t("Payment", "ಪಾವತಿ"), icon: TrendingUp },
          { to: "/farmer/insights", label: t("Market Insights", "ಮಾರುಕಟ್ಟೆ ಒಳನೋಟ"), icon: BarChart3 },
          { to: "/farmer/contact", label: t("Contact Us", "ಸಂಪರ್ಕಿಸಿ"), icon: Phone },
        ]
    : isFarmerLanding
      ? [
          { to: "/farmer-storage#journey", label: t("How it Works", "ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ"), icon: Info, isAnchor: true },
          { to: "/farmer-storage#pricing", label: t("Farmer Pricing", "ರೈತರ ಬೆಲೆ"), icon: LifeBuoy, isAnchor: true },
          { to: "/farmer-storage#market", label: t("Market Insights", "ಮಾರುಕಟ್ಟೆ ಒಳನೋಟ"), icon: TrendingUp, isAnchor: true },
          { to: "/farmer-storage#contact", label: t("Contact Us", "ಸಂಪರ್ಕಿಸಿ"), icon: Phone, isAnchor: true },
        ]
      : isOwnerLanding
        ? [
            { to: "/owner-facility#journey", label: t("How it Works", "ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ"), icon: Info, isAnchor: true },
            { to: "/owner-facility#pricing", label: t("Owner Pricing", "ಮಾಲೀಕರ ಬೆಲೆ"), icon: LifeBuoy, isAnchor: true },
            { to: "/owner-facility#contact", label: t("Contact Us", "ಸಂಪರ್ಕಿಸಿ"), icon: Phone, isAnchor: true },
          ]
        : [
            { to: "/#about", label: t("About", "ನಮ್ಮ ಬಗ್ಗೆ"), icon: Info, isAnchor: true },
            { to: "/#pricing", label: t("Pricing", "ಬೆಲೆ"), icon: LifeBuoy, isAnchor: true },
            { to: "/#contact", label: t("Contact Us", "ಸಂಪರ್ಕಿಸಿ"), icon: Phone, isAnchor: true },
          ];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b transition-all duration-300",
        (isLanding || isRoleLanding) && !isAuthed && !scrolled
          ? "navbar-transparent"
          : "navbar-solid border-border bg-background/85 backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[var(--shadow-soft)]">
            <Wheat className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-bold text-foreground">GrainGuard</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => {
            const active = path === l.to;
            const className = cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary-soft text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            );
            if ('isAnchor' in l && l.isAnchor) {
              return (
                <a key={l.to} href={l.to} className={className}>
                  {l.label}
                </a>
              );
            }
            return (
              <Link key={l.to} to={l.to} className={className}>
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === "en" ? "kn" : "en")}
            className="gap-1.5"
            aria-label="Toggle language"
          >
            <Languages className="h-4 w-4" />
            <span className="text-xs font-semibold">{language === "en" ? "EN" : "ಕನ್"}</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          {isAuthed ? (
            <div className="flex items-center gap-2">
              {user?.uniqueId && (
                <span className="hidden items-center gap-1 rounded-full border border-primary/30 bg-primary-soft/50 px-2.5 py-1 text-[11px] font-bold text-primary xl:inline-flex">
                  {user.uniqueId}
                </span>
              )}
              {role === "farmer" && (
                <Link to="/farmer/alerts" className="relative rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              )}
              {role === "owner" && (
                <Link to="/owner/bookings" className="relative rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              )}
              <ProfileMenu />
            </div>
          ) : showSignIn ? (
            <Button onClick={() => {
              if (isFarmerLanding) setPreAuthRole("farmer");
              if (isOwnerLanding) setPreAuthRole("owner");
              navigate({ to: "/login" });
            }} size="sm" className="gap-1.5">
              <LogIn className="h-4 w-4" /> {t("Sign In", "ಲಾಗಿನ್")}
            </Button>
          ) : null}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          {isAuthed && <ProfileMenu />}
          <button
            className="rounded-md p-2 text-foreground"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {links.map((l) => {
              const className = "flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted";
              if ('isAnchor' in l && l.isAnchor) {
                return (
                  <a key={l.to} href={l.to} onClick={() => setOpen(false)} className={className}>
                    <l.icon className="h-4 w-4 text-primary" />
                    {l.label}
                  </a>
                );
              }
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={className}
                >
                  <l.icon className="h-4 w-4 text-primary" />
                  {l.label}
                </Link>
              );
            })}
            <div className="mt-2 flex items-center gap-2 border-t border-border pt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage(language === "en" ? "kn" : "en")}
                className="flex-1 gap-1.5"
              >
                <Languages className="h-4 w-4" />
                {language === "en" ? "English" : "ಕನ್ನಡ"}
              </Button>
              <Button variant="outline" size="sm" onClick={toggleTheme} className="gap-1.5">
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
            </div>
            {showSignIn && (
              <Button
                onClick={() => {
                  setOpen(false);
                  if (isFarmerLanding) setPreAuthRole("farmer");
                  if (isOwnerLanding) setPreAuthRole("owner");
                  navigate({ to: "/login" });
                }}
                size="sm"
                className="mt-2 gap-1.5"
              >
                <LogIn className="h-4 w-4" /> {t("Sign In", "ಲಾಗಿನ್")}
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
