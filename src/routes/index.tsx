import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
    component: () => <Navigate replace search={{ last: 7 }} to='/dashboard' />,
});
