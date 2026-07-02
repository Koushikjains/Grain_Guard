import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchFarmerBookings, fetchOwnerBookings, deleteBooking, extendBooking } from '@/lib/api';

export interface Booking {
  id: string;
  farmer_id: string;
  facility_id: string;
  crop_types: string[];
  quantity_kg: number;
  duration_days: number;
  total_price: number;
  status: string;
  created_at: string;
  
  // Extended properties joined by backend
  facility?: {
    id: string;
    name: string;
    address: string;
    price_per_kg_per_month: number;
  };
  farmer?: {
    id: string;
    unique_id: string;
    name: string;
    phone: string;
    address: string;
  };
}

export function useFarmerBookings() {
  return useQuery<Booking[]>({
    queryKey: ['farmerBookings'],
    queryFn: fetchFarmerBookings,
  });
}

export function useOwnerBookings() {
  return useQuery<Booking[]>({
    queryKey: ['ownerBookings'],
    queryFn: fetchOwnerBookings,
  });
}

export function useDeleteBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmerBookings'] });
    },
  });
}

export function useExtendBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, days }: { id: string; days: number }) => extendBooking(id, days),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmerBookings'] });
    },
  });
}
