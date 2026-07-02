import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  TrendingUp,
  Users,
  BarChart3,
  Lock,
  Crown,
  Wheat,
  Thermometer,
  MapPin,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  ArrowLeft,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
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
import { useMarketInsights } from "@/hooks/useInsightsAndAlerts";
import { upgradeMembership } from "@/lib/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";

export const Route = createFileRoute("/owner/market-insights")({
  head: () => ({ meta: [{ title: "Market Insights — GrainGuard" }] }),
  component: OwnerMarketInsights,
});

function OwnerMarketInsights() {
  const { t, user, updateUser } = useApp();
  const navigate = useNavigate();
  const isPrime = user?.membership === "Prime";

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"summary" | "gateway">("summary");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi">("card");
  const [upiId, setUpiId] = useState("");
  // Gateway state
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

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

  const handlePaymentComplete = async () => {
    setPaymentProcessing(true);
    try {
      await upgradeMembership("prime");
      updateUser({ membership: "Prime" });
      setPaymentProcessing(false);
      setPaymentOpen(false);
      setPaymentStep("summary");
    } catch (err) {
      console.error(err);
      setPaymentProcessing(false);
      setPaymentOpen(false);
      setPaymentStep("summary");
      alert(t("Failed to process payment. Please try again.", "ಪಾವತಿ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ."));
    }
  };

  const { data: insights } = useMarketInsights();

  const demandCards = [
    {
      icon: Users,
      title: t("Active Farmer Demand", "ಸಕ್ರಿಯ ರೈತರ ಬೇಡಿಕೆ"),
      value: insights ? insights.regional_demand.reduce((acc: number, cur: any) => acc + cur.farmers_seeking, 0).toString() : "47",
      hint: t("Farmers seeking storage near you", "ನಿಮ್ಮ ಬಳಿ ಸ್ಟೋರೇಜ್ ಹುಡುಕುತ್ತಿರುವ ರೈತರು"),
      trend: "+12%",
    },
    {
      icon: Wheat,
      title: t("Local Crop Trends", "ಸ್ಥಳೀಯ ಬೆಳೆ ಪ್ರವೃತ್ತಿಗಳು"),
      value: insights && insights.high_demand_crops.length > 0 ? insights.high_demand_crops.slice(0, 2).join(", ") : t("Ragi, Paddy", "ರಾಗಿ, ಭತ್ತ"),
      hint: t("Top crops stored in your district this month", "ಈ ತಿಂಗಳು ನಿಮ್ಮ ಜಿಲ್ಲೆಯಲ್ಲಿ ಸಂಗ್ರಹಿಸಿದ ಉನ್ನತ ಬೆಳೆಗಳು"),
      trend: "+8%",
    },
    {
      icon: BarChart3,
      title: t("Avg Market Price", "ಸರಾಸರಿ ಮಾರುಕಟ್ಟೆ ಬೆಲೆ"),
      value: insights && insights.average_prices.length > 0 ? `₹${(insights.average_prices[0] / 100).toFixed(1)}/kg/mo` : "₹3.2/kg/mo",
      hint: t("Average rate within 25km radius", "25ಕಿಮೀ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ಸರಾಸರಿ ದರ"),
      trend: "-2%",
    },
  ];

  // Prepare data for the LineChart
  // Take the first 3 crop trends to avoid clutter
  const topCropTrends = insights?.crop_trends?.slice(0, 3) || [];
  
  // Format data for Recharts LineChart: { month: "Jan", Paddy: 1200, Ragi: 1500 }
  const chartData = [];
  if (topCropTrends.length > 0) {
    const months = topCropTrends[0].history.map((h: any) => h.month);
    for (let i = 0; i < months.length; i++) {
      const dataPoint: any = { month: months[i] };
      topCropTrends.forEach((trend: any) => {
        dataPoint[trend.crop] = trend.history[i].price;
      });
      chartData.push(dataPoint);
    }
  } else {
    // Fallback mock data if loading/empty
    chartData.push(
      { month: "Jan", Paddy: 280, Ragi: 350 },
      { month: "Feb", Paddy: 285, Ragi: 360 },
      { month: "Mar", Paddy: 290, Ragi: 345 },
      { month: "Apr", Paddy: 275, Ragi: 340 },
      { month: "May", Paddy: 280, Ragi: 355 },
      { month: "Jun", Paddy: 295, Ragi: 365 }
    );
  }

  // Colors for charts
  const colors = ["#4ade80", "#2dd4bf", "#facc15", "#f87171", "#60a5fa"];

  return (
    <PageShell>
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">{t("Market Insights", "ಮಾರುಕಟ್ಟೆ ಒಳನೋಟ")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("Interactive analytics and trends for your storage business.", "ನಿಮ್ಮ ಸಂಗ್ರಹಣಾ ವ್ಯವಹಾರಕ್ಕಾಗಿ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಪ್ರವೃತ್ತಿಗಳು.")}
            </p>
          </div>
          {isPrime && (
            <span className="inline-flex items-center gap-1 rounded-full bg-warning/20 px-3 py-1 text-xs font-bold text-warning-foreground">
              <Crown className="h-3.5 w-3.5" /> Prime
            </span>
          )}
        </div>

        {/* Content wrapper — blurred for Basic, clear for Prime */}
        <div className="relative mt-6">
          {/* Paywall overlay for Basic users */}
          {!isPrime && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl bg-background/60 backdrop-blur-sm">
              <div className="mx-auto max-w-sm rounded-2xl border border-border bg-card p-8 text-center shadow-[var(--shadow-elevated)]">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-warning/15">
                  <Lock className="h-8 w-8 text-warning-foreground" />
                </div>
                <h2 className="mt-4 text-xl font-bold">
                  {t("Premium Feature Locked", "ಪ್ರೀಮಿಯಂ ವೈಶಿಷ್ಟ್ಯ ಲಾಕ್ ಆಗಿದೆ")}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t(
                    "Upgrade to Prime to unlock interactive Market Insights, competitor analytics, and historical trends.",
                    "ಸಂಪೂರ್ಣ ಮಾರುಕಟ್ಟೆ ಒಳನೋಟ, ಪ್ರತಿಸ್ಪರ್ಧಿ ವಿಶ್ಲೇಷಣೆ, ಮತ್ತು ಬೇಡಿಕೆ ಮುನ್ಸೂಚನೆಯನ್ನು ಅನ್‌ಲಾಕ್ ಮಾಡಲು ಪ್ರೈಮ್‌ಗೆ ಅಪ್‌ಗ್ರೇಡ್ ಮಾಡಿ.",
                  )}
                </p>
                <ul className="mt-4 space-y-1.5 text-left text-xs text-muted-foreground">
                  {["Real-time farmer demand data", "Interactive Historical Pricing Charts", "Regional Heatmaps & Trends", "Priority search ranking"].map((f) => (
                    <li key={f} className="flex items-center gap-1.5">
                      <Crown className="h-3 w-3 text-warning-foreground" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  size="lg"
                  className="mt-6 w-full gap-2 bg-warning text-warning-foreground hover:bg-warning/90"
                  onClick={() => setPaymentOpen(true)}
                >
                  <Crown className="h-4 w-4" />
                  {t("Take Prime Subscription — ₹999", "ಪ್ರೈಮ್ ಚಂದಾದಾರಿಕೆ ತೆಗೆದುಕೊಳ್ಳಿ — ₹999")}
                </Button>
              </div>
            </div>
          )}

          {/* Blurred content for Basic, visible for Prime */}
          <div className={cn(!isPrime && "pointer-events-none select-none blur-md")}>
            {/* Demand cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              {demandCards.map((card) => (
                <div key={card.title} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <card.icon className="h-4 w-4 text-primary" />
                      {card.title}
                    </div>
                    <span className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-bold",
                      card.trend.startsWith("+") ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive",
                    )}>
                      {card.trend}
                    </span>
                  </div>
                  <div className="mt-3 text-2xl font-black">{card.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{card.hint}</div>
                </div>
              ))}
            </div>

            {/* Interactive Historical Pricing Chart */}
            <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <TrendingUp className="h-5 w-5 text-primary" />
                {t("Historical Crop Prices (₹/quintal)", "ಐತಿಹಾಸಿಕ ಬೆಳೆ ಬೆಲೆಗಳು")}
              </h2>
              <div className="mt-6 h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      stroke="currentColor" 
                      className="text-xs text-muted-foreground" 
                      tickLine={false} 
                      axisLine={false} 
                      dy={10} 
                    />
                    <YAxis 
                      stroke="currentColor" 
                      className="text-xs text-muted-foreground" 
                      tickLine={false} 
                      axisLine={false} 
                      dx={-10} 
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "8px", fontSize: "12px" }}
                      itemStyle={{ fontWeight: "bold" }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", marginTop: "10px" }} />
                    {topCropTrends.length > 0 ? (
                      topCropTrends.map((trend: any, idx: number) => (
                        <Line 
                          key={trend.crop} 
                          type="monotone" 
                          dataKey={trend.crop} 
                          stroke={colors[idx % colors.length]} 
                          strokeWidth={3} 
                          dot={{ r: 4, strokeWidth: 2 }} 
                          activeDot={{ r: 6 }} 
                        />
                      ))
                    ) : (
                      <>
                        <Line type="monotone" dataKey="Paddy" stroke={colors[0]} strokeWidth={3} />
                        <Line type="monotone" dataKey="Ragi" stroke={colors[1]} strokeWidth={3} />
                      </>
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Regional Demand Heatmap / BarChart */}
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  {t("Regional Farmer Demand", "ಪ್ರಾದೇಶಿಕ ರೈತರ ಬೇಡಿಕೆ")}
                </h2>
                <div className="mt-6 h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={insights?.regional_demand || []} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="area" type="category" axisLine={false} tickLine={false} className="text-xs font-medium" />
                      <Tooltip 
                        cursor={{ fill: "var(--muted)" }} 
                        contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "8px", fontSize: "12px" }}
                      />
                      <Bar dataKey="farmers_seeking" name={t("Farmers", "ರೈತರು")} fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Nearby demand list */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <MapPin className="h-5 w-5 text-primary" />
                  {t("Top Hotspots", "ಉನ್ನತ ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳು")}
                </h2>
                <div className="mt-4 grid gap-3">
                  {(insights?.regional_demand || []).slice(0, 4).map((spot: any) => (
                    <div key={spot.area} className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3 transition-colors hover:bg-muted/50">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold">{spot.area}</div>
                        <div className="text-xs text-muted-foreground">
                          {spot.farmers_seeking} {t("farmers seeking", "ರೈತರು ಹುಡುಕುತ್ತಿದ್ದಾರೆ")} <span className="font-medium text-foreground">{spot.top_crop}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center rounded-full bg-success/15 px-2.5 py-1 text-xs font-bold text-success">
                        High
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Payment Popup for Upgrade */}
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
                  {t("Review your Prime subscription upgrade.", "ನಿಮ್ಮ ಪ್ರೈಮ್ ಚಂದಾದಾರಿಕೆ ಅಪ್‌ಗ್ರೇಡ್ ಪರಿಶೀಲಿಸಿ.")}
                </DialogDescription>
              </DialogHeader>

              <div className="py-6">
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
                  <div className="text-sm font-semibold text-muted-foreground mb-2">
                    {t("Prime Subscription", "ಪ್ರೈಮ್ ಚಂದಾದಾರಿಕೆ")}
                  </div>
                  <div className="text-5xl font-black text-primary">₹999</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {t("per month", "ಪ್ರತಿ ತಿಂಗಳು")}
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  {["Unlimited listings", "Market Insights", "Priority ranking", "24/7 Chat Support"].map((f) => (
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
              <div className="flex items-center justify-between pb-4 border-b border-border/50 mb-6">
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
                    <span className="text-foreground font-bold">₹949.00</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground font-medium">
                    <span>Additional Cost</span>
                    <span className="text-foreground font-bold">₹50.00</span>
                  </div>
                  
                  <div className="border-t border-dashed border-border my-2"></div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-muted-foreground">Total</span>
                    <span className="text-lg font-bold text-foreground">₹999.00</span>
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
