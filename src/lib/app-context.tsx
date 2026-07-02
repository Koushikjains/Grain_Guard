import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import apiClient from "./api";
import { mockUsers } from "./mock-data";

type Theme = "light" | "dark";
type Language = "en" | "kn";
type Role = "farmer" | "owner" | null;

export interface Booking {
  id: string;
  storageName: string;
  location: string;
  crop: string;
  quantity: string;
  duration: number;
  daysRemaining: number;
}

export interface OwnerStorage {
  id: string;
  name: string;
  type: string;
  capacity: number;
  pricePerUnit: number;
  crops: string[];
  location: string;
  address: string;
}

interface User {
  name: string;
  phone: string;
  email: string;
  photo: string | null;
  uniqueId: string;
  membership?: "Basic" | "Prime";
}

interface AppState {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (l: Language) => void;
  t: (en: string, kn: string) => string;
  isAuthed: boolean;
  sendOtpApi: (phone: string) => Promise<void>;
  verifyAndLoginApi: (data: { phone: string; otp: string; role: Exclude<Role, null>; name?: string; address?: string; docId?: string; membership?: "Basic" | "Prime" }) => Promise<void>;
  logout: () => void;
  role: Role;
  preAuthRole: Role;
  setPreAuthRole: (r: Role) => void;
  selectedPlan: "Basic" | "Prime";
  setSelectedPlan: (p: "Basic" | "Prime") => void;
  user: User | null;
  updateUser: (patch: Partial<User>) => void;
  /** @deprecated use activeBookings array */
  activeBooking: Booking | null;
  /** @deprecated use addBooking / removeBooking */
  setActiveBooking: (b: Booking | null) => void;
  activeBookings: Booking[];
  addBooking: (b: Omit<Booking, "id">) => void;
  updateBooking: (id: string, patch: Partial<Booking>) => void;
  removeBooking: (id: string) => void;
  td: (str: string | number) => string;
  isKycVerified: boolean;
  setKycVerified: (v: boolean) => void;
  ownerStorages: OwnerStorage[];
  addOwnerStorage: (s: Omit<OwnerStorage, "id">) => void;
}

const AppContext = createContext<AppState | null>(null);

function generateUniqueId(prefix: string) {
  // Auto-generate alphanumeric IDs: FA-XXXX for Farmers and OW-XXXX for Owners.
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${rand}`;
}

function generateBookingId() {
  return `BK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export function toKannadaString(str: string): string {
  const numMap: Record<string, string> = {
    "0": "೦", "1": "೧", "2": "೨", "3": "೩", "4": "೪",
    "5": "೫", "6": "೬", "7": "೭", "8": "೮", "9": "೯"
  };
  const locationMap: Record<string, string> = {
    Mysuru: "ಮೈಸೂರು",
    Hassan: "ಹಾಸನ",
    Mandya: "ಮಂಡ್ಯ",
    Tumakuru: "ತುಮಕೂರು",
    Belagavi: "ಬೆಳಗಾವಿ",
    Davangere: "ದಾವಣಗೆರೆ",
    Raichur: "ರಾಯಚೂರು",
  };

  let result = str.replace(/[0-9]/g, (match) => numMap[match]);
  for (const [en, kn] of Object.entries(locationMap)) {
    const regex = new RegExp(`\\b${en}\\b`, "gi");
    result = result.replace(regex, kn);
  }
  return result;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [language, setLanguage] = useState<Language>("en");
  const [isAuthed, setIsAuthed] = useState(false);
  const [role, setRole] = useState<Role>(null);
  const [preAuthRole, setPreAuthRole] = useState<Role>(null);
  const [selectedPlan, setSelectedPlan] = useState<"Basic" | "Prime">("Basic");
  const [user, setUser] = useState<User | null>(null);
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [isKycVerified, setKycVerified] = useState(false);
  const [ownerStorages, setOwnerStorages] = useState<OwnerStorage[]>([]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Session persistence (MOCKED)
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    
    if (token && token.startsWith("mock-token-")) {
      const mockUser = mockUsers.find(u => token.includes(u.phone));
      if (mockUser) {
        setIsAuthed(true);
        setRole(mockUser.role as Role);
        setUser({
          name: mockUser.name,
          phone: mockUser.phone,
          email: "",
          photo: null,
          uniqueId: mockUser.id,
          membership: "Basic",
        });
        return;
      }
    }
    
    // Fallback if not mock token
    if (token) {
      apiClient.get("/users/me")
        .then((res) => {
          setIsAuthed(true);
          setRole(res.data.role);
          setUser({
            name: res.data.name || "",
            phone: res.data.phone || "",
            email: "",
            photo: null,
            uniqueId: res.data.unique_id || "",
            membership: res.data.membership_plan === "prime" ? "Prime" : "Basic",
          });
        })
        .catch(() => {
          localStorage.removeItem("authToken");
          setIsAuthed(false);
          setRole(null);
          setUser(null);
        });
    }
  }, []);

  const value = useMemo<AppState>(
    () => ({
      theme,
      toggleTheme: () => setTheme((t) => (t === "light" ? "dark" : "light")),
      language,
      setLanguage,
      t: (en, kn) => (language === "en" ? en : toKannadaString(kn)),
      td: (str) => {
        const s = String(str);
        return language === "en" ? s : toKannadaString(s);
      },
      isAuthed,
      sendOtpApi: async (phone) => {
        await apiClient.post("/auth/send-otp", { phone });
      },
      verifyAndLoginApi: async ({ phone, otp, role: r, name, address, docId, membership }) => {
        // MOCK LOGIN CHECK
        const mockUser = mockUsers.find(u => u.phone === phone);
        if (mockUser) {
          const token = `mock-token-${phone}`;
          localStorage.setItem("authToken", token);
          apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          setIsAuthed(true);
          setRole(mockUser.role as Role);
          setUser({
            name: mockUser.name,
            phone: mockUser.phone,
            email: "",
            photo: null,
            uniqueId: mockUser.id,
            membership: membership === "Prime" ? "Prime" : "Basic",
          });
          return;
        }

        // 1. Verify OTP
        const verifyRes = await apiClient.post("/auth/verify-otp", { phone, otp, role: r });
        let token = verifyRes.data.access_token;
        
        // 2. If not registered, register
        if (!verifyRes.data.is_registered) {
          const regRes = await apiClient.post("/auth/register", {
            phone,
            name: name || "",
            role: r,
            address: address || "Not Provided",
            kisan_card_or_aadhaar: docId || "Not Provided"
          });
          token = regRes.data.access_token;
        }

        // Save Token
        localStorage.setItem("authToken", token);
        // Force the apiClient to use the token immediately for the next requests
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // 3. Upgrade membership if requested
        if (membership === "Prime") {
          await apiClient.put("/users/membership", { membership: "prime" });
        }

        // 4. Fetch user profile
        const userRes = await apiClient.get("/users/me");
        
        setIsAuthed(true);
        setRole(userRes.data.role);
        setUser({
          name: userRes.data.name || "",
          phone: userRes.data.phone || "",
          email: "",
          photo: null,
          uniqueId: userRes.data.unique_id || "",
          membership: userRes.data.membership_plan === "prime" ? "Prime" : "Basic",
        });
      },
      logout: () => {
        localStorage.removeItem("authToken");
        setIsAuthed(false);
        setRole(null);
        setUser(null);
        setActiveBookings([]);
        setOwnerStorages([]);
        setKycVerified(false);
      },
      role,
      preAuthRole,
      setPreAuthRole,
      selectedPlan,
      setSelectedPlan,
      user,
      updateUser: (patch) => setUser((u) => (u ? { ...u, ...patch } : u)),
      // Backward compat: activeBooking returns first booking or null
      activeBooking: activeBookings.length > 0 ? activeBookings[0] : null,
      setActiveBooking: (b) => {
        if (b) {
          setActiveBookings([{ ...b, id: b.id || generateBookingId() }]);
        } else {
          setActiveBookings([]);
        }
      },
      activeBookings,
      addBooking: (b) => {
        setActiveBookings((prev) => [...prev, { ...b, id: generateBookingId() }]);
      },
      updateBooking: (id, patch) => {
        setActiveBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
      },
      removeBooking: (id) => {
        setActiveBookings((prev) => prev.filter((b) => b.id !== id));
      },
      isKycVerified,
      setKycVerified,
      ownerStorages,
      addOwnerStorage: (s) => {
        setOwnerStorages((prev) => [...prev, { ...s, id: `ST-${Math.random().toString(36).slice(2, 8).toUpperCase()}` }]);
      },
    }),
    [theme, language, isAuthed, role, preAuthRole, selectedPlan, user, activeBookings, isKycVerified, ownerStorages],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
