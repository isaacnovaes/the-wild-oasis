/* eslint-disable camelcase */
import { z } from 'zod';
import { CabinSchema } from './cabins';
import { GuestSchema } from './guests';

export const BookingSchema = z.object({
    id: z.number().positive('Positive value only').int('Only integers'),
    created_at: z.string().datetime({ message: 'Invalid date string', offset: true, local: true }),
    startDate: z.string().datetime({ message: 'Invalid date string', offset: true, local: true }),
    endDate: z.string().datetime({ message: 'Invalid date string', offset: true, local: true }),
    numNights: z.number().int('Only integers').positive('Positive value only'),
    numGuests: z.number().int('Only integers').positive('Positive value only'),
    cabinPrice: z.number().nonnegative('Negative value is not accepted'),
    totalPrice: z.number().nonnegative('Negative value is not accepted'),
    extrasPrice: z.number().nonnegative('Negative value is not accepted'),
    status: z.enum(['unconfirmed', 'checked-in', 'checked-out']),
    isPaid: z.boolean(),
    observations: z.string().optional(),
    hasBreakfast: z.boolean(),
    cabinId: z
        .number({ message: 'Should be a number' })
        .positive('Positive value only')
        .int('Only integers'),
    guestId: z
        .number({ message: 'Should be a number' })
        .positive('Positive value only')
        .int('Only integers'),
});
export type Booking = z.infer<typeof BookingSchema>;

export const FullBookingSchema = BookingSchema.extend({
    cabins: CabinSchema,
    guests: GuestSchema,
});

export type FullBooking = z.infer<typeof FullBookingSchema>;

export const BookingRowSchema = BookingSchema.omit({
    created_at: true,
    cabinPrice: true,
    extrasPrice: true,
}).extend({
    guests: z.object({
        fullName: z.string(),
        email: z.string().email(),
    }),
});

export type BookingRow = z.infer<typeof BookingRowSchema>;

export const CreateBookingSchema = BookingSchema.omit({
    id: true,
    created_at: true,
});

export type CreateBooking = z.infer<typeof CreateBookingSchema>;

export const BookingFormSchema = BookingSchema.omit({
    id: true, // created in db
    created_at: true, // created in db
    cabinPrice: true, // handled in the api
    extrasPrice: true, // handled in the api
    status: true, // handled in the api
    totalPrice: true, // handled in the api
    numNights: true,
    numGuests: true,
    startDate: true,
    endDate: true,
}).extend({
    numGuests: z.coerce.number().int('Only integers').positive('Positive value only'),
    bookingDates: z.object({
        from: z.date(),
        to: z.date(),
    }),
});

export type BookingForm = z.infer<typeof BookingFormSchema>;
