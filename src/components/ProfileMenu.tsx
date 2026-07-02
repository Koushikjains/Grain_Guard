import { Link, useNavigate } from "@tanstack/react-router";
import {
  User as UserIcon,
  FileText,
  Settings,
  LogOut,
  BadgeCheck,
  Phone,
  Mail,
  ShieldCheck,
  Crown,
} from "lucide-react";
import { useApp } from "@/lib/app-context";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { MoreVertical, Star, MessageSquare } from "lucide-react";

export function ProfileMenu({ onItemClick }: { onItemClick?: () => void }) {
  const { user, logout, t, isKycVerified, role } = useApp();
  const navigate = useNavigate();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [rating, setRating] = useState(0);

  if (!user) return null;

  const initials = (user.name || user.phone || "U")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    onItemClick?.();
    navigate({ to: "/" });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Profile menu"
            className={cn(
              "flex items-center justify-center rounded-full border bg-card p-0.5 transition-all hover:shadow-[var(--shadow-soft)]",
              role === "owner" && user.membership === "Prime"
                ? "border-2 border-amber-400 hover:border-amber-500 ring-2 ring-amber-400/30"
                : "border-border hover:border-primary",
            )}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-foreground">
              {user.photo ? (
                <img src={user.photo} alt="" className="h-full w-full rounded-full object-cover" />
              ) : (
                initials
              )}
            </div>
          </button>
        </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-base font-bold text-foreground">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">
              {user.name || t("Add your name", "ನಿಮ್ಮ ಹೆಸರು ಸೇರಿಸಿ")}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              {isKycVerified ? (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-success">
                  <BadgeCheck className="h-3 w-3" />
                  {t("Verified Identity", "ಪರಿಶೀಲಿಸಿದ ಗುರುತು")}
                </span>
              ) : (
                <>
                  <BadgeCheck className="h-3 w-3 text-primary" />
                  <span className="font-mono">{user.uniqueId}</span>
                </>
              )}
              {role === "owner" && user.membership && (
                <span className="ml-2 inline-flex items-center gap-0.5 rounded-full bg-warning/20 px-2 py-0.5 text-[10px] font-bold text-warning-foreground uppercase tracking-wider">
                  <Crown className="h-3 w-3" />
                  {user.membership}
                </span>
              )}
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-xs text-muted-foreground space-y-1">
          <div className="flex items-center gap-1.5">
            <Phone className="h-3 w-3" /> {user.phone || "—"}
          </div>
          <div className="flex items-center gap-1.5">
            <Mail className="h-3 w-3" /> {user.email || t("No email", "ಇಮೇಲ್ ಇಲ್ಲ")}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs uppercase tracking-wide text-muted-foreground">
          {t("Account", "ಖಾತೆ")}
        </DropdownMenuLabel>
        <DropdownMenuItem asChild onClick={onItemClick}>
          <Link to="/farmer-details" className="cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4" />
            {t("My Details", "ನನ್ನ ವಿವರಗಳು")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild onClick={onItemClick}>
          <Link to="/orders" className="cursor-pointer">
            <FileText className="mr-2 h-4 w-4" />
            {t("Orders & Invoices", "ಆದೇಶಗಳು ಮತ್ತು ಸರಕುಪಟ್ಟಿ")}
          </Link>
        </DropdownMenuItem>
        {!isKycVerified && (
          <DropdownMenuItem asChild onClick={onItemClick}>
            <Link to="/kyc" className="cursor-pointer text-primary">
              <ShieldCheck className="mr-2 h-4 w-4" />
              {t("Verify Identity (KYC)", "ಗುರುತು ಪರಿಶೀಲನೆ (KYC)")}
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setFeedbackOpen(true);
            onItemClick?.();
          }}
          className="cursor-pointer"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          {t("Leave Feedback", "ಪ್ರತಿಕ್ರಿಯೆ ನೀಡಿ")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t("Logout", "ಲಾಗ್‌ಔಟ್")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("Leave Feedback", "ಪ್ರತಿಕ್ರಿಯೆ ನೀಡಿ")}</DialogTitle>
          <DialogDescription>
            {t("Rate your experience and tell us about the facility.", "ನಿಮ್ಮ ಅನುಭವವನ್ನು ರೇಟ್ ಮಾಡಿ ಮತ್ತು ಸೌಲಭ್ಯದ ಬಗ್ಗೆ ನಮಗೆ ತಿಳಿಸಿ.")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 ${
                    rating >= star ? "fill-warning text-warning" : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="grid gap-2">
            <Input id="facility" placeholder={t("Facility ID or Name (Optional)", "ಸೌಲಭ್ಯದ ಐಡಿ ಅಥವಾ ಹೆಸರು (ಐಚ್ಛಿಕ)")} />
          </div>
          <div className="grid gap-2">
            <Textarea
              id="comments"
              placeholder={t("Tell us what you liked or how we can improve...", "ನಿಮಗೆ ಏನು ಇಷ್ಟವಾಯಿತು ಅಥವಾ ನಾವು ಹೇಗೆ ಸುಧಾರಿಸಬಹುದು ಎಂದು ನಮಗೆ ತಿಳಿಸಿ...")}
              className="resize-none"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setFeedbackOpen(false)}>
            {t("Cancel", "ರದ್ದುಗೊಳಿಸಿ")}
          </Button>
          <Button type="button" onClick={() => setFeedbackOpen(false)}>
            {t("Submit Feedback", "ಪ್ರತಿಕ್ರಿಯೆ ಸಲ್ಲಿಸಿ")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
