import { ErrorComponent, getRouteApi } from '@tanstack/react-router';
import Loading from '../../components/Loading';
import Pagination from '../../components/Pagination';
import Table from '../../components/Table';
import { PAGE_SIZE } from '../../utils/constants';
import { useBookings } from '../../utils/hooks';
import BookingRow from './BookingRow';
import BookingTableOperations from './BookingTableOperations';

const bookingsRouter = getRouteApi('/_app/bookings');

const Bookings = () => {
    const { data, isError, isPending, error } = useBookings();
    const { page } = bookingsRouter.useSearch();

    if (isError) {
        return <ErrorComponent error={error} />;
    }

    const hasNext = PAGE_SIZE * page < (data?.count || 0);
    const hasPrevious = page > 1;

    return (
        <div>
            <div className='mb-5 flex items-center justify-between'>
                <h1 className='text-2xl font-semibold text-slate-700'>All bookings</h1>
                <BookingTableOperations />
            </div>
            <Table
                columns='grid-cols-[0.6fr_2fr_2.4fr_1.4fr_1fr_3.2rem]'
                header={
                    <Table.Header>
                        <div>Cabin</div>
                        <div>Guest</div>
                        <div>Dates</div>
                        <div>Status</div>
                        <div>Amount</div>
                        <div />
                    </Table.Header>
                }
            >
                {isPending ? (
                    <Loading />
                ) : (
                    <>
                        <Table.Body
                            data={data.bookings}
                            render={(booking) => (
                                <BookingRow key={booking.id} bookingRow={booking} />
                            )}
                        />
                        <Table.Footer>
                            {data.count > PAGE_SIZE && (
                                <Pagination
                                    count={data.count || 0}
                                    hasNext={hasNext}
                                    hasPrevious={hasPrevious}
                                    page={page}
                                    to='/bookings'
                                />
                            )}
                        </Table.Footer>
                    </>
                )}
            </Table>
        </div>
    );
};
export default Bookings;
