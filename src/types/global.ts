/* eslint-disable camelcase */
import '@tanstack/react-query';
import { z } from 'zod';

export const CabinSchema = z.object({
    id: z.number().nonnegative({ message: 'Negative value is not accepted' }),
    created_at: z.string().datetime({ offset: true, local: true }),
    name: z.string({ message: 'Required field' }).min(3, 'Min 3 characters'),
    maxCapacity: z
        .number({ message: 'Required field' })
        .int('Only integers')
        .positive({ message: 'Positive value only' }),
    regularPrice: z
        .number({ message: 'Required field' })
        .positive({ message: 'Positive value only' }),
    discount: z
        .number({ message: 'Required field' })
        .nonnegative({ message: 'Negative values are not accepted' }),
    description: z.string().optional(),
    image: z.string().min(3, 'Min 4 characters'),
    linkedToBooking: z.boolean(),
});
export type Cabin = z.infer<typeof CabinSchema>;

export const CabinImageFileListSchema = z
    .instanceof(FileList)
    .refine((arg) => ['image/jpeg', 'image/png'].includes(arg.item(0)?.type ?? ''), {
        message: 'Image format should be either .jpeg or .png',
    });

export const CabinImageFileSchema = z.instanceof(File);

export const CabinFormSchema = CabinSchema.omit({
    id: true,
    created_at: true,
    image: true,
    linkedToBooking: true,
}).extend({
    image: z.union([z.string().min(3, 'Min 4 characters'), CabinImageFileListSchema]),
});

export type CabinForm = z.infer<typeof CabinFormSchema>;

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
    numNights: z.number().int('Only integers').nonnegative('Negative value is not accepted'),
    numGuests: z.number().int('Only integers').nonnegative('Negative value is not accepted'),
    cabinPrice: z.number().nonnegative('Negative value is not accepted'),
    extrasPrice: z.number().nonnegative('Negative value is not accepted'),
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
        id: z.number(),
    }),
    guests: z.object({
        fullName: z.string(),
        email: z.string().email(),
    }),
});

export type BookingRow = z.infer<typeof BookingRowSchema>;

export const SettingsSchema = z.object({
    breakfastPrince: z.number().nonnegative('Negative value is not accepted'),
    created_at: z.string().datetime({ offset: true, local: true }),
    editedAt: z.string().datetime({ offset: true, local: true }),
    id: z.number(),
    maxBookingLength: z.number().int('Only integers').nonnegative('Negative value is not accepted'),
    maxGestsPerBooking: z
        .number()
        .int('Only integers')
        .nonnegative('Negative value is not accepted'),
    minBookingLength: z.number().int('Only integers').nonnegative('Negative value is not accepted'),
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
