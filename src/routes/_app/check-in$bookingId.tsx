import { createFileRoute, ErrorComponent } from '@tanstack/react-router';
import Booking from '../../features/bookings/Booking';

export const Route = createFileRoute('/_app/check-in$bookingId')({
    component: Booking,
    errorComponent: ErrorComponent,
});
