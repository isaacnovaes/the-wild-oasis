import { Link } from '@tanstack/react-router';
import { CalendarDays, House, Settings, Store, Users } from 'lucide-react';

const NavLinks = () => {
    return (
        <>
            <Link
                className='group flex items-center gap-5 rounded-md p-2 hover:bg-zinc-200 motion-safe:transition-colors'
                to='/dashboard'
            >
                <House className='stroke-gray-400 group-[.active]:stroke-indigo-500' />
                <span className='group-[.active]:text-indigo-700'>Home</span>
            </Link>
            <Link
                className='group flex items-center gap-5 rounded-md p-2 hover:bg-zinc-200 motion-safe:transition-colors'
                to='/bookings'
            >
                <CalendarDays className='stroke-gray-400 group-[.active]:stroke-indigo-500' />
                <span className='group-[.active]:text-indigo-700'>Bookings</span>
            </Link>
            <Link
                className='group flex items-center gap-5 rounded-md p-2 hover:bg-zinc-200 motion-safe:transition-colors'
                to='/cabins'
            >
                <Store className='stroke-gray-400 group-[.active]:stroke-indigo-500' />
                <span className='group-[.active]:text-indigo-700'>Cabins</span>
            </Link>
            <Link
                className='group flex items-center gap-5 rounded-md p-2 hover:bg-zinc-200 motion-safe:transition-colors'
                to='/users'
            >
                <Users className='stroke-gray-400 group-[.active]:stroke-indigo-500' />
                <span className='group-[.active]:text-indigo-700'>Users</span>
            </Link>
            <Link
                className='group flex items-center gap-5 rounded-md p-2 hover:bg-zinc-200 motion-safe:transition-colors'
                to='/settings'
            >
                <Settings className='stroke-gray-400 group-[.active]:stroke-indigo-500' />
                <span className='group-[.active]:text-indigo-700'>Settings</span>
            </Link>
        </>
    );
};
export default NavLinks;
