import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CabinImageFileListSchema } from '@/types/cabins';
import { useUpdateUserMutation, useUser } from '@/utils/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import FormItemC from '../../components/FormItem';

const UpdateUserSchema = z.object({
    email: z.string().email('Invalid email'),
    fullName: z.string().min(5, 'Min 5 characters'),
    avatar: z.union([z.string().min(3, 'Min 4 characters'), CabinImageFileListSchema]),
});

type UpdateUser = z.infer<typeof UpdateUserSchema>;

const UpdateUserDataForm = () => {
    const { user } = useUser();
    const form = useForm({
        resolver: zodResolver(UpdateUserSchema),
        defaultValues: {
            email: user?.email,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
            fullName: user?.user_metadata.fullName as string,
            avatar: '',
        },
    });

    const updateUserMutation = useUpdateUserMutation();

    const onSubmit = (formData: UpdateUser) => {
        updateUserMutation.mutate(
            {
                ...formData,
                avatar:
                    formData.avatar instanceof FileList
                        ? (formData.avatar.item(0) as File)
                        : undefined,
            },
            {
                onSuccess: () => {
                    form.reset();
                },
            }
        );
    };

    return (
        <section>
            <h2 className='py-2'>Update user data</h2>
            <Form {...form}>
                <form
                    className='space-y-5 rounded-md border-2 border-gray-100 bg-white p-4 shadow-md'
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled type='email' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='fullName'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormItemC
                        error={form.formState.errors.avatar?.message}
                        id='avatar'
                        inputType='registered'
                        isFormDirty={form.formState.isDirty}
                        label='Avatar'
                        {...form.register('avatar')}
                        type='file'
                    />
                    <Button type='submit'>
                        {updateUserMutation.isPending ? (
                            <Loader2 className='size-4 animate-spin stroke-indigo-500' />
                        ) : null}{' '}
                        Update
                    </Button>
                </form>
            </Form>
        </section>
    );
};
export default UpdateUserDataForm;
