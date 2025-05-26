import PageHeader from '@/components/PageHeader';
import CreateUserForm from './CreateUserForm';

const Users = () => {
    return (
        <div>
            <PageHeader title='Create a user' />
            <CreateUserForm />
        </div>
    );
};
export default Users;
