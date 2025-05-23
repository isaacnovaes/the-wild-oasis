/* eslint-disable camelcase */
import { z } from 'zod';
import { CabinSchema } from './cabins';

export const GuestSchema = z.object({
    countryFlag: z.string(),
    created_at: z.string().datetime({ offset: true, local: true }),
    email: z.string().email(),
    fullName: z.string(),
    id: z.number().positive('Positive value only').int('Only integers'),
    nationalId: z.string(),
    nationality: z.string(),
});
export type Guest = z.infer<typeof GuestSchema>;

export const BookingSchema = z.object({
    id: z.number().positive('Positive value only').int('Only integers'),
    created_at: z.string().datetime({ offset: true, local: true }),
    startDate: z.string().datetime({ offset: true, local: true }),
    endDate: z.string().datetime({ offset: true, local: true }),
    numNights: z.number().int('Only integers').positive('Positive value only'),
    numGuests: z.number().int('Only integers').positive('Positive value only'),
    cabinPrice: z.number().nonnegative('Negative value is not accepted'),
    extrasPrice: z.number().nonnegative('Negative value is not accepted'),
    status: z.enum(['unconfirmed', 'checked-in', 'checked-out']),
    hasBreakfast: z.boolean(),
    isPaid: z.boolean(),
    observations: z.string().optional(),
    totalPrice: z.number().nonnegative(),
    cabinId: z
        .number({ message: 'Should be a number' })
        .positive('Positive value only')
        .int('Only integers'),
    guestId: z
        .number({ message: 'Should be a number' })
        .positive('Positive value only')
        .int('Only integers'),
    cabins: CabinSchema,
    guests: GuestSchema,
});
export type Booking = z.infer<typeof BookingSchema>;

export const CreateBookingSchema = BookingSchema.omit({
    id: true,
    created_at: true,
    cabins: true,
    guests: true,
});

export type CreateBooking = z.infer<typeof CreateBookingSchema>;

export const BookingFormSchema = BookingSchema.omit({
    id: true, // created in db
    created_at: true, // created in db
    cabinPrice: true, // handled in the api
    extrasPrice: true, // handled in the api
    status: true, // handled in the api
    totalPrice: true, // handled in the api
    cabins: true, // only cabinId is needed
    guests: true, // only guestId is needed
    numNights: true,
    numGuests: true,
    startDate: true,
    endDate: true,
}).extend({
    numNights: z.coerce.number().int('Only integers').positive('Positive value only'),
    numGuests: z.coerce.number().int('Only integers').positive('Positive value only'),
    bookingDates: z.object({
        from: z.date(),
        to: z.date(),
    }),
});

export type BookingForm = z.infer<typeof BookingFormSchema>;

export const BookingRowSchema = BookingSchema.pick({
    id: true,
    created_at: true,
    startDate: true,
    endDate: true,
    numNights: true,
    numGuests: true,
    status: true,
    totalPrice: true,
}).extend({
    cabins: z.object({
        id: z.number(),
    }),
    guests: z.object({
        fullName: z.string(),
        email: z.string().email(),
    }),
});

export type BookingRow = z.infer<typeof BookingRowSchema>;
