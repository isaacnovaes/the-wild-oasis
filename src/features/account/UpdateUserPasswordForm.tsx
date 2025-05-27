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
import { useUpdateUserMutation } from '@/utils/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const UpdateUserPasswordSchema = z
    .object({
        password: z.string().min(6, 'Min 6 characters'),
        confirmPassword: z.string().min(6, 'Min 6 characters'),
    })
    .refine(
        (obj) => {
            return obj.password === obj.confirmPassword;
        },
        { message: 'Confirm password should match password', path: ['confirmPassword'] }
    );

type UpdateUserPasswordT = z.infer<typeof UpdateUserPasswordSchema>;

const UpdateUserPassword = () => {
    const form = useForm({
        resolver: zodResolver(UpdateUserPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    const updateUserMutation = useUpdateUserMutation();

    const onSubmit = (formData: UpdateUserPasswordT) => {
        updateUserMutation.mutate(formData);
    };

    return (
        <section>
            <h2 className='pt-4 pb-2'>Update user password</h2>
            <Form {...form}>
                <form
                    className='space-y-5 rounded-md border-2 border-gray-100 bg-white p-4 shadow-md'
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder='******' type='password' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='confirmPassword'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm password</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder='******' type='password' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
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
export default UpdateUserPassword;
