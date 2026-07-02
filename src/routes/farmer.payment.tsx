import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Loader2,
  CreditCard,
  WifiOff,
  Download,
  Hash,
  Vault,
  Lock
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-context";
import { cn } from "@/lib/utils";
import { FlowBreadcrumb } from "@/components/Breadcrumb";
import { useCreateBooking, useProcessEscrowPayment } from "@/hooks/useBookingActions";
import { useSearchFacilities } from "@/hooks/useFacilities";

interface SearchParams {
  id?: string;
  quantity?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  unit?: string;
  ref?: string;
  crop?: string;
  remainingCrops?: string;
}

export const Route = createFileRoute("/farmer/payment")({
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    id: typeof s.id === "string" ? s.id : undefined,
    quantity: typeof s.quantity === "string" ? s.quantity : undefined,
    startDate: typeof s.startDate === "string" ? s.startDate : undefined,
    endDate: typeof s.endDate === "string" ? s.endDate : undefined,
    duration: typeof s.duration === "string" ? s.duration : undefined,
    unit: typeof s.unit === "string" ? s.unit : undefined,
    ref: typeof s.ref === "string" ? s.ref : undefined,
    crop: typeof s.crop === "string" ? s.crop : undefined,
    remainingCrops: typeof s.remainingCrops === "string" ? s.remainingCrops : undefined,
  }),
  head: () => ({ meta: [{ title: "Escrow Payment — GrainGuard" }] }),
  component: Payment,
});

type Status = "idle" | "gateway" | "processing" | "success" | "failure" | "offline";

function Payment() {
  const { t, addBooking } = useApp();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("idle");
  const [online, setOnline] = useState(true);

  // Gateway state
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi">("card");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  useEffect(() => {
    setOnline(typeof navigator === "undefined" ? true : navigator.onLine);
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
    };
  }, []);

  const { data: backendFacilities = [] } = useSearchFacilities({});
  const storageData = backendFacilities.find((s: any) => s.id === search.id);
  const storage = storageData ? {
    id: storageData.id,
    name: storageData.name,
    location: storageData.address,
    price: storageData.price_per_kg_per_month,
  } : undefined;

  const qty = Number(search.quantity) || 0;
  
  const calculateDays = () => {
    if (!search.startDate || !search.endDate) return 30;
    try {
      const s = new Date(search.startDate);
      const e = new Date(search.endDate);
      if (isNaN(s.getTime()) || isNaN(e.getTime())) return 30;
      return Math.max(1, Math.ceil(Math.abs(e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)));
    } catch {
      return 30;
    }
  };
  
  const days = calculateDays();
  const durMonths = Math.max(1, Math.round(days / 30));
  const subtotal = storage ? (storage.price || 0) * qty * durMonths : 0;
  const fee = Math.round(subtotal * 0.02);
  const total = subtotal + fee;

  const { mutateAsync: createBooking } = useCreateBooking();
  const { mutateAsync: processEscrowPayment, isPending: isPaymentPending } = useProcessEscrowPayment();

  const handleSimulatedPayment = async (success: boolean) => {
    setStatus("processing");
    if (success && storage) {
      try {
        const bookedCrop = search.crop || "rice";
        const newBooking = await createBooking({
          facility_id: storage.id,
          crop_types: [bookedCrop],
          quantity: qty,
          duration_months: durMonths,
          total_cost: total,
        });

        await processEscrowPayment(newBooking.id);

        setStatus("success");
      } catch (err) {
        console.error("Payment or Booking failed", err);
        setStatus("failure");
      }
    } else {
      setStatus("failure");
    }
  };

  const processGatewayPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === "card") {
      if (cardNumber === "4242 4242 4242 4242" || cardNumber.startsWith("4242")) {
        handleSimulatedPayment(true);
      } else {
        handleSimulatedPayment(false); // Fail if it's not the test card
      }
    } else {
      if (upiId.includes("@")) {
        handleSimulatedPayment(true);
      } else {
        handleSimulatedPayment(false);
      }
    }
  };

  // Calculate remaining crops for sequential booking
  const bookedCrop = search.crop || "rice";
  const remainingCrops = search.remainingCrops
    ? search.remainingCrops.split(",").filter((c) => c !== bookedCrop)
    : [];

  if (!storage) {
    return (
      <PageShell>
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <h2 className="text-xl font-semibold">{t("Booking not found", "ಬುಕಿಂಗ್ ಸಿಗಲಿಲ್ಲ")}</h2>
          <Button asChild className="mt-4">
            <Link to="/farmer">{t("Start over", "ಮತ್ತೆ ಪ್ರಾರಂಭಿಸಿ")}</Link>
          </Button>
        </div>
      </PageShell>
    );
  }

  if (status === "gateway") {
    return (
      <PageShell>
        <section className="mx-auto max-w-md px-4 py-16 sm:px-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-elevated)] relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-border/50 mb-6 mt-2">
              <button type="button" onClick={() => setStatus("idle")} className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
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
                  "flex items-center p-4 rounded-2xl cursor-pointer transition-all duration-300 border active:scale-[0.98] hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]",
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
                  "flex items-center p-4 rounded-2xl cursor-pointer transition-all duration-300 border active:scale-[0.98] hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]",
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
                  <span className="text-foreground font-bold">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground font-medium">
                  <span>Additional Cost</span>
                  <span className="text-foreground font-bold">₹{fee.toLocaleString()}</span>
                </div>
                
                <div className="border-t border-dashed border-border my-2"></div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-muted-foreground">Total</span>
                  <span className="text-lg font-bold text-foreground">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" size="lg" className="w-full h-14 bg-[#1A1A1A] hover:bg-black text-white font-semibold rounded-2xl text-base shadow-[0_8px_20px_rgb(0,0,0,0.15)] transition-all duration-300 hover:shadow-xl active:scale-[0.98]" disabled={isPaymentPending}>
                  {isPaymentPending ? t("Processing...", "ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ...") : `Pay`}
                </Button>
              </div>
            </form>
          </div>
        </section>
      </PageShell>
    );
  }

  if (status === "success") {
    return (
      <PageShell>
        <section className="mx-auto max-w-md px-4 py-16 text-center sm:px-6">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-elevated)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
              <CheckCircle2 className="h-9 w-9 text-success" />
            </div>
            <h1 className="mt-4 text-2xl font-bold">
              {t("Storage Booked", "ಸಂಗ್ರಹಣೆ ಬುಕ್ ಆಗಿದೆ")}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t(
                "Your payment is held in escrow. Storage is confirmed.",
                "ನಿಮ್ಮ ಪಾವತಿಯನ್ನು ಎಸ್ಕ್ರೋದಲ್ಲಿ ಇಡಲಾಗಿದೆ. ಸಂಗ್ರಹಣೆ ದೃಢೀಕರಿಸಲಾಗಿದೆ.",
              )}
            </p>
            {search.ref && (
              <div className="mx-auto mt-4 inline-flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 font-mono text-xs">
                <Hash className="h-3 w-3" /> {search.ref}
              </div>
            )}
            <div className="mt-6 flex flex-col gap-2">
              <Button
                size="lg"
                className="w-full"
                onClick={() => navigate({ to: "/farmer/active" })}
              >
                {t("View My Storage", "ನನ್ನ ಸಂಗ್ರಹಣೆ ನೋಡಿ")}
              </Button>
              {remainingCrops.length > 0 && (
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full gap-2 border-primary text-primary hover:bg-primary-soft"
                  onClick={() =>
                    navigate({
                      to: "/farmer/storage",
                      search: {
                        crop: remainingCrops.join(","),
                        quantity: search.quantity,
                        duration: search.duration,
                        unit: search.unit,
                      },
                    })
                  }
                >
                  {t(`Continue to book ${remainingCrops.length} remaining crop(s)`, `ಉಳಿದ ${remainingCrops.length} ಬೆಳೆ(ಗಳು) ಬುಕ್ ಮಾಡಲು ಮುಂದುವರಿಸಿ`)}
                </Button>
              )}
              <Button asChild variant="outline" size="lg" className="w-full gap-2">
                <Link to="/orders">
                  <Download className="h-4 w-4" />
                  {t("Download Invoice", "ಸರಕುಪಟ್ಟಿ ಡೌನ್‌ಲೋಡ್")}
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </PageShell>
    );
  }

  if (status === "failure") {
    return (
      <PageShell>
        <section className="mx-auto max-w-md px-4 py-16 text-center sm:px-6">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-elevated)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/15">
              <XCircle className="h-9 w-9 text-destructive" />
            </div>
            <h1 className="mt-4 text-2xl font-bold">{t("Payment Failed", "ಪಾವತಿ ವಿಫಲವಾಗಿದೆ")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t(
                "Don't worry — your money is safe. Try again with a different card.",
                "ಚಿಂತಿಸಬೇಡಿ — ನಿಮ್ಮ ಹಣ ಸುರಕ್ಷಿತವಾಗಿದೆ. ಬೇರೆ ಕಾರ್ಡ್‌ನೊಂದಿಗೆ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
              )}
            </p>

            <div className="mt-6 flex flex-col gap-2">
              <Button size="lg" className="w-full" onClick={() => setStatus("gateway")}>
                {t("Retry Payment", "ಪಾವತಿ ಮರು ಪ್ರಯತ್ನಿಸಿ")}
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full">
                <Link to="/farmer">{t("Cancel", "ರದ್ದುಮಾಡಿ")}</Link>
              </Button>
            </div>
          </div>
        </section>
      </PageShell>
    );
  }

  if (status === "processing") {
    return (
      <PageShell>
        <section className="mx-auto max-w-md px-4 py-16 text-center sm:px-6">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-elevated)] flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
            <h2 className="text-xl font-bold">Processing Payment...</h2>
            <p className="text-muted-foreground text-sm mt-2">Please do not close this window.</p>
          </div>
        </section>
      </PageShell>
    );
  }

  if (status === "offline") {
    return (
      <PageShell>
        <section className="mx-auto max-w-md px-4 py-16 text-center sm:px-6">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-elevated)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-warning/15">
              <WifiOff className="h-9 w-9 text-warning-foreground" />
            </div>
            <h1 className="mt-4 text-2xl font-bold">
              {t("Network Dropped", "ನೆಟ್‌ವರ್ಕ್ ಕಡಿತಗೊಂಡಿದೆ")}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t(
                "Your contract state has been saved. Resume payment when you're back online.",
                "ನಿಮ್ಮ ಒಪ್ಪಂದ ಸ್ಥಿತಿ ಉಳಿಸಲಾಗಿದೆ. ಆನ್‌ಲೈನ್‌ಗೆ ಬಂದಾಗ ಪಾವತಿ ಮುಂದುವರಿಸಿ.",
              )}
            </p>
            <Button size="lg" className="mt-6 w-full" onClick={() => setStatus("idle")}>
              {t("Resume", "ಮುಂದುವರಿಸಿ")}
            </Button>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <FlowBreadcrumb
          current={3}
          steps={[
            { label: t("Summary", "ಸಾರಾಂಶ") },
            { label: t("Best Matches", "ಉತ್ತಮ ಹೊಂದಿಕೆಗಳು") },
            { label: t("Payment", "ಪಾವತಿ") },
          ]}
        />
        <Button asChild variant="ghost" className="mb-2 text-muted-foreground">
          <Link
            to="/farmer/contract"
            search={{
              id: storage.id,
              quantity: search.quantity,
              startDate: search.startDate,
              endDate: search.endDate,
              unit: search.unit,
            }}
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" /> {t("Back", "ಹಿಂದೆ")}
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{t("Escrow Payment", "ಎಸ್ಕ್ರೋ ಪಾವತಿ")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("Secured by GrainGuard Escrow Protocol", "GrainGuard ಎಸ್ಕ್ರೋ ಪ್ರೋಟೋಕಾಲ್ ಮೂಲಕ ಸುರಕ್ಷಿತ")}
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_320px]">
          <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <h2 className="text-lg font-semibold">{t("Booking Summary", "ಬುಕಿಂಗ್ ಸಾರಾಂಶ")}</h2>
            <div className="mt-4 space-y-2.5 text-sm">
              <Row label={t("Storage", "ಸಂಗ್ರಹಣೆ")} value={storage.name} />
              <Row label={t("Location", "ಸ್ಥಳ")} value={storage.location} />
              <Row label={t("Quantity", "ಪ್ರಮಾಣ")} value={`${qty} ${search.unit ?? "kg"}`} />
              <Row label={t("Duration", "ಅವಧಿ")} value={`${days} ${t("days", "ದಿನಗಳು")}`} />
              {search.ref && <Row label={t("Reference", "ಉಲ್ಲೇಖ")} value={search.ref} />}
              <div className="my-2 border-t border-border" />
              <Row label={t("Subtotal", "ಉಪಮೊತ್ತ")} value={`₹${subtotal.toLocaleString()}`} />
              <Row label={t("Service fee", "ಸೇವಾ ಶುಲ್ಕ")} value={`₹${fee.toLocaleString()}`} />
              <div className="my-2 border-t border-border" />
              <Row label={t("Total", "ಒಟ್ಟು")} value={`₹${total.toLocaleString()}`} bold />
            </div>

            <Button
              size="lg"
              className="mt-5 h-12 w-full gap-2 text-base bg-success hover:bg-success/90 transition-all duration-300 hover:shadow-lg active:scale-[0.98]"
              onClick={() => setStatus("gateway")}
            >
              <ShieldCheck className="h-4 w-4" />
              {t("Proceed to Payment Gateway", "ಪಾವತಿ ಗೇಟ್‌ವೇಗೆ ಮುಂದುವರಿಯಿರಿ")}
            </Button>
          </div>

          {/* Vault graphic */}
          <aside className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary-soft to-secondary/40 p-6 text-center relative overflow-hidden">
            <div className="glow-gradient absolute inset-0 opacity-40 mix-blend-overlay"></div>
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-card shadow-[var(--shadow-elevated)] animate-float relative z-10">
              <Vault
                className="h-12 w-12 text-primary"
              />
            </div>
            <h3 className="mt-4 font-bold relative z-10">{t("Escrow Guarantee", "ಎಸ್ಕ್ರೋ ಭರವಸೆ")}</h3>
            <p className="mt-2 text-xs text-muted-foreground relative z-10">
              {t(
                "Your money goes into a secure vault. It's released to the owner only after grain is safely stored.",
                "ನಿಮ್ಮ ಹಣ ಸುರಕ್ಷಿತ ವಾಲ್ಟ್‌ಗೆ ಹೋಗುತ್ತದೆ. ಧಾನ್ಯ ಸುರಕ್ಷಿತವಾಗಿ ಸಂಗ್ರಹವಾದ ನಂತರ ಮಾತ್ರ ಬಿಡುಗಡೆ.",
              )}
            </p>
            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-success animate-pulse-secure relative z-10">
              <ShieldCheck className="h-3.5 w-3.5" />
              {t("100% protected", "100% ರಕ್ಷಿತ")}
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={bold ? "text-base font-bold" : "font-medium"}>{value}</span>
    </div>
  );
}
