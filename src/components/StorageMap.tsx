import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { Link } from "@tanstack/react-router";
import { Phone, Star } from "lucide-react";
import { useApp } from "@/lib/app-context";
import type { Storage } from "@/routes/farmer.storage.index";

interface Props {
  storages: Storage[];
  searchQty?: string;
  searchDur?: string;
  searchUnit?: string;
}

export function StorageMap({ storages, searchQty, searchDur, searchUnit }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  const { t } = useApp();

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let cancelled = false;

    // Dynamic import keeps Leaflet out of the SSR bundle (it touches `window` at module load).
    import("leaflet").then((mod) => {
      const L = mod.default ?? mod;
      if (cancelled || !containerRef.current) return;

      const defaultIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      const center: [number, number] = storages.length
        ? [storages[0].lat, storages[0].lng]
        : [12.9716, 77.5946];

      const map = L.map(containerRef.current).setView(center, 7);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 18,
      }).addTo(map);

      storages.forEach((s) => {
        const marker = L.marker([s.lat, s.lng], { icon: defaultIcon }).addTo(map);
        const link = `/farmer/storage/${s.id}?quantity=${searchQty ?? ""}&duration=${searchDur ?? ""}&unit=${searchUnit ?? ""}`;
        marker.bindPopup(`
          <div style="min-width:200px;font-family:inherit">
            <div style="font-weight:700;font-size:14px;margin-bottom:4px">${s.name}</div>
            <div style="font-size:12px;color:#666">${t("Owner", "ಮಾಲೀಕ")}: ${s.ownerName}</div>
            <div style="font-size:12px;margin-top:4px">⭐ ${s.rating} · ${s.distanceKm} km</div>
            <div style="display:flex;gap:6px;margin-top:8px">
              <a href="tel:+910000000000" style="flex:1;text-align:center;background:#9CAF88;color:white;padding:6px 8px;border-radius:6px;font-size:12px;font-weight:600;text-decoration:none">📞 ${t("Call Now", "ಕರೆ ಮಾಡಿ")}</a>
              <a href="${link}" style="flex:1;text-align:center;background:white;border:1px solid #ddd;color:#333;padding:6px 8px;border-radius:6px;font-size:12px;font-weight:600;text-decoration:none">${t("View", "ನೋಡಿ")}</a>
            </div>
          </div>
        `);
      });

      if (storages.length > 1) {
        const bounds = L.latLngBounds(storages.map((s) => [s.lat, s.lng] as [number, number]));
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    });

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storages]);

  if (storages.length === 0) {
    return (
      <div className="flex h-[480px] items-center justify-center rounded-xl border border-dashed border-border bg-card text-sm text-muted-foreground">
        {t("No storages to plot on map.", "ನಕ್ಷೆಯಲ್ಲಿ ತೋರಿಸಲು ಯಾವುದೇ ಸಂಗ್ರಹಣೆ ಇಲ್ಲ.")}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-soft)]">
      <div ref={containerRef} className="h-[480px] w-full" />
      <div className="border-t border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
        {t(
          "Tap any pin to see details and call the owner.",
          "ವಿವರಗಳಿಗಾಗಿ ಮತ್ತು ಮಾಲೀಕರನ್ನು ಕರೆಯಲು ಯಾವುದೇ ಪಿನ್ ಒತ್ತಿರಿ.",
        )}
        <span className="ml-2 inline-flex items-center gap-1 text-foreground">
          <Star className="h-3 w-3" /> · <Phone className="h-3 w-3" /> ·{" "}
          <Link to="/help" className="underline">
            {t("Need help?", "ಸಹಾಯ ಬೇಕೇ?")}
          </Link>
        </span>
      </div>
    </div>
  );
}
