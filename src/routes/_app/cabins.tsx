import { createFileRoute, ErrorComponent } from '@tanstack/react-router';
import Cabins from '../../features/cabins/Cabins';
import { SearchParamsSchema } from '../../types/global';
import { PAGE_SIZE } from '../../utils/constants';
import { cabinsQueryOptions } from '../../utils/queryOptions';

export const Route = createFileRoute('/_app/cabins')({
    component: Cabins,
    validateSearch: SearchParamsSchema,
    loaderDeps: ({ search }) => search,
    loader: async ({ context: { queryClient }, deps: searchParams }) => {
        const cachedData = queryClient.getQueryData(
            cabinsQueryOptions({ ...searchParams, page: searchParams.page - 1 }).queryKey
        );

        if (cachedData && cachedData.count) {
            const hasNext = PAGE_SIZE * searchParams.page < cachedData.count;
            const hasPrevious = searchParams.page > 1;
            let nextFetch: Promise<void> | null = null;
            let previousFetch: Promise<void> | null = null;

            if (hasNext) {
                nextFetch = queryClient.prefetchQuery(
                    cabinsQueryOptions({
                        ...searchParams,
                        page: searchParams.page + 1,
                    })
                );
            }
            if (hasPrevious) {
                previousFetch = queryClient.prefetchQuery(
                    cabinsQueryOptions({
                        ...searchParams,
                        page: searchParams.page - 1,
                    })
                );
            }
            return Promise.all([
                nextFetch,
                previousFetch,
                queryClient.prefetchQuery(cabinsQueryOptions(searchParams)),
            ]);
        }

        return queryClient.prefetchQuery(cabinsQueryOptions({ page: 1 }));
    },
    errorComponent: ErrorComponent,
});
