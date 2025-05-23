import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { ErrorComponent, getRouteApi } from '@tanstack/react-router';
import { useState } from 'react';
import Loading from '../../components/Loading';
import Pagination from '../../components/Pagination';
import Table from '../../components/Table';
import { PAGE_SIZE } from '../../utils/constants';
import { useBookings } from '../../utils/hooks';
import BookingForm from './BookingForm';
import BookingRow from './BookingRow';
import BookingTableOperations from './BookingTableOperations';

const bookingsRouter = getRouteApi('/_app/bookings');

const Bookings = () => {
    const { data, isError, isPending, error } = useBookings();
    const { page } = bookingsRouter.useSearch();
    const [openCreateCabin, setOpenCreateCabin] = useState(false);

    if (isError) {
        return <ErrorComponent error={error} />;
    }

    const hasNext = PAGE_SIZE * page < (data?.count || 0);
    const hasPrevious = page > 1;

    return (
        <div>
            <PageHeader
                button={
                    <Dialog open={openCreateCabin} onOpenChange={setOpenCreateCabin}>
                        <DialogTrigger asChild>
                            <Button variant={'outline'}>Create booking</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create booking</DialogTitle>
                                <DialogDescription>
                                    Create booking. Click save when you&apos;re done.
                                </DialogDescription>
                            </DialogHeader>

                            <BookingForm
                                mode='create'
                                onSuccess={() => {
                                    setOpenCreateCabin(false);
                                }}
                            />
                        </DialogContent>
                    </Dialog>
                }
                title='All bookings'
            >
                <BookingTableOperations />
            </PageHeader>
            <Table columns='grid-cols-[0.6fr_0.6fr_2fr_2.4fr_1.4fr_1fr_3.2rem]'>
                <Table.Header>
                    <div>Id</div>
                    <div>Cabin id</div>
                    <div>Guest</div>
                    <div>Dates</div>
                    <div>Status</div>
                    <div>Amount</div>
                    <div />
                </Table.Header>
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
