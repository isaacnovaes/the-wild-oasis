import FormItemC from '@/components/FormItem';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createEditCabin } from '@/services/apiCabins';
import { CabinFormSchema, type Cabin, type CabinForm as CabinFormT } from '@/types/cabins';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';

type Props =
    | { mode: 'create'; readonly onSuccess: () => void }
    | { mode: 'edit'; readonly onSuccess: () => void; readonly cabin: Cabin };

const CabinForm = (props: Props) => {
    const form = useForm<CabinFormT>({
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
        onMutate: ({ id }) =>
            toast.loading(
                props.mode === 'create'
                    ? 'Creating cabin'
                    : `Editing cabin #${id?.toString() ?? ''}`
            ),
        onSuccess: (cabin, _vars, toasterId) => {
            void queryClient.invalidateQueries({ queryKey: ['cabins'] });
            toast.success(
                `Cabin ${cabin.id.toString()} ${props.mode === 'create' ? 'created' : 'edited'}`,
                { id: toasterId }
            );
            props.onSuccess();
        },
        onError: (e, _vars, toasterId) => {
            toast.error(e.message, { id: toasterId });
        },
    });

    const onSubmit: SubmitHandler<CabinFormT> = (cabinForm) => {
        createEditCabinMutation.mutate({
            newCabin: cabinForm,
            id: props.mode === 'edit' ? props.cabin.id : undefined,
        });
    };

    return (
        <Form {...form}>
            <form className='mt-3 space-y-3 px-1' onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cabin name</FormLabel>
                            <FormControl>
                                <Input placeholder='Name' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='maxCapacity'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Max capacity</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='0'
                                    {...field}
                                    inputMode='decimal'
                                    step='0.01'
                                    type='number'
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='regularPrice'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Regular price</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='0'
                                    {...field}
                                    inputMode='decimal'
                                    step='0.01'
                                    type='number'
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='discount'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Discount</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='0'
                                    {...field}
                                    inputMode='decimal'
                                    step='0.01'
                                    type='number'
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input placeholder='Description' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormItemC
                    error={form.formState.errors.image?.message}
                    id='image'
                    inputType='registered'
                    isFormDirty={form.formState.isDirty}
                    label='Cabin photo'
                    {...form.register('image')}
                    type='file'
                />
                <div className='flex items-center justify-between'>
                    <DialogClose asChild>
                        <Button variant='outline'>Cancel</Button>
                    </DialogClose>
                    <Button
                        disabled={createEditCabinMutation.isPending || !form.formState.isDirty}
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
        </Form>
    );
};
export default CabinForm;
