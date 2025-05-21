import { Button } from '@/components/ui/button';
import { createEditCabin } from '@/services/apiCabins';
import { CabinFormSchema, type Cabin, type CabinForm as CabinFormT } from '@/types/global';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogClose } from '@radix-ui/react-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import FormItem from '../../components/FormItem';

type Props =
    | { mode: 'create'; readonly onSuccess: () => void }
    | { mode: 'edit'; readonly onSuccess: () => void; readonly cabin: Cabin };

const CabinForm = (props: Props) => {
    const {
        formState: { isDirty, isValid, errors },
        handleSubmit,
        register,
    } = useForm<CabinFormT>({
        resolver: zodResolver(CabinFormSchema),
        defaultValues:
            props.mode === 'edit'
                ? props.cabin
                : {
                      name: '',
                      maxCapacity: 0,
                      regularPrice: 0,
                      discount: 0,
                      image: '',
                      description: '',
                  },
    });

    const queryClient = useQueryClient();

    const createEditCabinMutation = useMutation({
        mutationFn: createEditCabin,
        mutationKey: ['cabins', 'create-edit'],
        onSuccess: (cabin) => {
            void queryClient.invalidateQueries({ queryKey: ['cabins'] });
            toast.success(
                props.mode === 'create'
                    ? `Cabin ${cabin.id.toString()} created`
                    : `Cabin ${cabin.id.toString()} edited`
            );
            props.onSuccess();
        },
        onError: (e) => {
            toast.error(e.message);
        },
    });

    const onSubmit: SubmitHandler<CabinFormT> = (cabinForm) => {
        if (isDirty && isValid) {
            createEditCabinMutation.mutate({
                newCabin: cabinForm,
                id: props.mode === 'edit' ? props.cabin.id : undefined,
            });
            return;
        }

        toast.error('Form is invalid');
        console.error(cabinForm);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormItem
                error={errors.name?.message}
                id='name'
                isFormDirty={isDirty}
                label='Cabin name'
                name='name'
                placeholder='Name'
                register={register}
            />
            <FormItem
                error={errors.maxCapacity?.message}
                id='maxCapacity'
                inputMode='decimal'
                isFormDirty={isDirty}
                label='Max capacity'
                name='maxCapacity'
                register={register}
                step='0.01'
                type='number'
                valueAsNumber
            />
            <FormItem
                error={errors.regularPrice?.message}
                id='regularPrice'
                inputMode='decimal'
                isFormDirty={isDirty}
                label='Regular price'
                name='regularPrice'
                register={register}
                step='0.01'
                type='number'
                valueAsNumber
            />
            <FormItem
                error={errors.discount?.message}
                id='discount'
                inputMode='decimal'
                isFormDirty={isDirty}
                label='Discount'
                name='discount'
                register={register}
                step='0.01'
                type='number'
                valueAsNumber
            />
            <FormItem
                error={errors.description?.message}
                id='description'
                isFormDirty={isDirty}
                label='Cabin description'
                name='description'
                placeholder='Description'
                register={register}
            />
            <FormItem
                error={errors.image?.message}
                id='image'
                isFormDirty={isDirty}
                label='Cabin photo'
                name='image'
                register={register}
                type='file'
            />
            <div className='flex items-center justify-between'>
                <DialogClose asChild>
                    <Button variant='outline'>Cancel</Button>
                </DialogClose>
                <Button
                    disabled={createEditCabinMutation.isPending || !isDirty}
                    type='submit'
                    variant='default'
                >
                    {createEditCabinMutation.isPending ? (
                        <Loader className='size-4 animate-spin stroke-indigo-500 hover:cursor-pointer' />
                    ) : null}
                    Save
                </Button>
            </div>
        </form>
    );
};
export default CabinForm;
