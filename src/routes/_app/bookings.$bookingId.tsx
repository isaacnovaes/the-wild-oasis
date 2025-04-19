import { createFileRoute } from '@tanstack/react-router';
import Booking from '../../features/bookings/Booking';

export const Route = createFileRoute('/_app/bookings/$bookingId')({
    component: Booking,
});
