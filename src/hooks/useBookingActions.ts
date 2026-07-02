import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBooking, updateBookingStatus, processEscrowPayment } from '@/lib/api';

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmerBookings'] });
    },
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, status }: { bookingId: string; status: string }) =>
      updateBookingStatus(bookingId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ownerBookings'] });
      queryClient.invalidateQueries({ queryKey: ['ownerFacilities'] });
    },
  });
}

export function useProcessEscrowPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: processEscrowPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmerBookings'] });
    },
  });
}
