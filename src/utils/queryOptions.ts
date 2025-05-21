import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { getCurrentUser } from '../services/apiAuth';
import { getBookings } from '../services/apiBookings';
import { getCabins } from '../services/apiCabins';
import { getSettings } from '../services/apiSettings';
import type { SearchParams } from '../types/global';

export const cabinsQueryOptions = (query: SearchParams) =>
    queryOptions({
        queryKey: ['cabins', query],
        queryFn: async () => {
            return getCabins(query);
        },
        placeholderData: keepPreviousData,
    });

export const bookingsQueryOptions = (query: SearchParams) =>
    queryOptions({
        queryKey: ['bookings', query],
        queryFn: async () => {
            return getBookings(query);
        },
        placeholderData: keepPreviousData,
    });

export const accountQueryOptions = queryOptions({
    queryKey: ['account'],
    queryFn: async () => {
        return getCurrentUser();
    },
});

export const settingsQueryOptions = queryOptions({
    queryKey: ['settings'],
    queryFn: async () => {
        return getSettings();
    },
    staleTime: 0,
});
