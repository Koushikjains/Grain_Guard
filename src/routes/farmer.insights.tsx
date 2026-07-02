import { createFileRoute, Link } from "@tanstack/react-router";
import {
  TrendingUp,
  Users,
  BarChart3,
  Wheat,
  MapPin,
  ArrowLeft,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-context";
import { cn } from "@/lib/utils";
import { useMarketInsights } from "@/hooks/useInsightsAndAlerts";
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

export const Route = createFileRoute("/farmer/insights")({
  head: () => ({ meta: [{ title: "Market Insights — GrainGuard" }] }),
  component: FarmerMarketInsights,
});

function FarmerMarketInsights() {
  const { t } = useApp();
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

  const topCropTrends = insights?.crop_trends?.slice(0, 3) || [];
  
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
    chartData.push(
      { month: "Jan", Paddy: 280, Ragi: 350 },
      { month: "Feb", Paddy: 285, Ragi: 360 },
      { month: "Mar", Paddy: 290, Ragi: 345 },
      { month: "Apr", Paddy: 275, Ragi: 340 },
      { month: "May", Paddy: 280, Ragi: 355 },
      { month: "Jun", Paddy: 295, Ragi: 365 }
    );
  }

  const colors = ["#4ade80", "#2dd4bf", "#facc15", "#f87171", "#60a5fa"];

  return (
    <PageShell>
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <Button asChild variant="ghost" className="mb-4 text-muted-foreground">
          <Link to="/farmer/active">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> {t("Back to Dashboard", "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂದೆ")}
          </Link>
        </Button>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">{t("Market Insights", "ಮಾರುಕಟ್ಟೆ ಒಳನೋಟ")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("Interactive analytics and trends for your storage business.", "ನಿಮ್ಮ ಸಂಗ್ರಹಣಾ ವ್ಯವಹಾರಕ್ಕಾಗಿ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಪ್ರವೃತ್ತಿಗಳು.")}
            </p>
          </div>
        </div>

        <div className="relative mt-6">
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
      </section>
    </PageShell>
  );
}
