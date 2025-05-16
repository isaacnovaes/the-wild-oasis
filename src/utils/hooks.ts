import { useQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { bookingsQueryOptions, cabinsQueryOptions } from './queryOptions';

export const useBookings = () => {
    const searchParams = getRouteApi('/_app/bookings').useSearch();

    return useQuery(bookingsQueryOptions(searchParams));
};

export const useCabins = () => {
    const searchParams = getRouteApi('/_app/cabins').useSearch();

    return useQuery(cabinsQueryOptions(searchParams));
};
