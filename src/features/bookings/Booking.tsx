import Back from '@/components/Back';
import Loading from '@/components/Loading';
import PageHeader from '@/components/PageHeader';
import Tag from '@/components/Tag';
import { Button } from '@/components/ui/button';
import { useBooking, useCheckOut } from '@/utils/hooks';
import { ErrorComponent, getRouteApi, Link, useRouter } from '@tanstack/react-router';
import { ArrowDown, ArrowUp } from 'lucide-react';
import BookingDetail from './BookingDetail';

const routeApi = getRouteApi('/_app/booking/$bookingId');

const Booking = () => {
    const { bookingId } = routeApi.useParams();
    const navigate = routeApi.useNavigate();
    const router = useRouter();
    const bookingQuery = useBooking(bookingId);

    const checkoutMutation = useCheckOut();

    if (bookingQuery.isPending) {
        return <Loading />;
    }

    if (bookingQuery.isError) {
        return <ErrorComponent error={bookingQuery.error} />;
    }

    const { status } = bookingQuery.data;

    const disabled = checkoutMutation.isPending;

    return (
        <div className=''>
            <PageHeader
                title={
                    <>
                        {`Booking #${bookingId}`}
                        <Tag className='ml-2' status={status} />
                    </>
                }
            >
                <Back isDisabled={disabled} />
            </PageHeader>
            <BookingDetail booking={bookingQuery.data} />
            <div className='mt-4 flex items-center justify-end space-x-3'>
                {status === 'unconfirmed' && (
                    <Button disabled={disabled}>
                        <ArrowDown />
                        <Link params={{ bookingId }} to='/check-in/$bookingId'>
                            Check in
                        </Link>
                    </Button>
                )}
                {status === 'checked-in' && (
                    <Button
                        disabled={disabled}
                        onClick={() => {
                            checkoutMutation.mutate(bookingId, {
                                onSuccess: () => {
                                    void navigate({ to: '/bookings', search: { page: 1 } });
                                },
                            });
                        }}
                    >
                        <ArrowUp /> Check out
                    </Button>
                )}
                <Button disabled={disabled} size={'lg'} variant={'destructive'}>
                    Delete
                </Button>
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
        </div>
    );
};

export default Booking;
