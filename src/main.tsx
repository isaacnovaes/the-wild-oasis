import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { routeTree } from './routeTree.gen';

const root = document.getElementById('root');

if (!root) {
    throw new ReferenceError('There is no root element');
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 20, // 5 minutes
            gcTime: Infinity,
            retry: false,
        },
        mutations: {
            retry: false,
        },
    },
});

const router = createRouter({
    routeTree,
    context: { queryClient },
});

type QueryKeys =
    | 'account'
    | 'booking'
    | 'bookings'
    | 'dashboard'
    | 'cabins'
    | 'checkin'
    | 'settings'
    | 'users';

type QueryKey = [QueryKeys, ...ReadonlyArray<unknown>];

declare module '@tanstack/react-query' {
    interface Register {
        queryKey: QueryKey;
        mutationKey: QueryKey;
    }
}

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

createRoot(root).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider context={{ queryClient }} router={router} />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </StrictMode>
);
