/* eslint-disable camelcase */
import '@tanstack/react-query';
import { z } from 'zod';

export const CabinSchema = z.object({
    id: z.number(),
    created_at: z.string().datetime({ offset: true, local: true }),
    name: z.string(),
    maxCapacity: z.number(),
    regularPrice: z.number(),
    discount: z.number(),
    description: z.string().optional(),
    image: z.string(),
});
export type Cabin = z.infer<typeof CabinSchema>;

export const GuestSchema = z.object({
    countryFlag: z.string(),
    created_at: z.string().datetime({ offset: true, local: true }),
    email: z.string().email(),
    fullName: z.string(),
    id: z.number(),
    nationalId: z.string(),
    nationality: z.string(),
});
export type Guest = z.infer<typeof GuestSchema>;

export const BookingSchema = z.object({
    id: z.number(),
    created_at: z.string().datetime({ offset: true, local: true }),
    startDate: z.string().datetime({ offset: true, local: true }),
    endDate: z.string().datetime({ offset: true, local: true }),
    numNights: z.number(),
    numGuests: z.number(),
    cabinPrice: z.number(),
    extrasPrice: z.number(),
    status: z.enum(['unconfirmed', 'checked-in', 'checked-out']),
    hasBreakfast: z.boolean(),
    isPaid: z.boolean(),
    observations: z.string().optional(),
    totalPrice: z.number(),
    cabins: CabinSchema,
    guests: GuestSchema,
});
export type Booking = z.infer<typeof BookingSchema>;

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
        name: z.string(),
    }),
    guests: z.object({
        fullName: z.string(),
        email: z.string(),
    }),
});

export type BookingRow = z.infer<typeof BookingRowSchema>;

export const SettingsSchema = z.object({
    breakfastPrince: z.number(),
    created_at: z.string().datetime({ offset: true, local: true }),
    editedAt: z.string().datetime({ offset: true, local: true }),
    id: z.number(),
    maxBookingLength: z.number(),
    maxGestsPerBooking: z.number(),
    minBookingLength: z.number(),
});

export type Settings = z.infer<typeof SettingsSchema>;

export const SearchFieldsSchema = z.union([BookingSchema.keyof(), CabinSchema.keyof()]);
export type SearchField = z.infer<typeof SearchFieldsSchema>;

export const SortByDirectionSchema = z.enum(['asc', 'desc']);

export const SortBySchema = z
    .object({
        field: SearchFieldsSchema,
        direction: SortByDirectionSchema,
    })
    .optional();

export const SearchParamsSchema = z.object({
    filter: z
        .object({
            field: SearchFieldsSchema,
            method: z.string(),
            value: z.string(),
        })
        .optional(),
    sortBy: SortBySchema,
    page: z.number().int().gte(1, { message: 'Page search param must be a positive number' }),
});

export type SearchParams = z.infer<typeof SearchParamsSchema>;

export type SelectOption = { value: string; label: string };

export type FilterOption = { value: string; label: string; method: string };
