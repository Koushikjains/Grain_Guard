import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, KeyRound, Languages, ShieldCheck, Wheat, IndianRupee, CheckCircle2, Crown, X, CreditCard, Lock, ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useApp } from "@/lib/app-context";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — GrainGuard" },
      { name: "description", content: "Login to GrainGuard with your phone number." },
    ],
  }),
  component: Login,
});

function Login() {
  const { t, language, setLanguage, sendOtpApi, verifyAndLoginApi, preAuthRole, selectedPlan, setSelectedPlan } = useApp();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [docId, setDocId] = useState("");
  const [email, setEmail] = useState("");
  const [ownerPlan, setOwnerPlan] = useState<"Basic" | "Prime">(selectedPlan);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"summary" | "gateway">("summary");
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Gateway state
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi">("card");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  // Determine role from global pre-auth state, default to farmer if not set
  const role = preAuthRole || "farmer";

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (phone.replace(/\D/g, "").length < 10) {
      setError(t("Enter a valid 10-digit phone number", "ಮಾನ್ಯ 10-ಅಂಕಿಯ ಫೋನ್ ನಂಬರ್ ನಮೂದಿಸಿ"));
      return;
    }
    try {
      await sendOtpApi(`+91${phone}`);
      setOtpSent(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to send OTP");
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (otp.length !== 6) {
      setError(t("Enter the 6-digit OTP", "6 ಅಂಕಿಯ OTP ನಮೂದಿಸಿ"));
      return;
    }
    
    if (role === "owner") {
      // Owner: trigger payment popup before completing login
      setPaymentOpen(true);
      setPaymentStep("summary");
    } else {
      // Farmer: direct login
      try {
        await verifyAndLoginApi({ phone: `+91${phone}`, otp, role: "farmer", name, address, docId });
        navigate({ to: "/farmer/active" });
      } catch (err: any) {
        setError(err.response?.data?.detail || "Invalid OTP or Registration failed");
      }
    }
  };

  const processGatewayPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === "card") {
      if (cardNumber.startsWith("4242")) {
        handlePaymentComplete();
      } else {
        alert(t("Payment Failed: Try again with a valid test card (4242...).", "ಪಾವತಿ ವಿಫಲವಾಗಿದೆ: ಮಾನ್ಯವಾದ ಪರೀಕ್ಷಾ ಕಾರ್ಡ್‌ನೊಂದಿಗೆ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ (4242...)."));
      }
    } else {
      if (upiId.includes("@")) {
        handlePaymentComplete();
      } else {
        alert(t("Payment Failed: Try again with a valid UPI ID (e.g. success@upi).", "ಪಾವತಿ ವಿಫಲವಾಗಿದೆ: ಮಾನ್ಯವಾದ UPI ID ನಮೂದಿಸಿ (ಉದಾ: success@upi)."));
      }
    }
  };

  const handlePaymentComplete = () => {
    setPaymentProcessing(true);
    setTimeout(async () => {
      try {
        await verifyAndLoginApi({ phone: `+91${phone}`, otp, role: "owner", name, address, docId, membership: ownerPlan });
        setPaymentProcessing(false);
        setPaymentOpen(false);
        navigate({ to: "/owner" });
      } catch (err: any) {
        setPaymentProcessing(false);
        setPaymentOpen(false);
        setError(err.response?.data?.detail || "Invalid OTP or Registration failed");
      }
    }, 1500);
  };

  return (
    <PageShell>
      <section className="mx-auto flex max-w-2xl flex-col px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-elevated)]">
            <Wheat className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-3xl font-bold">
            {role === "owner"
              ? t("Owner Registration", "ಮಾಲೀಕ ನೋಂದಣಿ")
              : t("Farmer Registration", "ರೈತ ನೋಂದಣಿ")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("Complete your details and verify to continue.", "ಮುಂದುವರಿಯಲು ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ.")}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-elevated)] md:p-8">
          {/* Language selector */}
          <div className="mb-5 rounded-lg border border-border bg-muted/40 p-3">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Languages className="h-3.5 w-3.5" />
              {t("Choose your language", "ನಿಮ್ಮ ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ")}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(["en", "kn"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLanguage(l)}
                  className={cn(
                    "rounded-md border-2 py-2 text-sm font-semibold transition-all",
                    language === l
                      ? "border-primary bg-primary-soft text-foreground"
                      : "border-border bg-background text-muted-foreground hover:border-primary/50",
                  )}
                >
                  {l === "en" ? "English" : "ಕನ್ನಡ"}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={otpSent ? verifyOtp : sendOtp} className="space-y-5">
            {/* Registration Details — shown before OTP */}
            {!otpSent && (
              <div className="space-y-4">
                <div>
                  <Label className="text-xs font-semibold">{t("Full Name", "ಪೂರ್ಣ ಹೆಸರು")}</Label>
                  <Input value={name} onChange={e => setName(e.target.value)} required className="mt-1" placeholder={t("Enter your name", "ನಿಮ್ಮ ಹೆಸರು ನಮೂದಿಸಿ")} />
                </div>
                <div>
                  <Label className="text-xs font-semibold">{t("Address", "ವಿಳಾಸ")}</Label>
                  <Input value={address} onChange={e => setAddress(e.target.value)} required className="mt-1" placeholder={t("Your physical address", "ನಿಮ್ಮ ಭೌತಿಕ ವಿಳಾಸ")} />
                </div>
                <div>
                  <Label className="text-xs font-semibold">
                    {role === "farmer"
                      ? t("Aadhaar or Kisan Card Number", "ಆಧಾರ್ ಅಥವಾ ಕಿಸಾನ್ ಕಾರ್ಡ್ ಸಂಖ್ಯೆ")
                      : t("Aadhaar Number", "ಆಧಾರ್ ಸಂಖ್ಯೆ")}
                  </Label>
                  <Input value={docId} onChange={e => setDocId(e.target.value)} required className="mt-1" placeholder="XXXX XXXX XXXX" />
                </div>
                <div>
                  <Label className="text-xs font-semibold">{t("Email (Optional)", "ಇಮೇಲ್ (ಐಚ್ಛಿಕ)")}</Label>
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1" />
                </div>
              </div>
            )}

            {/* Phone */}
            <div>
              <Label htmlFor="phone" className="text-sm font-semibold">
                {t("Mobile number", "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ")}
              </Label>
              <div className="relative mt-1.5">
                <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center gap-1 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  +91
                </span>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="XXXXXXXXXX"
                  className="h-12 pl-16 text-base tracking-wider"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  disabled={otpSent}
                  required
                />
              </div>
            </div>

            {/* Owner Plan Selector */}
            {role === "owner" && !otpSent && (
              <div className="rounded-xl border border-border bg-muted/20 p-5">
                <Label className="text-xs font-semibold mb-3 block">{t("Choose Subscription Plan", "ಚಂದಾದಾರಿಕೆ ಯೋಜನೆ ಆರಿಸಿ")}</Label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={cn(
                    "cursor-pointer rounded-xl border-2 p-4 transition-all",
                    ownerPlan === "Basic" ? "border-primary bg-primary-soft shadow-[var(--shadow-soft)]" : "border-border bg-background hover:border-primary/40"
                  )}>
                    <input type="radio" className="sr-only" checked={ownerPlan === "Basic"} onChange={() => { setOwnerPlan("Basic"); setSelectedPlan("Basic"); }} />
                    <div className="font-bold">Basic</div>
                    <div className="text-xs text-muted-foreground mt-1">{t("Pay fixed listing fee per storage added", "ಸೇರಿಸಿದ ಸಂಗ್ರಹಣೆಗೆ ನಿಗದಿತ ಪಟ್ಟಿ ಶುಲ್ಕ")}</div>
                  </label>
                  <label className={cn(
                    "cursor-pointer rounded-xl border-2 p-4 transition-all",
                    ownerPlan === "Prime" ? "border-primary bg-primary/10 shadow-[var(--shadow-soft)]" : "border-border bg-background hover:border-primary/40"
                  )}>
                    <input type="radio" className="sr-only" checked={ownerPlan === "Prime"} onChange={() => { setOwnerPlan("Prime"); setSelectedPlan("Prime"); }} />
                    <div className="font-bold text-primary flex items-center gap-1"><Crown className="h-3.5 w-3.5" /> Prime</div>
                    <div className="text-xs mt-1">₹999/mo · {t("Full Access", "ಸಂಪೂರ್ಣ ಪ್ರವೇಶ")}</div>
                  </label>
                </div>
              </div>
            )}

            {/* OTP */}
            {otpSent && (
              <div>
                <Label htmlFor="otp" className="text-sm font-semibold">
                  {t("Enter OTP sent to your phone", "ನಿಮ್ಮ ಫೋನ್‌ಗೆ ಕಳುಹಿಸಲಾದ OTP ನಮೂದಿಸಿ")}
                </Label>
                <div className="relative mt-1.5">
                  <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <div className="pl-10">
                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="h-12 w-12 text-lg" />
                        <InputOTPSlot index={1} className="h-12 w-12 text-lg" />
                        <InputOTPSlot index={2} className="h-12 w-12 text-lg" />
                        <InputOTPSlot index={3} className="h-12 w-12 text-lg" />
                        <InputOTPSlot index={4} className="h-12 w-12 text-lg" />
                        <InputOTPSlot index={5} className="h-12 w-12 text-lg" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {t("Enter exactly 6 digits", "ನಿಖರವಾಗಿ 6 ಅಂಕಿಗಳನ್ನು ನಮೂದಿಸಿ")}
                </p>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" size="lg" className="h-12 w-full text-base">
              {otpSent
                ? t("Verify & Continue", "ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಮುಂದುವರಿಸಿ")
                : t("Send OTP", "OTP ಕಳುಹಿಸಿ")}
            </Button>

            {otpSent && (
              <button
                type="button"
                onClick={() => { setOtpSent(false); setOtp(""); }}
                className="block w-full text-center text-sm text-muted-foreground underline-offset-4 hover:underline"
              >
                {t("Change phone number", "ಫೋನ್ ನಂಬರ್ ಬದಲಿಸಿ")}
              </button>
            )}

            <div className="flex items-start gap-2 rounded-lg bg-primary-soft/50 p-3 text-xs text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                {t(
                  "We use SMS-based one-time passwords to keep your account secure.",
                  "ನಿಮ್ಮ ಖಾತೆ ಸುರಕ್ಷಿತವಾಗಿರಿಸಲು SMS OTP ಬಳಸುತ್ತೇವೆ.",
                )}
              </span>
            </div>
          </form>
        </div>
      </section>

      {/* Payment Popup for Owners */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent className="sm:max-w-md overflow-hidden">
          {paymentStep === "summary" ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-primary" />
                  {t("Payment Summary", "ಪಾವತಿ ಸಾರಾಂಶ")}
                </DialogTitle>
                <DialogDescription>
                  {ownerPlan === "Prime"
                    ? t("Complete your Prime subscription payment to unlock all features.", "ಎಲ್ಲ ವೈಶಿಷ್ಟ್ಯಗಳನ್ನು ಅನ್ಲಾಕ್ ಮಾಡಲು ಪ್ರೈಮ್ ಚಂದಾದಾರಿಕೆ ಪಾವತಿ ಪೂರ್ಣಗೊಳಿಸಿ.")
                    : t("Pay the fixed listing fee to activate your first facility listing.", "ನಿಮ್ಮ ಮೊದಲ ಸೌಲಭ್ಯ ಪಟ್ಟಿಯನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಲು ನಿಗದಿತ ಪಟ್ಟಿ ಶುಲ್ಕ ಪಾವತಿಸಿ.")}
                </DialogDescription>
              </DialogHeader>

              <div className="py-6">
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
                  <div className="text-sm font-semibold text-muted-foreground mb-2">
                    {ownerPlan === "Prime" ? t("Prime Subscription", "ಪ್ರೈಮ್ ಚಂದಾದಾರಿಕೆ") : t("Basic Listing Fee", "ಮೂಲ ಪಟ್ಟಿ ಶುಲ್ಕ")}
                  </div>
                  <div className="text-5xl font-black text-primary">
                    {ownerPlan === "Prime" ? "₹999" : "₹159"}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {ownerPlan === "Prime" ? t("per month", "ಪ್ರತಿ ತಿಂಗಳು") : t("one-time fee", "ಒಂದು-ಬಾರಿ ಶುಲ್ಕ")}
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  {(ownerPlan === "Prime"
                    ? ["Unlimited listings", "Market Insights", "Priority ranking", "24/7 Chat Support"]
                    : ["1 facility listing", "Standard support", "Escrow protection"]
                  ).map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-success" /> {f}
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter className="flex-col gap-2 sm:flex-col">
                <Button size="lg" className="w-full h-12 text-base" onClick={() => setPaymentStep("gateway")}>
                  {t("Proceed to Payment Gateway", "ಪಾವತಿ ಗೇಟ್‌ವೇಗೆ ಮುಂದುವರಿಯಿರಿ")}
                </Button>
                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-success" />
                  {t("Secured payment gateway", "ಸುರಕ್ಷಿತ ಪಾವತಿ ಗೇಟ್‌ವೇ")}
                </div>
              </DialogFooter>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between pb-4 border-b border-border/50 mb-6 mt-2">
                <button type="button" onClick={() => setPaymentStep("summary")} className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-semibold absolute left-1/2 -translate-x-1/2">Payment Method</h2>
                <div className="w-9"></div> {/* Empty space for centering */}
              </div>

              <form onSubmit={processGatewayPayment} className="space-y-6">
                
                {/* Payment Options */}
                <div className="space-y-3">
                  {/* Credit Card Option */}
                  <label className={cn(
                    "flex items-center p-4 rounded-2xl cursor-pointer transition-all border",
                    paymentMethod === "card" 
                      ? "bg-white border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.08)]" 
                      : "bg-transparent border-transparent hover:bg-muted/50"
                  )}>
                    <input 
                      type="radio" 
                      name="payment_method" 
                      value="card" 
                      checked={paymentMethod === "card"} 
                      onChange={() => setPaymentMethod("card")}
                      className="sr-only" 
                    />
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-orange-100 mr-4 shrink-0">
                      <CreditCard className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground text-[15px]">Credit Card</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Use test card 4242...</div>
                    </div>
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                      paymentMethod === "card" ? "border-black" : "border-muted-foreground/30"
                    )}>
                      {paymentMethod === "card" && <div className="w-2.5 h-2.5 rounded-full bg-black"></div>}
                    </div>
                  </label>

                  {/* Card Inputs (Expandable) */}
                  {paymentMethod === "card" && (
                    <div className="pl-[4.5rem] pr-4 pb-2 space-y-3 animate-in slide-in-from-top-2 fade-in duration-200">
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input 
                          type="text" 
                          required={paymentMethod === "card"}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4242 4242 4242 4242"
                          className="w-full h-11 pl-10 pr-4 rounded-xl border-none bg-muted/50 focus:bg-muted focus:ring-0 text-sm outline-none transition-all"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input 
                          type="text" 
                          required={paymentMethod === "card"}
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full h-11 px-4 rounded-xl border-none bg-muted/50 focus:bg-muted focus:ring-0 text-sm outline-none transition-all"
                        />
                        <input 
                          type="text" 
                          required={paymentMethod === "card"}
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value)}
                          placeholder="CVC"
                          className="w-full h-11 px-4 rounded-xl border-none bg-muted/50 focus:bg-muted focus:ring-0 text-sm outline-none transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* UPI Option */}
                  <label className={cn(
                    "flex items-center p-4 rounded-2xl cursor-pointer transition-all border",
                    paymentMethod === "upi" 
                      ? "bg-white border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.08)]" 
                      : "bg-transparent border-transparent hover:bg-muted/50"
                  )}>
                    <input 
                      type="radio" 
                      name="payment_method" 
                      value="upi" 
                      checked={paymentMethod === "upi"} 
                      onChange={() => setPaymentMethod("upi")}
                      className="sr-only" 
                    />
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 mr-4 shrink-0">
                      <div className="font-bold text-blue-600 text-sm">UPI</div>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground text-[15px]">Google Pay / UPI</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Use success@upi</div>
                    </div>
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                      paymentMethod === "upi" ? "border-black" : "border-muted-foreground/30"
                    )}>
                      {paymentMethod === "upi" && <div className="w-2.5 h-2.5 rounded-full bg-black"></div>}
                    </div>
                  </label>

                  {/* UPI Inputs (Expandable) */}
                  {paymentMethod === "upi" && (
                    <div className="pl-[4.5rem] pr-4 pb-2 animate-in slide-in-from-top-2 fade-in duration-200">
                      <input 
                        type="text" 
                        required={paymentMethod === "upi"}
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="success@upi"
                        className="w-full h-11 px-4 rounded-xl border-none bg-muted/50 focus:bg-muted focus:ring-0 text-sm outline-none transition-all"
                      />
                    </div>
                  )}
                </div>

                {/* Promo Code Box */}
                <div className="flex items-center bg-[#E5C158] rounded-2xl p-1.5 mt-2 shadow-sm">
                  <div className="flex-1 px-4 text-white font-medium flex items-center gap-2 text-sm">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 11V13C21 16.7712 21 18.6569 19.8284 19.8284C18.6569 21 16.7712 21 13 21H11C7.22876 21 5.34315 21 4.17157 19.8284C3 18.6569 3 16.7712 3 13V11C3 7.22876 3 5.34315 4.17157 4.17157C5.34315 3 7.22876 3 11 3H13C16.7712 3 18.6569 3 19.8284 4.17157C21 5.34315 21 7.22876 21 11Z" stroke="white" strokeWidth="1.5"/>
                      <path d="M12 7V17M8 11L12 7L16 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Promo Code
                  </div>
                  <button type="button" className="bg-[#1A1A1A] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-black transition-colors">
                    Apply
                  </button>
                </div>

                {/* Summary Section */}
                <div className="pt-6 space-y-3 px-2">
                  <div className="flex justify-between items-center text-sm text-muted-foreground font-medium">
                    <span>Transfer Amount</span>
                    <span className="text-foreground font-bold">{ownerPlan === "Prime" ? "₹949.00" : "₹149.00"}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground font-medium">
                    <span>Additional Cost</span>
                    <span className="text-foreground font-bold">{ownerPlan === "Prime" ? "₹50.00" : "₹10.00"}</span>
                  </div>
                  
                  <div className="border-t border-dashed border-border my-2"></div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-muted-foreground">Total</span>
                    <span className="text-lg font-bold text-foreground">{ownerPlan === "Prime" ? "₹999.00" : "₹159.00"}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" size="lg" className="w-full h-14 bg-[#1A1A1A] hover:bg-black text-white font-semibold rounded-2xl text-base shadow-[0_8px_20px_rgb(0,0,0,0.15)]" disabled={paymentProcessing}>
                    {paymentProcessing ? t("Processing...", "ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ...") : `Pay`}
                  </Button>
                </div>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
