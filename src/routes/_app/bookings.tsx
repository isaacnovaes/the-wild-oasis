import { createFileRoute } from '@tanstack/react-router';
import Bookings from '../../features/bookings/Bookings';

export const Route = createFileRoute('/_app/bookings')({
    component: Bookings,
});
