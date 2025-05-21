import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Copy, EllipsisVertical, Loader, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { createEditCabin, deleteCabin } from '../../services/apiCabins';
import type { Cabin } from '../../types/global';
import CabinForm from './CabinForm';

const CabinRowOperations = ({ cabin }: { readonly cabin: Cabin }) => {
    const queryClient = useQueryClient();
    const [openCreateCabin, setOpenCreateCabin] = useState(false);

    const duplicateCabinMutation = useMutation({
        mutationFn: createEditCabin,
        mutationKey: ['cabins', 'duplicate', cabin.id],
        onSuccess: () => {
            toast.success('Cabin duplicated');
            void queryClient.invalidateQueries({ queryKey: ['cabins'] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const deleteCabinMutation = useMutation({
        mutationFn: deleteCabin,
        mutationKey: ['cabins', 'delete', cabin.id],
        onSuccess: (_data, variables) => {
            toast.success(`Cabin ${variables.toString()} deleted`);
            void queryClient.invalidateQueries({ queryKey: ['cabins'] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const pending = duplicateCabinMutation.isPending || deleteCabinMutation.isPending;

    return (
        <Dialog open={openCreateCabin} onOpenChange={setOpenCreateCabin}>
            <DropdownMenu>
                <DropdownMenuTrigger disabled={pending}>
                    {pending ? (
                        <Loader className='size-4 animate-spin stroke-indigo-500 hover:cursor-pointer' />
                    ) : (
                        <EllipsisVertical className='size-4 stroke-gray-600 hover:cursor-pointer' />
                    )}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Cabin row operations</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => {
                            duplicateCabinMutation.mutate({
                                newCabin: {
                                    description: cabin.description,
                                    discount: cabin.discount,
                                    image: cabin.image,
                                    maxCapacity: cabin.maxCapacity,
                                    name: `${cabin.name}-duplicate-${Math.floor(Math.random() * 100).toPrecision(1)}`,
                                    regularPrice: cabin.regularPrice,
                                },
                            });
                        }}
                    >
                        <Copy className='size-4 stroke-slate-700' /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <DialogTrigger
                            className='w-full'
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <Pencil className='size-4 stroke-slate-700' /> Edit
                        </DialogTrigger>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled={cabin.linkedToBooking}>
                        <AlertDialog>
                            <AlertDialogTrigger
                                className={`flex items-center justify-center gap-x-2 delete-operation-cabin-${cabin.id.toString()}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                            >
                                <Trash2 className='size-4 stroke-slate-700' /> Delete
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className='text-slate-700'>
                                        Are you sure you want to delete this cabin?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete
                                        this cabin.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        variant={'destructive'}
                                        onClick={() => {
                                            deleteCabinMutation.mutate(cabin.id);
                                        }}
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>Edit cabin</DialogTitle>
                </DialogHeader>
                <CabinForm
                    cabin={cabin}
                    mode='edit'
                    onSuccess={() => {
                        setOpenCreateCabin(false);
                    }}
                />
            </DialogContent>
        </Dialog>
    );
};
export default CabinRowOperations;
