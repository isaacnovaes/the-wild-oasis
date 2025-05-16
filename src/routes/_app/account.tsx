import { createFileRoute, ErrorComponent } from '@tanstack/react-router';
import Loading from '../../components/Loading';
import Account from '../../features/account/Account';
import { accountQueryOptions } from '../../utils/queryOptions';

export const Route = createFileRoute('/_app/account')({
    component: Account,
    loader: async ({ context: { queryClient } }) => {
        await queryClient.prefetchQuery(accountQueryOptions);
    },
    errorComponent: ErrorComponent,
    pendingComponent: Loading,
});
