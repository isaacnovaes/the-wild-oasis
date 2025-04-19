import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
    component: () => <Navigate replace to='/dashboard' />,
});
