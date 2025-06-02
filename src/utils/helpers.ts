import type { getAllCabins } from '@/services/apiCabins';
import {
    differenceInCalendarDays,
    differenceInDays,
    formatDistance,
    formatISO,
    parseISO,
} from 'date-fns';
import type { Booking, BookingForm, CreateBooking } from '../types/bookings';

export const subtractDates = (dateStr1: string, dateStr2: string) =>
    differenceInDays(parseISO(dateStr1), parseISO(dateStr2));

export const formatDistanceFromNow = (dateStr: string) =>
    formatDistance(parseISO(dateStr), new Date(), {
        addSuffix: true,
    })
        .replace('about ', '')
        .replace('in', 'In');

export const getToday = function (options: { end: boolean } = { end: false }) {
    const today = new Date();

    if (options.end) today.setUTCHours(23, 59, 59, 999);
    else today.setUTCHours(0, 0, 0, 0);
    return today.toISOString();
};

export const formatCurrency = (value: number) => {
    const formatter = new Intl.NumberFormat('en', {
        style: 'currency',
        currency: 'USD',
        currencyDisplay: 'symbol',
    });

    const formatted = formatter.format(value);

    return formatted.replace(/^(\D)(\d)/, '$1 $2');
};

export async function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const statusToStyleMap: Record<Booking['status'], { color: string; background: string }> = {
    unconfirmed: { color: 'text-sky-700', background: 'bg-sky-100' },
    'checked-in': { color: 'text-green-700', background: 'bg-green-100' },
    'checked-out': { color: 'text-rose-700', background: 'bg-rose-100' },
};

export const getBookingStatusStyle = (status: Booking['status']) => statusToStyleMap[status];

type PrepareBooking =
    | {
          formData: BookingForm;
          cabin: Awaited<ReturnType<typeof getAllCabins>>['cabins'][0];
          breakfastPrice: number;
          type: 'create';
      }
    | {
          formData: BookingForm;
          cabin: Awaited<ReturnType<typeof getAllCabins>>['cabins'][0];
          breakfastPrice: number;
          type: 'edit';
      };

export function prepareBooking({
    cabin,
    formData,
    breakfastPrice,
    type,
}: {
    formData: BookingForm;
    cabin: Awaited<ReturnType<typeof getAllCabins>>['cabins'][0];
    breakfastPrice: number;
    type: 'edit';
}): Omit<CreateBooking, 'status'>;
export function prepareBooking({
    cabin,
    formData,
    breakfastPrice,
    type,
}: {
    formData: BookingForm;
    cabin: Awaited<ReturnType<typeof getAllCabins>>['cabins'][0];
    breakfastPrice: number;
    type: 'create';
}): CreateBooking;
export function prepareBooking({ cabin, formData, breakfastPrice, type }: PrepareBooking) {
    const numNights = differenceInCalendarDays(
        formData.bookingDates.to,
        formData.bookingDates.from
    );
    const extrasPrice = formData.hasBreakfast ? breakfastPrice * formData.numGuests * numNights : 0;

    const bookingWithoutStatus = {
        startDate: formatISO(formData.bookingDates.from),
        endDate: formatISO(formData.bookingDates.to),
        numNights,
        numGuests: formData.numGuests,
        cabinPrice: formData.numGuests * (cabin.regularPrice - cabin.discount),
        extrasPrice,
        hasBreakfast: formData.hasBreakfast,
        isPaid: formData.isPaid,
        observations: formData.observations,
        totalPrice: cabin.regularPrice * numNights + (formData.hasBreakfast ? extrasPrice : 0),
        cabinId: formData.cabinId,
        guestId: formData.guestId,
    };

    if (type === 'create') {
        const createBooking: CreateBooking = {
            ...bookingWithoutStatus,
            status: 'unconfirmed',
        };
        return createBooking;
    }

    return bookingWithoutStatus;
}
