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
import { login } from '@/services/apiAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const LoginFormSchema = z.object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'Min 6 characters'),
});

type LoginFormT = z.infer<typeof LoginFormSchema>;

const loginRouteApi = getRouteApi('/login');

const LoginForm = () => {
    const form = useForm({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const queryClient = useQueryClient();
    const navigate = loginRouteApi.useNavigate();

    const loginMutation = useMutation({
        mutationFn: login,
        mutationKey: ['login'],
        onSuccess: async (user) => {
            await queryClient.invalidateQueries();
            queryClient.setQueryData(['user'], user.user);
            void navigate({ to: '/dashboard', search: { last: 7 }, replace: true });
        },
        onError: (err) => {
            console.error('ERROR', err);
            toast.error(err.message);
        },
    });

    const onSubmit = (formData: LoginFormT) => {
        loginMutation.mutate(formData);
    };

    const disabled = loginMutation.isPending;

    return (
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
                                <Input
                                    placeholder='example@hot.com'
                                    {...field}
                                    autoComplete='username'
                                    type='email'
                                />
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
                                <Input
                                    placeholder='*****'
                                    {...field}
                                    autoComplete='current-password'
                                    type='password'
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className='w-full' disabled={disabled} type='submit'>
                    {disabled ? (
                        <Loader2 className='size-4 animate-spin stroke-indigo-500' />
                    ) : null}{' '}
                    Login
                </Button>
            </form>
        </Form>
    );
};
export default LoginForm;
