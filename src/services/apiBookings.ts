import { z } from 'zod';
import supabase from '../supabase';
import { BookingRowSchema, BookingSchema, type Booking, type SearchParams } from '../types/global';
import { PAGE_SIZE } from '../utils/constants';
import { getToday } from '../utils/helpers';

export async function getBookings({ filter, sortBy, page }: SearchParams) {
    let query = supabase
        .from('bookings')
        .select(
            'id, created_at, startDate, endDate, numNights, numGuests, status, totalPrice, cabins(name), guests(fullName, email)',
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

    const queryPage = page ?? 1;

    const from = (queryPage - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);

    const response = await query;
    const { data, error, count } = response;

    if (error) {
        console.error(error);
        throw new Error('Bookings could not be loaded');
    }

    const responseSchema = z.object({
        bookings: z.array(BookingRowSchema),
        count: z.number(),
    });

    const validation = responseSchema.safeParse({ bookings: data, count });

    if (validation.error) {
        console.error(validation.error);
        throw new Error('Bookings schema validation failed');
    }

    return validation.data;
}

export async function getBooking(id: string): Promise<Booking> {
    const { data, error } = await supabase
        .from('bookings')
        .select('*, cabins(*), guests(*)')
        .eq('id', id)
        .single();

    if (error) {
        console.error(error);
        throw new Error('Booking not found');
    }

    const validation = BookingSchema.safeParse(data);

    if (validation.error) {
        console.error(validation.error);
        throw new Error('Booking schema validation failed');
    }

    return validation.data;
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
// date: ISOString
export async function getBookingsAfterDate(date: string) {
    const { data, error } = await supabase
        .from('bookings')
        .select('created_at, totalPrice, extrasPrice')
        .gte('created_at', date)
        .lte('created_at', getToday({ end: true }));

    if (error) {
        console.error(error);
        throw new Error('Bookings could not get loaded');
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
        throw new Error('Bookings schema validation failed');
    }

    return validation.data.bookings;
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date: string) {
    const { data, error } = await supabase
        .from('bookings')
        .select('*, guests(fullName)')
        .gte('startDate', date)
        .lte('startDate', getToday());

    if (error) {
        console.error(error);
        throw new Error('Bookings could not get loaded');
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
        throw new Error('Bookings schema validation failed');
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
        throw new Error('Bookings could not get loaded');
    }
    return data;
}

export async function updateBooking(id: string, obj: Partial<Booking>) {
    const { data, error } = await supabase
        .from('bookings')
        .update(obj)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error(error);
        throw new Error('Booking could not be updated');
    }
    return data;
}

export async function deleteBooking(id: string) {
    // REMEMBER RLS POLICIES
    const { data, error } = await supabase.from('bookings').delete().eq('id', id);

    if (error) {
        console.error(error);
        throw new Error('Booking could not be deleted');
    }
    return data;
}
