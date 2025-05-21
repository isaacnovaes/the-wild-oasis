import { getBooking, updateBooking } from '@/services/apiBookings';
import type { Booking } from '@/types/global';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import toast from 'react-hot-toast';
import { bookingsQueryOptions, cabinsQueryOptions, settingsQueryOptions } from './queryOptions';

export const useBookings = () => {
    const searchParams = getRouteApi('/_app/bookings').useSearch();

    return useQuery(bookingsQueryOptions(searchParams));
};

export const useBooking = (bookingId: string) =>
    useQuery({
        queryKey: ['booking', bookingId],
        queryFn: async () => {
            return getBooking(bookingId);
        },
    });

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
            breakfastInfo?: Pick<Booking, 'hasBreakfast' | 'extrasPrice' | 'totalPrice'>;
        }) => {
            return updateBooking(bookingId, { status: 'checked-in', ...breakfastInfo });
        },
        onSuccess: (booking) => {
            toast.success(`Booking ${booking.id.toString()} successfully checked in`);
            void queryClient.invalidateQueries({
                queryKey: ['bookings'],
            });
        },
        onError: (error) => {
            toast.error(error.message);
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
        onSuccess: (booking) => {
            toast.success(`Booking ${booking.id.toString()} successfully checked out`);
            void queryClient.invalidateQueries({
                queryKey: ['bookings'],
            });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};

export const useSettings = () => {
    return useQuery(settingsQueryOptions);
};
