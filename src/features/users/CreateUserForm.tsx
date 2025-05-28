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
import { signup } from '@/services/apiAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const SignupFormSchema = z
    .object({
        fullName: z.string().min(5, 'Min 5 characters'),
        email: z.string().email('Enter a valid email'),
        password: z.string().min(6, 'Min 6 characters'),
        confirmPassword: z.string().min(6, 'Min 6 characters'),
    })
    .refine(
        (obj) => {
            return obj.password === obj.confirmPassword;
        },
        { message: 'Confirm password should match password', path: ['confirmPassword'] }
    );

type CreateUserFormT = z.infer<typeof SignupFormSchema>;

const CreateUserForm = () => {
    const form = useForm({
        resolver: zodResolver(SignupFormSchema),
        defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
    });

    const createUserMutation = useMutation({
        mutationFn: signup,
        mutationKey: ['signup'],
        onMutate: () => toast.loading('Creating user'),
        onSuccess: (user, _vars, toasterId) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
            toast.success(`User ${user?.user_metadata.fullName as string} created `, {
                id: toasterId,
            });
            form.reset();
        },
        onError: (err, _vars, toasterId) => {
            console.error('ERROR', err);
            toast.error(err.message, { id: toasterId });
        },
    });

    const onSubmit = (formData: CreateUserFormT) => {
        createUserMutation.mutate(formData);
    };

    const disabled = createUserMutation.isPending;

    return (
        <Form {...form}>
            <form
                className='space-y-5 rounded-md border-2 border-gray-100 bg-white p-4 shadow-md'
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FormField
                    control={form.control}
                    name='fullName'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full name</FormLabel>
                            <FormControl>
                                <Input placeholder='John Doe' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder='example@hot.com' {...field} type='email' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder='*****' {...field} type='password' />
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
                                <Input placeholder='*****' {...field} type='password' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className='flex items-center justify-end gap-x-4'>
                    <Button
                        type='reset'
                        variant='ghost'
                        onClick={() => {
                            form.reset();
                        }}
                    >
                        Cancel
                    </Button>
                    <Button disabled={disabled} type='submit'>
                        {createUserMutation.isPending ? (
                            <Loader2 className='size-4 animate-spin stroke-indigo-500' />
                        ) : null}{' '}
                        Crete user
                    </Button>
                </div>
            </form>
        </Form>
    );
};
export default CreateUserForm;
