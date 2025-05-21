import Checkin from '@/features/bookings/Checkin';
import { createFileRoute, ErrorComponent } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/check-in/$bookingId')({
    component: Checkin,
    errorComponent: ErrorComponent,
});
