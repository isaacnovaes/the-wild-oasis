/* eslint-disable camelcase */
import supabase from '@/supabase';
import { GuestSchema } from '@/types/guests';
import { z } from 'zod';

export const getGuests = async () => {
    const response = await supabase.from('guests').select('id, fullName,  email');

    if (response.error) {
        throw new Error(response.error.message);
    }

    const responseSchema = z.object({
        guests: z.array(
            GuestSchema.omit({
                countryFlag: true,
                nationality: true,
                nationalId: true,
                created_at: true,
            })
        ),
    });

    const validation = responseSchema.safeParse({
        guests: response.data,
    });

    if (validation.error) {
        console.error(validation.error);
        throw new Error(validation.error.message);
    }

    return validation.data;
};
