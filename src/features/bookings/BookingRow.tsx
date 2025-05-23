import { format, isToday } from 'date-fns';
import Currency from '../../components/Currency';
import Table from '../../components/Table';
import Tag from '../../components/Tag';
import type { BookingRow as BookingRowT } from '../../types/bookings';
import { formatDistanceFromNow } from '../../utils/helpers';
import BookingRowOperations from './BookingRowOperations';

const BookingRow = ({ bookingRow }: { readonly bookingRow: BookingRowT }) => {
    return (
        <Table.Row>
            <span className='text-sm font-semibold text-blue-950'>{bookingRow.id}</span>
            <span className='text-sm font-semibold text-blue-950'>{bookingRow.cabins.id}</span>

            <div className='flex flex-col items-start'>
                <span className='text-base text-gray-800'>{bookingRow.guests.fullName}</span>
                <span className='text-xs text-gray-500'>{bookingRow.guests.email}</span>
            </div>

            <div className='flex flex-col items-start'>
                <span className='text-base text-gray-800'>
                    {isToday(new Date(bookingRow.startDate))
                        ? 'Today'
                        : formatDistanceFromNow(bookingRow.startDate)}{' '}
                    &rarr; {bookingRow.numNights} night stay
                </span>
                <span className='text-xs text-gray-500'>
                    {format(new Date(bookingRow.startDate), 'MMM dd yyyy')} &mdash;{' '}
                    {format(new Date(bookingRow.endDate), 'MMM dd yyyy')}
                </span>
            </div>

            <Tag status={bookingRow.status} />
            <Currency amount={bookingRow.totalPrice} />
            <BookingRowOperations bookingRow={bookingRow} />
        </Table.Row>
    );
};
export default BookingRow;
