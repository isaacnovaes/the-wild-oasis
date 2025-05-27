import Loading from '@/components/Loading';
import { useUser } from '@/utils/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, Navigate, Outlet, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import HeaderLinks from '../../components/HeaderLinks';
import MobileNavigationContainer from '../../components/MobileNavigation';
import Navigation from '../../components/Navigation';

export const Route = createFileRoute('/_app')({
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { isLoading, isAuthenticated, user } = useUser();

    useEffect(() => {
        const checkAndRedirect = async () => {
            if (!isAuthenticated && !isLoading) {
                await queryClient.invalidateQueries({ queryKey: ['user'] });
                void navigate({ to: '/login', replace: true });
            }
        };
        void checkAndRedirect();
    }, [isAuthenticated, isLoading, navigate, queryClient]);

    if (isLoading) return <Loading />;

    if (isAuthenticated) {
        return (
            <div className='grid size-full grid-cols-1 grid-rows-[5rem_auto] md:grid-cols-[10rem_auto] md:grid-rows-[5rem_auto] lg:grid-cols-[20rem_auto]'>
                <div className='p-4 md:border-b-1 md:border-zinc-200'>
                    <div className='mx-auto flex max-w-[80rem] items-center justify-between'>
                        <div className='flex flex-col items-center justify-between md:flex-row md:gap-4'>
                            <img
                                alt='logo'
                                className='h-10 rounded-full border-2 border-indigo-400'
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                src={user?.user_metadata.avatar ?? '/default-user.jpg'}
                            />
                            <span className='text-gray-700'>{user?.user_metadata.fullName}</span>
                        </div>
                        <HeaderLinks />
                        <MobileNavigationContainer />
                    </div>
                </div>
                <Navigation />
                <div className='overflow-y-auto bg-zinc-50 p-4'>
                    <div className='mx-auto h-full max-w-[80rem]'>
                        <Outlet />
                    </div>
                </div>
            </div>
        );
    }

    return <Navigate replace to='/login' />;
}
