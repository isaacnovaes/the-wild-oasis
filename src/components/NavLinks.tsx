import { Link, linkOptions } from '@tanstack/react-router';
import { CalendarDays, House, Settings, Users } from 'lucide-react';

const navOptions = linkOptions([
    { to: '/dashboard', label: 'Home', icon: House, search: { last: 7 } },
    {
        to: '/bookings',
        search: { page: 1 },
        label: 'Bookings',
        icon: CalendarDays,
    },
    {
        to: '/cabins',
        search: { page: 1 },
        label: 'Cabins',
        icon: CalendarDays,
    },
    { to: '/users', label: 'Users', icon: Users, search: {} },
    { to: '/settings', label: 'Settings', icon: Settings, search: {} },
]);

const linkClassName =
    'group flex items-center gap-5 rounded-md p-2 [.active]:bg-zinc-100 hover:bg-zinc-200 motion-safe:transition-colors ';
const iconClassName = 'stroke-gray-400 group-[.active]:stroke-indigo-500';
const spanClassName = 'group-[.active]:text-indigo-700';

const NavLinks = () => {
    return navOptions.map((option) => (
        <Link
            key={option.to}
            activeOptions={{ includeSearch: false }}
            className={linkClassName}
            search={option.search}
            to={option.to}
        >
            <option.icon className={iconClassName} />
            <span className={spanClassName}>{option.label}</span>
        </Link>
    ));
};
export default NavLinks;
