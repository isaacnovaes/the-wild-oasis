import type { getAllCabins } from '@/services/apiCabins';
import { differenceInDays, formatDistance, formatISO, parseISO } from 'date-fns';
import type { Booking, BookingForm, CreateBooking } from '../types/bookings';

// We want to make this function work for both Date objects and strings (which come from Supabase)
export const subtractDates = (dateStr1: string, dateStr2: string) =>
    differenceInDays(parseISO(dateStr1), parseISO(dateStr2));

export const formatDistanceFromNow = (dateStr: string) =>
    formatDistance(parseISO(dateStr), new Date(), {
        addSuffix: true,
    })
        .replace('about ', '')
        .replace('in', 'In');

// Supabase needs an ISO date string. However, that string will be different on every render because the MS or SEC have changed, which isn't good. So we use this trick to remove any time
export const getToday = function (options: { end: boolean } = { end: false }) {
    const today = new Date();

    // This is necessary to compare with created_at from Supabase, because it it not at 0.0.0.0, so we need to set the date to be END of the day when we compare it with earlier dates
    if (options.end)
        // Set to the last second of the day
        today.setUTCHours(23, 59, 59, 999);
    else today.setUTCHours(0, 0, 0, 0);
    return today.toISOString();
};

export const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en', { style: 'currency', currency: 'USD' }).format(value);

export async function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const statusToStyleMap: Record<Booking['status'], { color: string; background: string }> = {
    unconfirmed: { color: 'text-sky-700', background: 'bg-sky-100' },
    'checked-in': { color: 'text-green-700', background: 'bg-green-100' },
    'checked-out': { color: 'text-rose-700', background: 'bg-rose-100' },
};

export const getBookingStatusStyle = (status: Booking['status']) => statusToStyleMap[status];

export const getCreateBooking = ({
    cabin,
    formData,
    breakfastPrice,
}: {
    formData: BookingForm;
    cabin: Awaited<ReturnType<typeof getAllCabins>>['cabins'][0];
    breakfastPrice: number;
}): CreateBooking => {
    return {
        startDate: formatISO(formData.bookingDates.from),
        endDate: formatISO(formData.bookingDates.to),
        numNights: formData.numNights,
        numGuests: formData.numGuests,
        cabinPrice: cabin.regularPrice,
        extrasPrice: formData.hasBreakfast
            ? breakfastPrice * formData.numGuests * formData.numNights
            : 0,
        status: 'unconfirmed',
        hasBreakfast: formData.hasBreakfast,
        isPaid: formData.isPaid,
        observations: formData.observations,
        totalPrice:
            cabin.regularPrice * formData.numNights +
            (formData.hasBreakfast ? breakfastPrice * formData.numGuests * formData.numNights : 0),
        cabinId: formData.cabinId,
        guestId: formData.guestId,
    };
};
