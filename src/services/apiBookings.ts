import type { SearchParams } from '@/types/global';
import { endOfDay, formatISO, startOfDay } from 'date-fns';
import { z } from 'zod';
import supabase from '../supabase';
import {
    BookingRowSchema,
    BookingSchema,
    FullBookingSchema,
    type Booking,
    type CreateBooking,
} from '../types/bookings';
import { PAGE_SIZE } from '../utils/constants';
import { getToday } from '../utils/helpers';

export async function getBookings({ filter, sortBy, page }: SearchParams) {
    let query = supabase
        .from('bookings')
        .select(
            'id, startDate, endDate, numNights, numGuests, status, totalPrice,hasBreakfast, isPaid, observations,cabinId, guestId, cabins(id), guests(fullName, email)',
            { count: 'exact' }
        );

    if (filter && filter.value !== 'all') {
        switch (filter.method) {
            case 'eq':
                query = query.eq(filter.field, filter.value);
                break;
            case 'neq':
                query = query.neq(filter.field, filter.value);
                break;
            case 'gt':
                query = query.gt(filter.field, filter.value);
                break;
            case 'lt':
                query = query.lt(filter.field, filter.value);
                break;
            case 'gte':
                query = query.gte(filter.field, filter.value);
                break;
            case 'lte':
                query = query.lte(filter.field, filter.value);
                break;
            case 'like':
                query = query.like(filter.field, filter.value);
                break;
            case 'ilike':
                query = query.ilike(filter.field, filter.value);
                break;
            case 'is':
                query = query.is(filter.field, filter.value);
                break;
            default:
                query = query.eq(filter.field, filter.value);
        }
    }

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

export async function getFullBooking(id: string) {
    const response = await supabase
        .from('bookings')
        .select('*, cabins(*), guests(*)')
        .eq('id', id)
        .single();

    if (response.error) {
        console.error(response.error);
        throw new Error(response.error.message);
    }

    const validation = FullBookingSchema.safeParse(response.data);

    if (validation.error) {
        console.error(validation.error);
        throw new Error(validation.error.message);
    }

    return validation.data;
}

export async function createBooking(newBooking: CreateBooking) {
    const response = await supabase.from('bookings').insert(newBooking).select('*').single();

    if (response.error) {
        throw new Error(response.error.message);
    }

    const validation = BookingSchema.safeParse(response.data);

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

    const validation = BookingSchema.safeParse(response.data);

    if (validation.error) {
        console.error(validation.error);
        throw new Error(validation.error.message);
    }

    return validation.data;
}

export async function getBookingsAfterDate(date: string) {
    const { data, error } = await supabase
        .from('bookings')
        .select('id, created_at, status, totalPrice, numNights, extrasPrice, guests(fullName)')
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
        status: true,
        totalPrice: true,
        numNights: true,
        extrasPrice: true,
    }).extend({
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

export async function getStaysTodayActivity() {
    const startOfDayDate = startOfDay(new Date());
    const startOfDayString = formatISO(startOfDayDate);
    const endOfDayDate = endOfDay(new Date());
    const endOfDayString = formatISO(endOfDayDate);

    const { data, error } = await supabase
        .from('bookings')
        .select('id, status,numNights, guests(fullName, nationality, countryFlag)')
        .or(
            `and(status.eq.unconfirmed,startDate.gte.${startOfDayString},startDate.lte.${endOfDayString}),` +
                `and(status.eq.checked-in,endDate.gte.${startOfDayString},endDate.lte.${endOfDayString})`
        )
        .order('created_at');

    if (error) {
        console.error(error);
        throw new Error(error.message);
    }

    const bookingResponseSchema = BookingSchema.pick({
        id: true,
        status: true,
        numNights: true,
    }).extend({
        guests: z.object({
            fullName: z.string(),
            nationality: z.string(),
            countryFlag: z.string(),
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
