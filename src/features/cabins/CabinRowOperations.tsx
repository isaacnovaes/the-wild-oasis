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
    DialogDescription,
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Copy, EllipsisVertical, Loader, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { createEditCabin, deleteCabin } from '../../services/apiCabins';
import type { Cabin } from '../../types/cabins';
import CabinForm from './CabinForm';

const CabinRowOperations = ({ cabin }: { readonly cabin: Cabin }) => {
    const queryClient = useQueryClient();
    const [openCreateCabin, setOpenCreateCabin] = useState(false);

    const duplicateCabinMutation = useMutation({
        mutationFn: createEditCabin,
        mutationKey: ['cabins', 'duplicate'],
        onMutate: () => toast.loading('Duplicating cabin'),
        onSuccess: (_data, _vars, toasterId) => {
            toast.success('Cabin duplicated', { id: toasterId });
            void queryClient.invalidateQueries({ queryKey: ['cabins'] });
        },
        onError: (error, _vars, toasterId) => {
            toast.error(error.message, { id: toasterId });
        },
    });

    const deleteCabinMutation = useMutation({
        mutationFn: deleteCabin,
        mutationKey: ['cabins', 'delete'],
        onMutate: () => toast.loading('Deleting cabin'),
        onSuccess: (_data, variables, toasterId) => {
            toast.success(`Cabin ${variables.toString()} deleted`, { id: toasterId });
            void queryClient.invalidateQueries({ queryKey: ['cabins'] });
        },
        onError: (error, _vars, toasterId) => {
            toast.error(error.message, { id: toasterId });
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

            <DialogContent>
                <ScrollArea
                    className='h-[calc(100dvh-10rem)] max-h-[515px] overflow-hidden'
                    type='auto'
                >
                    <DialogHeader className='mb-3'>
                        <DialogTitle>Edit cabin #{cabin.id}</DialogTitle>
                        <DialogDescription>
                            Edit cabin form. Click save when you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>
                    <CabinForm
                        cabin={cabin}
                        mode='edit'
                        onSuccess={() => {
                            setOpenCreateCabin(false);
                        }}
                    />
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};
export default CabinRowOperations;
