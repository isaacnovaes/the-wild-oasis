import PageHeader from '@/components/PageHeader';
import UpdateUserDataForm from './UpdateUserDataForm';

const Account = () => {
    return (
        <>
            <PageHeader title='Manage your account' />
            <UpdateUserDataForm />
        </>
    );
};
export default Account;
