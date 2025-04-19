import { Link } from '@tanstack/react-router';
import { LogOut, Moon, User } from 'lucide-react';
import { Tooltip } from 'react-tooltip';

const HeaderLinks = () => {
    return (
        <div className='flex items-center justify-between gap-6'>
            <Link className='account' to='/account'>
                <User className='size-4 stroke-indigo-600 md:size-5' />
            </Link>
            <Tooltip anchorSelect='.account' className='hidden md:block' place='top'>
                Account
            </Tooltip>
            <Link className='dark-mode' to='/account'>
                <Moon className='size-4 stroke-indigo-600 md:size-5' />
            </Link>
            <Tooltip anchorSelect='.dark-mode' className='hidden md:block' place='top'>
                Dark mode toggle
            </Tooltip>
            <Link className='logout' to='/login'>
                <LogOut className='size-4 stroke-indigo-600 md:size-5' />
            </Link>
            <Tooltip anchorSelect='.logout' className='hidden md:block' place='top'>
                Logout
            </Tooltip>
        </div>
    );
};
export default HeaderLinks;
