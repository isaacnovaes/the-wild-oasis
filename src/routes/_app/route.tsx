import { createFileRoute, Outlet } from '@tanstack/react-router';
import HeaderLinks from '../../components/HeaderLinks';
import MobileNavigationContainer from '../../components/MobileNavigation';
import Navigation from '../../components/Navigation';

export const Route = createFileRoute('/_app')({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className='grid size-full grid-cols-1 grid-rows-[5rem_auto] md:grid-cols-[10rem_auto] md:grid-rows-[5rem_auto] lg:grid-cols-[20rem_auto]'>
            <div className='p-4 md:border-b-1 md:border-zinc-200'>
                <div className='mx-auto flex max-w-[80rem] items-center justify-between'>
                    <div className='flex flex-col items-center justify-between md:flex-row md:gap-4'>
                        <img
                            alt='logo'
                            className='h-10 rounded-full border-2 border-indigo-400'
                            src='/default-user.jpg'
                        />
                        <span className='text-gray-700'>User name</span>
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
