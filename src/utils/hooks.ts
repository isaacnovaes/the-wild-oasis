import { getCurrentUser, updateCurrentUser } from '@/services/apiAuth';
import { deleteBooking, getFullBooking, updateBooking } from '@/services/apiBookings';
import type { Booking } from '@/types/bookings';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import toast from 'react-hot-toast';
import { bookingsQueryOptions, cabinsQueryOptions, settingsQueryOptions } from './queryOptions';

export const useBookings = () => {
    const searchParams = getRouteApi('/_app/bookings').useSearch();

    return useQuery(bookingsQueryOptions(searchParams));
};

export const useFullBooking = (bookingId: string) =>
    useQuery({
        queryKey: ['bookings', 'booking', bookingId],
        queryFn: async () => {
            return getFullBooking(bookingId);
        },
    });

export const useDeleteBookingMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['bookings', 'delete'],
        mutationFn: deleteBooking,
        onMutate: ({ id }) => toast.loading(`Deleting booking #${id}`),
        onSuccess: ({ updateCabin }, { id, cabinId: editedCabinId }, toasterId) => {
            toast.success(`Booking ${id} successful deleted`, { id: toasterId });
            void queryClient.invalidateQueries({ queryKey: ['bookings'] });
            if (updateCabin) {
                toast(`Cabin ${editedCabinId} unlinked from bookings`);
                void queryClient.invalidateQueries({ queryKey: ['cabins'] });
            }
        },
        onError: (error, _vars, toasterId) => toast.error(error.message, { id: toasterId }),
    });
};

export const useCabins = () => {
    const searchParams = getRouteApi('/_app/cabins').useSearch();

    return useQuery(cabinsQueryOptions(searchParams));
};

export const useCheckIn = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['checkin'],
        mutationFn: async ({
            bookingId,
            breakfastInfo,
        }: {
            bookingId: string;
            breakfastInfo?: Partial<Pick<Booking, 'hasBreakfast' | 'extrasPrice' | 'totalPrice'>>;
        }) => {
            return updateBooking(bookingId, { status: 'checked-in', ...breakfastInfo });
        },
        onMutate: ({ bookingId }) => toast.loading(`Checking in booking #${bookingId}`),
        onSuccess: (booking, { bookingId }, toasterId) => {
            toast.success(`Booking ${booking.id.toString()} successfully checked in`, {
                id: toasterId,
            });
            void queryClient.invalidateQueries({
                queryKey: ['bookings'],
            });
            void queryClient.invalidateQueries({
                queryKey: ['bookings', 'booking', bookingId],
            });
        },
        onError: (error, _vars, toasterId) => {
            toast.error(error.message, { id: toasterId });
        },
    });
};

export const useCheckOut = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['checkout'],
        mutationFn: async (bookingId: string) => {
            return updateBooking(bookingId, { status: 'checked-out' });
        },
        onMutate: (bookingId) => {
            return toast.loading(`Checking out booking #${bookingId}`);
        },
        onSuccess: (booking, bookingId, toastId) => {
            toast.success(`Booking ${booking.id.toString()} successfully checked out`, {
                id: toastId,
            });
            void queryClient.invalidateQueries({
                queryKey: ['bookings'],
            });
            void queryClient.invalidateQueries({
                queryKey: ['bookings', 'booking', bookingId],
            });
        },
        onError: (error, _vars, toastId) => {
            toast.error(error.message, { id: toastId });
        },
    });
};

export const useSettings = () => {
    return useQuery(settingsQueryOptions);
};

export function useUser() {
    const { isLoading, data: user } = useQuery({
        queryKey: ['user'],
        queryFn: getCurrentUser,
    });

    return { isLoading, user, isAuthenticated: user?.role === 'authenticated' };
}

export const useUpdateUserMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['user'],
        mutationFn: updateCurrentUser,
        onMutate: () => toast.loading('Updating user'),
        onSuccess: async (_data, _vars, toasterId) => {
            await queryClient.invalidateQueries({ queryKey: ['user'] });
            toast.success('User updated', { id: toasterId });
        },
        onError: (e, _vars, toasterId) => {
            toast.error(e.message, { id: toasterId });
        },
    });
};
