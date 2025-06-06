import { createFileRoute, ErrorComponent } from '@tanstack/react-router';
import { z } from 'zod';
import Loading from '../../components/Loading';
import Dashboard from '../../features/dashboard/Dashboard';
import {
    bookingsQueryOptions,
    cabinsQueryOptions,
    settingsQueryOptions,
} from '../../utils/queryOptions';

export const Route = createFileRoute('/_app/dashboard')({
    component: Dashboard,
    validateSearch: z.object({ last: z.union([z.literal(7), z.literal(30), z.literal(90)]) }),
    loader: async ({ context: { queryClient } }) => {
        await Promise.all([
            queryClient.prefetchQuery(bookingsQueryOptions({ page: 1 })),
            queryClient.prefetchQuery(cabinsQueryOptions({ page: 1 })),
            queryClient.prefetchQuery(settingsQueryOptions),
        ]);
    },
    errorComponent: ErrorComponent,
    pendingComponent: Loading,
});
