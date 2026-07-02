import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMarketInsights, getAiRecommendations, getNotifications, markNotificationRead } from '@/lib/api';

export function useMarketInsights() {
  return useQuery({
    queryKey: ['marketInsights'],
    queryFn: getMarketInsights,
  });
}

export function useAiRecommendations() {
  return useMutation({
    mutationFn: getAiRecommendations,
  });
}

export function useNotifications(enabled: boolean = true) {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
    enabled,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
