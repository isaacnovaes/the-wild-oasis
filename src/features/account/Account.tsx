import PageHeader from '@/components/PageHeader';
import UpdateUserDataForm from './UpdateUserDataForm';
import UpdateUserPasswordForm from './UpdateUserPasswordForm';

const Account = () => {
    return (
        <>
            <PageHeader title='Manage your account' />
            <UpdateUserDataForm />
            <UpdateUserPasswordForm />
        </>
    );
};
export default Account;
