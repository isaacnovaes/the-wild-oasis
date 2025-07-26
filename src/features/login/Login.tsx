import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popoverDialog';
import { Info } from 'lucide-react';
import LoginForm from './LoginForm';

const Login = () => {
    return (
        <div className='grid min-h-dvh content-center justify-center gap-12 bg-gray-50'>
            <section className='relative max-w-250'>
                <Popover>
                    <PopoverTrigger asChild>
                        <button className='absolute -top-10 right-0' type='button'>
                            <Info className='ml-auto size-13 stroke-indigo-500 p-2 hover:cursor-pointer' />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <section className='grid gap-4'>
                            <div className='space-y-2'>
                                <h4 className='leading-none font-medium'>Project login info</h4>
                                <p className='text-muted-foreground text-sm'>
                                    At every login, the db is seeded, so that fresh data is
                                    displayed. Otherwise, the dashboard would be empty.
                                </p>
                                <p className='text-muted-foreground text-sm'>
                                    For testing, use the following:
                                </p>
                                <ul className='text-muted-foreground text-sm'>
                                    <li>
                                        Email:{' '}
                                        <span className='font-bold text-indigo-500 italic'>
                                            example@test.com
                                        </span>
                                    </li>
                                    <li>
                                        Password:{' '}
                                        <span className='font-bold text-indigo-500 italic'>
                                            1234example
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </section>
                    </PopoverContent>
                </Popover>
                <img alt='logo' className='m-auto h-20 py-3 lg:h-30' src='logo-light.png' />
                <h4 className='my-4 text-center text-3xl font-semibold'>Log in to your account</h4>
                <LoginForm />
            </section>
        </div>
    );
};
export default Login;
