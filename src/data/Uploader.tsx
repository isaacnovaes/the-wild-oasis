import { isFuture, isPast, isToday } from 'date-fns';
import { useState } from 'react';
import supabase from '../supabase.ts';

import { getSettings } from '@/services/apiSettings.ts';
import type { Booking } from '../types/bookings';
import { subtractDates } from '../utils/helpers.ts';
import { bookings } from './data-bookings';
import { cabins } from './data-cabins';
import { guests } from './data-guests';

async function deleteGuests() {
    const { error } = await supabase.from('guests').delete().gt('id', 0);
    if (error) console.log(error.message);
}

async function deleteCabins() {
    const { error } = await supabase.from('cabins').delete().gt('id', 0);
    if (error) console.log(error.message);
}

async function deleteBookings() {
    const { error } = await supabase.from('bookings').delete().gt('id', 0);
    if (error) console.log(error.message);
}

async function createGuests() {
    const { error } = await supabase.from('guests').insert(guests);
    if (error) console.log(error.message);
}

async function createCabins() {
    const { error } = await supabase.from('cabins').insert(cabins);
    if (error) console.log(error.message);
}

async function createBookings() {
    // Bookings need a guestId and a cabinId. We can't tell Supabase IDs for each object, it will calculate them on its own. So it might be different for different people, especially after multiple uploads. Therefore, we need to first get all guestIds and cabinIds, and then replace the original IDs in the booking data with the actual ones from the DB
    const { data: guestsIds } = await supabase.from('guests').select('id').order('id');
    const allGuestIds = guestsIds?.map((guest) => guest.id);
    const { data: cabinsIds } = await supabase.from('cabins').select('id').order('id');
    const settings = await getSettings();

    const allCabinIds = cabinsIds?.map((cabin) => cabin.id);

    const finalBookings = bookings.map((booking): Booking => {
        // Here relying on the order of cabins, as they don't have an ID yet
        const cabin = cabins.at(booking.cabinId - 1);
        const numNights = subtractDates(booking.endDate, booking.startDate);
        const cabinPrice = numNights * (cabin.regularPrice - cabin.discount);
        const extrasPrice = booking.hasBreakfast
            ? numNights * settings.breakfastPrice * booking.numGuests
            : 0;
        const totalPrice = cabinPrice * numNights + extrasPrice;

        let status;
        if (isPast(new Date(booking.endDate)) && !isToday(new Date(booking.endDate)))
            status = 'checked-out';
        if (isFuture(new Date(booking.startDate)) || isToday(new Date(booking.startDate)))
            status = 'unconfirmed';
        if (
            (isFuture(new Date(booking.endDate)) || isToday(new Date(booking.endDate))) &&
            isPast(new Date(booking.startDate)) &&
            !isToday(new Date(booking.startDate))
        )
            status = 'checked-in';

        return {
            ...booking,
            numNights,
            cabinPrice,
            extrasPrice,
            totalPrice,
            guestId: allGuestIds.at(booking.guestId - 1),
            cabinId: allCabinIds.at(booking.cabinId - 1),
            status,
        };
    });

    const { error } = await supabase.from('bookings').insert(finalBookings);
    if (error) console.log(error.message);
}

function Uploader() {
    const [isLoading, setIsLoading] = useState(false);

    async function uploadAll() {
        setIsLoading(true);
        // Bookings need to be deleted FIRST
        await deleteBookings();
        await deleteGuests();
        await deleteCabins();

        // Bookings need to be created LAST
        await createGuests();
        await createCabins();
        await createBookings();

        setIsLoading(false);
    }

    async function uploadBookings() {
        setIsLoading(true);
        await deleteBookings();
        await createBookings();
        setIsLoading(false);
    }

    return (
        <div
            style={{
                marginTop: 'auto',
                backgroundColor: '#e0e7ff',
                padding: '8px',
                borderRadius: '5px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
            }}
        >
            <h3>SAMPLE DATA</h3>

            <button
                className='cursor-pointer rounded-md border-2 border-indigo-400 p-2 hover:border-indigo-700'
                disabled={isLoading}
                type='button'
                onClick={uploadAll}
            >
                Upload ALL
            </button>

            <button
                className='cursor-pointer rounded-md border-2 border-indigo-400 p-2 hover:border-indigo-700'
                disabled={isLoading}
                type='button'
                onClick={uploadBookings}
            >
                Upload bookings ONLY
            </button>
        </div>
    );
}

export default Uploader;
