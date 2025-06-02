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
import { ScrollArea } from '@/components/ui/scroll-area';
import { ErrorComponent, getRouteApi } from '@tanstack/react-router';
import { EllipsisVertical } from 'lucide-react';
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
                            <ScrollArea
                                className='h-[calc(100dvh-10rem)] max-h-[655px] overflow-hidden'
                                type='auto'
                            >
                                <DialogHeader className='mb-3'>
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
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>
                }
                title='All bookings'
            >
                <BookingTableOperations />
            </PageHeader>
            <Table columns='grid-cols-[2rem_3.9rem_8rem_11rem_10rem_7rem_3rem] @4xl/table:grid-cols-[3rem_6rem_1fr_1fr_10rem_10rem_3rem] gap-x-5 pl-2 py-3 items-center'>
                {isPending ? (
                    <Loading />
                ) : (
                    <>
                        <Table.Body
                            data={data.bookings}
                            header={
                                <>
                                    <div>Id</div>
                                    <div>Cabin id</div>
                                    <div>Guest</div>
                                    <div>Dates</div>
                                    <div>Status</div>
                                    <div>Amount</div>
                                    <EllipsisVertical className='invisible size-4 stroke-gray-600' />
                                </>
                            }
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
