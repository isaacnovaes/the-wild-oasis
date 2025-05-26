import LoginForm from './LoginForm';

const Login = () => {
    return (
        <div className='grid min-h-dvh grid-cols-[30rem] content-center justify-center gap-12 bg-gray-50'>
            <img alt='logo' className='m-auto h-20 w-auto py-3 lg:h-30' src='logo-light.png' />
            <h4 className='text-center text-3xl font-semibold'>Log in to your account</h4>
            <LoginForm />
        </div>
    );
};
export default Login;
