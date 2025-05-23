/* eslint-disable camelcase */
import { z } from 'zod';

export const SettingsSchema = z.object({
    breakfastPrice: z.number().nonnegative('Negative value is not accepted'),
    created_at: z.string().datetime({ offset: true, local: true }),
    editedAt: z.string().datetime({ offset: true, local: true }),
    id: z.number().positive('Positive value only').int('Only integers'),
    maxBookingLength: z.number().int('Only integers').nonnegative('Negative value is not accepted'),
    maxGestsPerBooking: z
        .number()
        .int('Only integers')
        .nonnegative('Negative value is not accepted'),
    minBookingLength: z.number().int('Only integers').nonnegative('Negative value is not accepted'),
});

export type Settings = z.infer<typeof SettingsSchema>;
