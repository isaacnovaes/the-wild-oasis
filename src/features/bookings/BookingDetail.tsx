import DataItem from '@/components/DataItem';
import { cn } from '@/lib/utils';
import type { FullBooking } from '@/types/bookings';
import { formatCurrency, formatDistanceFromNow } from '@/utils/helpers';
import { format, isToday } from 'date-fns';
import { CircleCheckBig, CircleDollarSign, MessageSquareText, Warehouse } from 'lucide-react';

const BookingDetail = (props: { readonly booking: FullBooking }) => {
    const {
        numNights,
        cabins,
        startDate,
        endDate,
        guests,
        numGuests,
        observations,
        hasBreakfast,
        cabinPrice,
        extrasPrice,
        isPaid,
        totalPrice,
        // eslint-disable-next-line camelcase
        created_at,
    } = props.booking;

    return (
        <section className='@container/booking-detail overflow-hidden rounded-sm'>
            <header className='flex flex-wrap items-center justify-between gap-x-12 gap-y-3 bg-indigo-500 p-5 text-2xl font-medium text-gray-50'>
                <div className='flex items-center gap-6 text-xl font-semibold'>
                    <Warehouse className='aspect-square w-4 min-w-4 stroke-gray-50' />
                    <p>
                        {numNights} nights in Cabin <span>{cabins.name}</span>
                    </p>
                </div>
                <p className='text-base'>
                    {format(new Date(startDate), 'EEE, MMM dd yyyy')} (
                    {isToday(new Date(startDate)) ? 'Today' : formatDistanceFromNow(startDate)})
                    &mdash; {format(new Date(endDate), 'EEE, MMM dd yyyy')}
                </p>
            </header>
            <section className='bg-white p-5'>
                <div className='mb-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-gray-500'>
                    {guests.countryFlag ? (
                        <img
                            alt={`Flag of ${guests.nationality}`}
                            className='block max-w-6 rounded-xs border-2 border-gray-100'
                            src={guests.countryFlag}
                        />
                    ) : null}
                    <p className='text-primary font-medium'>
                        {guests.fullName}{' '}
                        {numGuests > 1 ? `+ ${(numGuests - 1).toString()} guests` : ''}
                    </p>
                    <div className='flex gap-x-2'>
                        <span>&bull;</span>
                        <p>{guests.email}</p>
                    </div>
                    <div className='flex gap-x-2'>
                        <span>&bull;</span>
                        <p>National ID {guests.nationalId}</p>
                    </div>
                </div>

                {observations ? (
                    <DataItem icon={MessageSquareText} label='Observations'>
                        {observations}
                    </DataItem>
                ) : null}

                <DataItem icon={CircleCheckBig} label='Breakfast included?'>
                    {hasBreakfast ? 'Yes' : 'No'}
                </DataItem>

                <div
                    className={cn(
                        'mt-2 flex flex-wrap items-center justify-between gap-x-5 rounded-sm p-5',
                        isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    )}
                >
                    <DataItem
                        icon={CircleDollarSign}
                        iconColor={isPaid ? 'stroke-green-700' : 'stroke-yellow-700'}
                        label={`Total price`}
                    >
                        {formatCurrency(totalPrice)}
                        {hasBreakfast
                            ? ` (${formatCurrency(cabinPrice * numNights)} cabin + ${formatCurrency(
                                  extrasPrice
                              )} ${isPaid ? 'breakfast at time of payment)' : 'breakfast)'}`
                            : null}
                    </DataItem>

                    <p className='text-lg font-semibold uppercase'>
                        {isPaid ? 'Paid' : 'Will pay at property'}
                    </p>
                </div>
                <footer className='py-2 text-right text-xs font-normal text-gray-500'>
                    <p>Booked {format(new Date(created_at), 'EEE, MMM dd yyyy, p')}</p>
                </footer>
            </section>
        </section>
    );
};
export default BookingDetail;
