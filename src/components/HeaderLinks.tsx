import { logout } from '@/services/apiAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { LogOut, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';
import { Button } from './ui/button';

const HeaderLinks = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const logoutMutation = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            queryClient.removeQueries();
            void navigate({ to: '/login', replace: true });
        },
        onError: (e) => {
            toast.error(e.message);
        },
    });

    return (
        <div className='flex items-center justify-between gap-6'>
            <Link className='account' to='/account'>
                <User className='size-4 stroke-indigo-600 md:size-5' />
            </Link>
            <Tooltip anchorSelect='.account' className='hidden md:block' place='top'>
                Account
            </Tooltip>

            <Button
                disabled={logoutMutation.isPending}
                variant={'ghost'}
                onClick={() => {
                    logoutMutation.mutate();
                }}
            >
                <LogOut className='size-4 stroke-indigo-600 md:size-5' />
            </Button>

            <Tooltip anchorSelect='.logout' className='hidden md:block' place='top'>
                Logout
            </Tooltip>
        </div>
    );
};
export default HeaderLinks;
