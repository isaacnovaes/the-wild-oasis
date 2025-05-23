import { z } from 'zod';
import { BookingSchema } from './bookings';
import { CabinSchema } from './cabins';

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
