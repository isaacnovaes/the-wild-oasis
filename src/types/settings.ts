/* eslint-disable camelcase */
import { z } from 'zod';

export const SettingsSchema = z.object({
    id: z.number().positive('Positive value only').int('Only integers'),
    created_at: z.string().datetime({ offset: true, local: true }),
    breakfastPrice: z.number().nonnegative('Negative value is not accepted'),
    maxBookingLength: z.number().int('Only integers').nonnegative('Negative value is not accepted'),
    minBookingLength: z.number().int('Only integers').nonnegative('Negative value is not accepted'),
    maxGestsPerBooking: z
        .number()
        .int('Only integers')
        .nonnegative('Negative value is not accepted'),
    editedAt: z.string().datetime({ offset: true, local: true }),
});

export type Settings = z.infer<typeof SettingsSchema>;
