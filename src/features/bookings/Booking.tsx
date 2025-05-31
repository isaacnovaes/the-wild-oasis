import Back from '@/components/Back';
import BookingStatus from '@/components/BookingStatus';
import Loading from '@/components/Loading';
import PageHeader from '@/components/PageHeader';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useCheckOut, useDeleteBookingMutation, useFullBooking } from '@/utils/hooks';
import { ErrorComponent, getRouteApi, Link, useRouter } from '@tanstack/react-router';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useState } from 'react';
import BookingDetail from './BookingDetail';
import BookingForm from './BookingForm';

const routeApi = getRouteApi('/_app/booking/$bookingId');

const Booking = () => {
    const { bookingId } = routeApi.useParams();
    const navigate = routeApi.useNavigate();
    const router = useRouter();
    const bookingQuery = useFullBooking(bookingId);
    const checkoutMutation = useCheckOut();
    const deleteBookingMutation = useDeleteBookingMutation();
    const [openEditBooking, setOpenEditBooking] = useState(false);

    if (bookingQuery.isPending) {
        return <Loading />;
    }

    if (bookingQuery.isError) {
        return <ErrorComponent error={bookingQuery.error} />;
    }

    const { status, cabinId, isPaid } = bookingQuery.data;

    const disabled = checkoutMutation.isPending || deleteBookingMutation.isPending;

    return (
        <Dialog open={openEditBooking} onOpenChange={setOpenEditBooking}>
            <PageHeader
                title={
                    <>
                        {`Booking #${bookingId}`}
                        <BookingStatus className='ml-2' status={status} />
                    </>
                }
            >
                <Back isDisabled={disabled} />
            </PageHeader>
            <BookingDetail booking={bookingQuery.data} />
            <div className='mt-4 flex flex-wrap items-center justify-end gap-3'>
                {status === 'unconfirmed' && (
                    <>
                        <Button disabled={disabled}>
                            <ArrowDown />
                            <Link params={{ bookingId }} to='/check-in/$bookingId'>
                                Check in
                            </Link>
                        </Button>
                        {!isPaid && (
                            <Button asChild variant='secondary'>
                                <DialogTrigger
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    Edit
                                </DialogTrigger>
                            </Button>
                        )}
                    </>
                )}
                {status === 'checked-in' && (
                    <Button
                        disabled={disabled}
                        onClick={() => {
                            void navigate({ to: '/bookings', search: { page: 1 } });
                            checkoutMutation.mutate(bookingId);
                        }}
                    >
                        <ArrowUp /> Check out
                    </Button>
                )}

                <AlertDialog>
                    <AlertDialogTrigger
                        asChild
                        className='flex items-center justify-center gap-x-2'
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <Button variant='destructive'>Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className='text-slate-700'>
                                Are you sure you want to delete this booking?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this
                                booking.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                variant='destructive'
                                onClick={() => {
                                    deleteBookingMutation.mutate(
                                        {
                                            id: bookingId,
                                            cabinId: cabinId.toString(),
                                        },
                                        {
                                            onSuccess: () =>
                                                void navigate({
                                                    to: '/bookings',
                                                    search: { page: 1 },
                                                }),
                                        }
                                    );
                                }}
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <Button
                    disabled={disabled}
                    size={'lg'}
                    variant={'outline'}
                    onClick={() => {
                        router.history.back();
                    }}
                >
                    Back
                </Button>
            </div>
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>Edit booking #{bookingQuery.data.id}</DialogTitle>
                </DialogHeader>
                <BookingForm
                    booking={bookingQuery.data}
                    mode='edit'
                    onSuccess={() => {
                        setOpenEditBooking(false);
                    }}
                />
            </DialogContent>
        </Dialog>
    );
};

export default Booking;
