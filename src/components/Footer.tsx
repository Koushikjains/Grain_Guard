import { Wheat, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useApp } from "@/lib/app-context";

export function Footer() {
  const { t } = useApp();
  return (
    <footer className="mt-auto border-t border-border bg-muted/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Wheat className="h-4 w-4" />
            </span>
            <span className="font-display text-lg font-bold">GrainGuard</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            {t(
              "Connecting farmers with trusted storage owners for safe grain storage.",
              "ಸುರಕ್ಷಿತ ಧಾನ್ಯ ಸಂಗ್ರಹಣೆಗಾಗಿ ರೈತರನ್ನು ವಿಶ್ವಾಸಾರ್ಹ ಸಂಗ್ರಹಣಾ ಮಾಲೀಕರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸುವುದು.",
            )}
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-foreground">
            {t("Explore", "ಅನ್ವೇಷಿಸಿ")}
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/" className="transition-colors hover:text-primary">
                {t("Home", "ಮುಖಪುಟ")}
              </Link>
            </li>
            <li>
              <a href="/#about" className="transition-colors hover:text-primary">
                {t("About", "ನಮ್ಮ ಬಗ್ಗೆ")}
              </a>
            </li>
            <li>
              <Link to="/market" className="transition-colors hover:text-primary">
                {t("Market Insights", "ಮಾರುಕಟ್ಟೆ ಒಳನೋಟಗಳು")}
              </Link>
            </li>
            <li>
              <Link to="/help" className="transition-colors hover:text-primary">
                {t("Help & Support", "ಸಹಾಯ ಮತ್ತು ಬೆಂಬಲ")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-foreground">{t("Contact", "ಸಂಪರ್ಕ")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              support@grainguard.example
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              +91 00000 00000
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Karnataka, India
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-foreground">
            {t("Follow Us", "ಅನುಸರಿಸಿ")}
          </h4>
          <div className="flex gap-3">
            {[
              { Icon: Facebook, label: "Facebook" },
              { Icon: Twitter, label: "Twitter" },
              { Icon: Instagram, label: "Instagram" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-center text-xs text-muted-foreground sm:flex-row sm:px-6">
          <span>
            © {new Date().getFullYear()} GrainGuard.{" "}
            {t("All rights reserved.", "ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.")}
          </span>
          <div className="flex gap-4">
            <Link to="/help" className="transition-colors hover:text-primary">
              {t("Support", "ಬೆಂಬಲ")}
            </Link>
            <a href="/#about" className="transition-colors hover:text-primary">
              {t("About", "ನಮ್ಮ ಬಗ್ಗೆ")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
