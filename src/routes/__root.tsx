import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Toaster } from 'react-hot-toast';

interface RouterContext {
    queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
    component: () => (
        <div className='h-dvh w-full text-slate-700 **:focus-visible:outline-indigo-500 **:motion-safe:transition-colors **:motion-safe:ease-in'>
            <Outlet />
            <TanStackRouterDevtools />
            <Toaster toastOptions={{ duration: 5000 }} />
        </div>
    ),
});
