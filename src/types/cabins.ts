/* eslint-disable camelcase */
import { z } from 'zod';

export const CabinSchema = z.object({
    id: z.number().positive('Positive value only').int('Only integers'),
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
    maxCapacity: true,
    regularPrice: true,
    discount: true,
    image: true,
    linkedToBooking: true,
})
    .extend({
        maxCapacity: z.coerce
            .number({ message: 'Required field' })
            .int('Only integers')
            .positive({ message: 'Positive value only' }),
        regularPrice: z.coerce
            .number({ message: 'Required field' })
            .positive({ message: 'Positive value only' }),
        discount: z.coerce
            .number({ message: 'Required field' })
            .nonnegative({ message: 'Negative values are not accepted' }),
        image: z.union([z.string().min(3, 'Min 4 characters'), CabinImageFileListSchema]),
    })
    .refine((c) => c.discount < c.regularPrice, {
        message: 'Discount should be less than regular price',
        path: ['discount'],
    });

export type CabinForm = z.infer<typeof CabinFormSchema>;
