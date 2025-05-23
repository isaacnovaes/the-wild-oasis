/* eslint-disable camelcase */
import { z } from 'zod';

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
