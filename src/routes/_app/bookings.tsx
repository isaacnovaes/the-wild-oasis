import { createFileRoute, ErrorComponent } from '@tanstack/react-router';
import toast from 'react-hot-toast';
import Bookings from '../../features/bookings/Bookings';
import { SearchParamsSchema } from '../../types/global';
import { PAGE_SIZE } from '../../utils/constants';
import { bookingsQueryOptions } from '../../utils/queryOptions';

export const Route = createFileRoute('/_app/bookings')({
    component: Bookings,
    errorComponent: ErrorComponent,
    validateSearch: SearchParamsSchema,
    loaderDeps: ({ search }) => search,
    loader: async ({ context: { queryClient }, deps: searchParams }) => {
        const cachedData = queryClient.getQueryData(
            bookingsQueryOptions({
                ...searchParams,
                page: searchParams.page - 1,
            }).queryKey
        );
        toast('Run boi');
        if (cachedData && cachedData.count) {
            const hasNext = PAGE_SIZE * searchParams.page < cachedData.count;
            const hasPrevious = searchParams.page > 1;
            let nextFetch: Promise<void> | null = null;
            let previousFetch: Promise<void> | null = null;

            if (hasNext) {
                nextFetch = queryClient.prefetchQuery(
                    bookingsQueryOptions({
                        ...searchParams,
                        page: searchParams.page + 1,
                    })
                );
            }
            if (hasPrevious) {
                previousFetch = queryClient.prefetchQuery(
                    bookingsQueryOptions({
                        ...searchParams,
                        page: searchParams.page - 1,
                    })
                );
            }
            return Promise.all([
                nextFetch,
                previousFetch,
                queryClient.prefetchQuery(bookingsQueryOptions(searchParams)),
            ]);
        }
        return queryClient.prefetchQuery(bookingsQueryOptions({ page: 1 }));
    },
});
