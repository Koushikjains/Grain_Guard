import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchOwnerFacilities, searchFacilities, createFacility } from '@/lib/api';

export interface Facility {
  id: string;
  owner_id: string;
  name: string;
  address: string;
  capacity_kg: number;
  available_capacity_kg: number;
  pricing_structure?: { price_per_kg_per_month?: number };
  storage_type: string;
  accepted_grains: string[];
  best_grain?: string;
  security_details?: string;
  security_features?: string[];
  climate_control?: boolean;
  temperature?: string;
  humidity?: string;
  images?: string[];
  lat?: number;
  lng?: number;
  price_per_kg_per_month?: number;
  google_maps_link?: string;
  promo_links?: string;
  created_at: string;
}

export function useOwnerFacilities() {
  return useQuery<Facility[]>({
    queryKey: ['ownerFacilities'],
    queryFn: fetchOwnerFacilities,
  });
}

export function useSearchFacilities(params: Record<string, any>) {
  return useQuery<Facility[]>({
    queryKey: ['searchFacilities', params],
    queryFn: () => searchFacilities(params),
    // Only refetch if filter params change
    staleTime: 60000, 
  });
}

export function useCreateFacility() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFacility,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ownerFacilities'] });
    },
  });
}
