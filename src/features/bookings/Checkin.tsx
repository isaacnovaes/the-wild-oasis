import Back from '@/components/Back';
import Loading from '@/components/Loading';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { formatCurrency } from '@/utils/helpers';
import { useCheckIn, useFullBooking, useSettings } from '@/utils/hooks';
import { ErrorComponent, getRouteApi, useRouter } from '@tanstack/react-router';
import { ArrowDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import BookingDetail from './BookingDetail';

const routeApi = getRouteApi('/_app/check-in/$bookingId');

const Checkin = () => {
    const [addBreakfast, setAddBreakfast] = useState(false);
    const [confirmPaid, setConfirmPaid] = useState(false);
    const { bookingId } = routeApi.useParams();
    const navigate = routeApi.useNavigate();
    const bookingQuery = useFullBooking(bookingId);
    const checkInMutation = useCheckIn();
    const settingsQuery = useSettings();
    const router = useRouter();

    useEffect(() => {
        if (bookingQuery.data?.hasBreakfast) {
            setAddBreakfast(true);
        }
    }, [bookingQuery.isPending, bookingQuery.data?.hasBreakfast]);

    if (bookingQuery.isPending || settingsQuery.isPending) {
        return <Loading />;
    }

    if (bookingQuery.isError || settingsQuery.isError) {
        return <ErrorComponent error={bookingQuery.error ?? settingsQuery.error} />;
    }

    const {
        numNights,
        numGuests,
        guests: { fullName },
        cabinPrice,
        isPaid,
        hasBreakfast,
        extrasPrice,
    } = bookingQuery.data;

    const totalPrice = cabinPrice * numNights;
    const optionalBreakfastPrice = hasBreakfast
        ? extrasPrice
        : settingsQuery.data.breakfastPrice * numNights * numGuests;
    const totalWithBreakfastPrice = totalPrice + optionalBreakfastPrice;

    const disabled = checkInMutation.isPending;

    function handleCheckin() {
        if (!confirmPaid) return;

        checkInMutation.mutate(
            {
                bookingId,
                breakfastInfo: addBreakfast
                    ? {
                          hasBreakfast: true,
                          extrasPrice: optionalBreakfastPrice,
                          totalPrice: totalPrice + optionalBreakfastPrice,
                      }
                    : {
                          hasBreakfast: isPaid ? hasBreakfast : false,
                          extrasPrice: 0,
                          totalPrice: cabinPrice * numNights,
                      },
            },
            {
                onSuccess: () => {
                    void navigate({ to: '/bookings', search: { page: 1 } });
                },
            }
        );
    }

    return (
        <div>
            <PageHeader title={`Check in booking #${bookingId}`}>
                <Back />
            </PageHeader>
            <BookingDetail booking={bookingQuery.data} />

            <section className='mt-5 space-y-5'>
                {isPaid && hasBreakfast ? null : (
                    <div className='flex items-center gap-x-5 rounded-sm bg-white px-5 py-5'>
                        <Checkbox
                            checked={addBreakfast}
                            id='terms1'
                            onCheckedChange={() => {
                                setAddBreakfast((cur) => !cur);
                                setConfirmPaid(false);
                            }}
                        />
                        <div className='grid gap-1.5'>
                            <label
                                className='text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                                htmlFor='terms1'
                            >
                                Want to add breakfast for {formatCurrency(optionalBreakfastPrice)}
                            </label>
                        </div>
                    </div>
                )}
                <div className='flex items-center gap-x-5 rounded-sm bg-white px-5 py-5'>
                    <Checkbox
                        checked={confirmPaid}
                        disabled={isPaid ? false : confirmPaid}
                        id='terms1'
                        onCheckedChange={() => {
                            setConfirmPaid((cur) => !cur);
                        }}
                    />
                    <div className='grid gap-1.5'>
                        <label
                            className='text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                            htmlFor='terms1'
                        >
                            I confirm that {fullName} has paid the total amount of{' '}
                            {addBreakfast
                                ? `${formatCurrency(totalWithBreakfastPrice)} (${formatCurrency(totalPrice)} + ${formatCurrency(optionalBreakfastPrice)})`
                                : formatCurrency(totalPrice)}
                        </label>
                    </div>
                </div>
            </section>

            <div className='mt-4 flex items-center justify-end space-x-3'>
                <Button disabled={disabled || !confirmPaid} onClick={handleCheckin}>
                    <ArrowDown /> Check in
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
export default Checkin;
