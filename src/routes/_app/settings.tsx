import { createFileRoute, ErrorComponent } from '@tanstack/react-router';
import Loading from '../../components/Loading';
import Settings from '../../features/settings/Settings';
import { settingsQueryOptions } from '../../utils/queryOptions';

export const Route = createFileRoute('/_app/settings')({
    component: Settings,
    loader: async ({ context: { queryClient } }) => {
        await queryClient.prefetchQuery(settingsQueryOptions);
    },
    errorComponent: ErrorComponent,
    pendingComponent: Loading,
});
