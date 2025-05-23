import type { SearchParams } from '@/types/global';
import { z } from 'zod';
import supabase from '../supabase';
import {
    BookingRowSchema,
    BookingSchema,
    type Booking,
    type CreateBooking,
} from '../types/bookings';
import { PAGE_SIZE } from '../utils/constants';
import { getToday } from '../utils/helpers';

export async function getBookings({ filter, sortBy, page }: SearchParams) {
    let query = supabase
        .from('bookings')
        .select(
            'id, created_at, startDate, endDate, numNights, numGuests, status, totalPrice,cabinId, guestId, cabins(id), guests(fullName, email)',
            { count: 'exact' }
        );
    // FILTER

    if (filter && filter.value !== 'all') {
        query = query[filter.method || 'eq'](filter.field, filter.value);
    }

    // SORT
    if (sortBy)
        query = query.order(sortBy.field, {
            ascending: sortBy.direction === 'asc',
        });

    const queryPage = page;

    const from = (queryPage - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);

    const response = await query;
    const { data, error, count } = response;

    if (error) {
        console.error(error);
        throw new Error(error.message);
    }

    const responseSchema = z.object({
        bookings: z.array(BookingRowSchema),
        count: z.number(),
    });

    const validation = responseSchema.safeParse({ bookings: data, count });

    if (validation.error) {
        console.error(validation.error);
        throw new Error(validation.error.message);
    }

    return validation.data;
}

export async function getBooking(id: string): Promise<Booking> {
    const response = await supabase
        .from('bookings')
        .select('*, cabins(*), guests(*)')
        .eq('id', id)
        .single();

    if (response.error) {
        console.error(response.error);
        throw new Error(response.error.message);
    }

    const validation = BookingSchema.safeParse(response.data);

    if (validation.error) {
        console.error(validation.error);
        throw new Error(validation.error.message);
    }

    return validation.data;
}

export async function createBooking(newBooking: CreateBooking) {
    const response = await supabase
        .from('bookings')
        .insert(newBooking)
        .select(
            'id, created_at, startDate, endDate, numNights, numGuests, status, totalPrice,cabinId, guestId, cabins(id), guests(fullName, email)'
        )
        .single();

    if (response.error) {
        throw new Error(response.error.message);
    }

    const validation = BookingRowSchema.safeParse(response.data);

    if (validation.error) {
        console.error(validation.error);
        throw new Error(validation.error.message);
    }

    return validation.data;
}

export async function updateBooking(id: string, obj: Partial<Booking>) {
    const response = await supabase.from('bookings').update(obj).eq('id', id).select().single();

    if (response.error) {
        throw new Error(response.error.message);
    }

    const validation = BookingSchema.omit({ cabins: true, guests: true })
        .extend({ cabinId: z.number().nonnegative(), guestId: z.number().nonnegative() })
        .safeParse(response.data);

    if (validation.error) {
        console.error(validation.error);
        throw new Error(validation.error.message);
    }

    return validation.data;
}

// date: ISOString
export async function getBookingsAfterDate(date: string) {
    const { data, error } = await supabase
        .from('bookings')
        .select('created_at, totalPrice, extrasPrice')
        .gte('created_at', date)
        .lte('created_at', getToday({ end: true }));

    if (error) {
        console.error(error);
        throw new Error(error.message);
    }

    const bookingResponseSchema = BookingSchema.pick({
        id: true,
        // eslint-disable-next-line camelcase
        created_at: true,
        totalPrice: true,
        extrasPrice: true,
    });

    const responseSchema = z.object({
        bookings: z.array(bookingResponseSchema),
    });

    const validation = responseSchema.safeParse({ bookings: data });

    if (validation.error) {
        console.error(validation.error);
        throw new Error(validation.error.message);
    }

    return validation.data.bookings;
}

export async function getStaysAfterDate(date: string) {
    const { data, error } = await supabase
        .from('bookings')
        .select('*, guests(fullName)')
        .gte('startDate', date)
        .lte('startDate', getToday());

    if (error) {
        console.error(error);
        throw new Error(error.message);
    }
    const bookingResponseSchema = BookingSchema.omit({ guests: true }).extend({
        guests: z.object({
            fullName: z.string(),
        }),
    });

    const responseSchema = z.object({
        bookings: z.array(bookingResponseSchema),
    });

    const validation = responseSchema.safeParse({ bookings: data });

    if (validation.error) {
        console.error(validation.error);
        throw new Error(validation.error.message);
    }

    return validation.data.bookings;
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity(): Promise<Booking[]> {
    const { data, error } = await supabase
        .from('bookings')
        .select('*, guests(fullName, nationality, countryFlag)')
        .or(
            `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
        )
        .order('created_at');

    // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
    // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
    // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

    if (error) {
        console.error(error);
        throw new Error(error.message);
    }
    return data;
}

export async function deleteBooking({ cabinId, id }: { id: string; cabinId: string }) {
    const { error: bookingsError1 } = await supabase.from('bookings').delete().eq('id', id);
    if (bookingsError1) {
        console.error(bookingsError1);
        throw new Error(bookingsError1.message);
    }

    const { error: bookingsError2, count } = await supabase
        .from('bookings')
        .select('id', { count: 'exact' })
        .eq('cabinId', cabinId);

    if (bookingsError2) {
        console.error(bookingsError2);
        throw new Error(bookingsError2.message);
    }

    let updateCabin = false;

    if (count !== null && count <= 0) {
        const { error: cabinsError1 } = await supabase
            .from('cabins')
            .update({ linkedToBooking: false })
            .eq('id', cabinId);
        if (cabinsError1) {
            console.error(cabinsError1);
            throw new Error(cabinsError1.message);
        }

        updateCabin = true;
    }

    return { updateCabin };
}
