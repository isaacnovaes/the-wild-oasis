import { createFileRoute, ErrorComponent } from '@tanstack/react-router';
import Users from '../../features/users/Users';

export const Route = createFileRoute('/_app/users')({
    component: Users,
    errorComponent: ErrorComponent,
});
