import axios from 'axios';
import { mockFacilities, mockBookings } from './mock-data';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api', // Adjust if backend is on a different port/host
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    // Check if running in browser
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 Unauthorized globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        // Clear local storage
        localStorage.removeItem('authToken');
        
        // Redirect to login if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Endpoints (MOCKED)
export const fetchOwnerFacilities = async () => {
  return Promise.resolve(mockFacilities);
};

export const searchFacilities = async (params: Record<string, any>) => {
  return Promise.resolve(mockFacilities);
};

export const createFacility = async (payload: any) => {
  const newFacility = { 
    ...payload, 
    id: `fac-new-${Math.random()}`,
    available_capacity_kg: payload.capacity_kg,
    created_at: new Date().toISOString(),
    temperature: '22°C',
    humidity: '52%',
    images: ['https://loremflickr.com/800/500/green,crops?random=99']
  };
  mockFacilities.unshift(newFacility as any);
  return Promise.resolve(newFacility);
};

export const fetchFarmerBookings = async () => {
  return Promise.resolve(mockBookings);
};

export const fetchOwnerBookings = async () => {
  return Promise.resolve(mockBookings);
};

export const createBooking = async (payload: any) => {
  const fac = mockFacilities.find(f => f.id === payload.facility_id);
  const newBooking = {
    ...payload,
    id: `book-new-${Math.random().toString(36).substring(2, 9)}`,
    status: 'pending',
    created_at: new Date().toISOString(),
    quantity_kg: payload.quantity,
    duration_days: (payload.duration_months || 1) * 30,
    facility: fac ? {
      id: fac.id,
      name: fac.name,
      address: fac.address,
      price_per_kg_per_month: fac.price_per_kg_per_month
    } : { id: 'unknown', name: 'Unknown', address: 'Unknown', price_per_kg_per_month: 0 },
    farmer: { id: 'FA-KOUS99', unique_id: 'FA-KOUS99', name: 'Koushik Jain', phone: '9876543210', address: 'Mandya' }
  };
  mockBookings.unshift(newBooking);
  return Promise.resolve(newBooking);
};

export const extendBooking = async (bookingId: string, additionalDays: number) => {
  const booking = mockBookings.find(b => b.id === bookingId);
  if (booking) {
    booking.duration_days += additionalDays;
  }
  return Promise.resolve({ success: true });
};

export const deleteBooking = async (bookingId: string) => {
  const index = mockBookings.findIndex(b => b.id === bookingId);
  if (index !== -1) {
    mockBookings.splice(index, 1);
  }
  return Promise.resolve({ success: true });
};

export const updateBookingStatus = async (bookingId: string, status: string) => {
  const booking = mockBookings.find(b => b.id === bookingId);
  if (booking) {
    booking.status = status;
  }
  return Promise.resolve({ message: "Status updated" });
};

export const processEscrowPayment = async (bookingId: string) => {
  return Promise.resolve({ status: "success" });
};

export const getAiRecommendations = async (payload: any) => {
  return Promise.resolve({
    recommendations: mockFacilities.slice(0, 2).map((fac) => ({
      facility_id: fac.id,
      match_score: 95,
      reasoning: "Excellent match based on crop type and capacity available."
    }))
  });
};

export const getMarketInsights = async () => {
  return Promise.resolve({
    regional_demand: [
      { area: "Mandya City", farmers_seeking: 120, top_crop: "Paddy" },
      { area: "Mysuru Rural", farmers_seeking: 85, top_crop: "Ragi" },
      { area: "Srirangapatna", farmers_seeking: 60, top_crop: "Paddy" },
      { area: "Nanjangud", farmers_seeking: 45, top_crop: "Maize" }
    ],
    high_demand_crops: ["Paddy", "Ragi", "Maize"],
    average_prices: [15000, 16000, 14000],
    crop_trends: [
      { crop: "Paddy", history: [{ month: "Jan", price: 150 }, { month: "Feb", price: 155 }, { month: "Mar", price: 160 }, { month: "Apr", price: 150 }] },
      { crop: "Ragi", history: [{ month: "Jan", price: 200 }, { month: "Feb", price: 205 }, { month: "Mar", price: 210 }, { month: "Apr", price: 215 }] },
      { crop: "Maize", history: [{ month: "Jan", price: 130 }, { month: "Feb", price: 135 }, { month: "Mar", price: 140 }, { month: "Apr", price: 135 }] }
    ]
  });
};

export const getNotifications = async () => {
  return Promise.resolve([]);
};

export const markNotificationRead = async (id: string) => {
  return Promise.resolve({ success: true });
};

export const upgradeMembership = async (membership: string) => {
  return Promise.resolve({ success: true, membership });
};

export default apiClient;
