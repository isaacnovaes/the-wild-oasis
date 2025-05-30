import { getSettings } from '@/services/apiSettings.ts';
import { CabinSchema } from '@/types/cabins.ts';
import { GuestSchema } from '@/types/guests.ts';
import { isFuture, isPast, isToday } from 'date-fns';
import { z } from 'zod';
import supabase from '../supabase.ts';
import type { Booking } from '../types/bookings.ts';
import { subtractDates } from '../utils/helpers.ts';
import { bookings } from './data-bookings.ts';
import { cabins } from './data-cabins.ts';
import { guests } from './data-guests.ts';

async function deleteGuests() {
    const { error } = await supabase.from('guests').delete().gt('id', 0);
    if (error) {
        console.error(error.message);
        throw new Error(error.message);
    }
}

async function deleteCabins() {
    const { error } = await supabase.from('cabins').delete().gt('id', 0);
    if (error) {
        console.error(error.message);
        throw new Error(error.message);
    }
}

async function deleteBookings() {
    const { error } = await supabase.from('bookings').delete().gt('id', 0);
    if (error) {
        console.error(error.message);
        throw new Error(error.message);
    }
}

async function createGuests() {
    const { error } = await supabase.from('guests').insert(guests);
    if (error) {
        console.error(error.message);
        throw new Error(error.message);
    }
}

async function createCabins() {
    const { error } = await supabase.from('cabins').insert(cabins);
    if (error) {
        console.error(error.message);
        throw new Error(error.message);
    }
}

async function createBookings() {
    const { data: dataGuests } = await supabase.from('guests').select('id').order('id');

    const guestsIdsResponseValidation = z
        .array(GuestSchema.pick({ id: true }))
        .safeParse(dataGuests);

    if (guestsIdsResponseValidation.error) {
        throw new Error(guestsIdsResponseValidation.error.message);
    }

    const guestsIds = guestsIdsResponseValidation.data;
    const allGuestIds = guestsIds.map((g) => g.id);

    const { data: dataCabins } = await supabase.from('cabins').select('id').order('id');

    const cabinsIdsResponseValidation = z
        .array(CabinSchema.pick({ id: true }))
        .safeParse(dataCabins);

    if (cabinsIdsResponseValidation.error) {
        throw new Error(cabinsIdsResponseValidation.error.message);
    }

    const cabinsIds = cabinsIdsResponseValidation.data;
    const allCabinIds = cabinsIds.map((c) => c.id);

    const settings = await getSettings();

    const finalBookings = bookings.map((booking): Omit<Booking, 'id'> => {
        // Here relying on the order of cabins, as they don't have an ID yet
        const cabin = cabins.at(booking.cabinId - 1);
        const guestId = allGuestIds.at(booking.guestId - 1);
        const cabinId = allCabinIds.at(booking.cabinId - 1);

        if (!cabin || !guestId || !cabinId) {
            throw new Error(`No cabin at position [${(booking.cabinId - 1).toString()}]`);
        }

        const numNights = subtractDates(booking.endDate, booking.startDate);
        const cabinPrice = numNights * (cabin.regularPrice - cabin.discount);
        const extrasPrice = booking.hasBreakfast
            ? numNights * settings.breakfastPrice * booking.numGuests
            : 0;
        const totalPrice = cabinPrice * numNights + extrasPrice;

        let status: Booking['status'] = 'checked-in';
        if (isPast(new Date(booking.endDate)) && !isToday(new Date(booking.endDate)))
            status = 'checked-out';
        if (isFuture(new Date(booking.startDate)) || isToday(new Date(booking.startDate)))
            status = 'unconfirmed';

        return {
            ...booking,
            numNights,
            cabinPrice,
            extrasPrice,
            totalPrice,
            guestId,
            cabinId,
            status,
        };
    });

    const { error } = await supabase.from('bookings').insert(finalBookings);
    if (error) {
        console.error(error.message);
        throw new Error(error.message);
    }
}

export const seedDb = async () => {
    // Bookings need to be deleted FIRST
    await deleteBookings();
    await deleteGuests();
    await deleteCabins();

    // Bookings need to be created LAST
    await createGuests();
    await createCabins();
    await createBookings();
};
