import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Copy, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal';
import RowOperations from '../../components/RowOperations';
import { createEditCabin, deleteCabin } from '../../services/apiCabins';
import type { Cabin } from '../../types/global';

const CabinRowOperations = ({ cabin }: { readonly cabin: Cabin }) => {
    const queryClient = useQueryClient();
    const [openModalName, setOpenModalName] = useState<'duplicate' | 'edit' | 'delete' | null>(
        null
    );

    const duplicateCabinMutation = useMutation({
        mutationFn: createEditCabin,
        mutationKey: ['cabins', 'duplicate', cabin.id],
        onSuccess: () => {
            toast.success('Cabin duplicated');
            void queryClient.invalidateQueries({ queryKey: ['cabins'] });
        },
        onError: (error) => {
            toast.error(error.message, { duration: 8000 });
        },
    });

    const deleteCabinMutation = useMutation({
        mutationFn: deleteCabin,
        mutationKey: ['cabins', 'delete', cabin.id],
        onSuccess: () => {
            toast.success('Cabin deleted');
            void queryClient.invalidateQueries({ queryKey: ['cabins'] });
        },
        onError: (error) => {
            toast.error(error.message, { duration: 8000 });
        },
    });

    const disabled = duplicateCabinMutation.isPending || deleteCabinMutation.isPending;

    return (
        <RowOperations>
            <button
                disabled={disabled}
                type='button'
                onClick={() => {
                    duplicateCabinMutation.mutate({
                        description: cabin.description,
                        discount: cabin.discount,
                        image: cabin.image,
                        maxCapacity: cabin.maxCapacity,
                        name: `${cabin.name}-duplicate-${(Math.random() * 10).toPrecision(1)}`,
                        regularPrice: cabin.regularPrice,
                    });
                }}
            >
                <Copy className='size-4 stroke-slate-700' /> Duplicate
            </button>
            <button disabled={disabled} type='button'>
                <Pencil className='size-4 stroke-slate-700' /> Edit
            </button>
            <button
                disabled={disabled}
                type='button'
                onClick={(e) => {
                    e.stopPropagation();
                    setOpenModalName('delete');
                }}
            >
                <Trash2 className='size-4 stroke-slate-700' /> Delete
                {openModalName === 'delete' && (
                    <Modal
                        primaryClassName='border-1 border-red-500 text-white bg-red-500 rounded-sm px-4 hover:cursor-pointer py-2 hover:bg-white
                         hover:text-red-500'
                        primaryFunction={() => {
                            deleteCabinMutation.mutate(cabin.id.toString());
                            setOpenModalName(null);
                        }}
                        primaryTitle='Delete'
                        secondaryClassName='border-1 border-slate-700 rounded-sm px-4 py-2 hover:cursor-pointer hover:bg-slate-700 hover:text-white'
                        secondaryFunction={() => {
                            setOpenModalName(null);
                        }}
                        secondaryTitle='Cancel'
                        title='Delete cabin'
                    >
                        Are you sure you want to delete this cabin? You cannot undo this action!
                    </Modal>
                )}
            </button>
        </RowOperations>
    );
};
export default CabinRowOperations;
