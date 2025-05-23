import Loading from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogClose } from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popoverDialog';
import { cn } from '@/lib/utils';
import { createBooking } from '@/services/apiBookings';
import { getAllCabins, getBookedOffCabinDates } from '@/services/apiCabins';
import { getGuests } from '@/services/apiGuests';
import {
    BookingFormSchema,
    type BookingForm as BookingFormT,
    type BookingRow,
} from '@/types/bookings';
import { getCreateBooking } from '@/utils/helpers';
import { useSettings } from '@/utils/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ErrorComponent } from '@tanstack/react-router';
import { add, areIntervalsOverlapping, format, interval } from 'date-fns';
import { CalendarIcon, Loader } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import CabinCombo from './CabinCombo';
import GuestCombo from './GuestCombo';

type Props =
    | {
          mode: 'create';
          readonly onSuccess: () => void;
      }
    | { mode: 'edit'; readonly onSuccess: () => void; readonly booking: BookingRow };

const BookingForm = (props: Props) => {
    const form = useForm({
        resolver: zodResolver(BookingFormSchema),
        defaultValues: {
            guestId: 0,
            cabinId: 0,
            bookingDates: { from: new Date(), to: add(new Date(), { days: 3 }) },
            numGuests: 1,
            numNights: 1,
            hasBreakfast: false,
            isPaid: false,
            observations: '',
        },
    });

    const queryClient = useQueryClient();

    const guestId = form.getValues('guestId');
    const cabinId = form.getValues('cabinId');

    const [_, setNewComboSelected] = useState(false);

    const guestsQuery = useQuery({
        queryKey: ['guests', 'form'],
        queryFn: async () => {
            return getGuests();
        },
    });

    const cabinsQuery = useQuery({
        queryKey: ['cabins', 'form'],
        queryFn: async () => {
            return getAllCabins();
        },
    });

    const bookedOffCabinDatesQuery = useQuery({
        queryKey: ['cabins', 'booked-off', cabinId],
        queryFn: async () => {
            return getBookedOffCabinDates(cabinId.toString());
        },
        enabled: cabinId !== 0,
    });

    const settingsQuery = useSettings();

    const createBookingMutation = useMutation({
        mutationKey: ['bookings', 'create'],
        mutationFn: createBooking,
        onSuccess: (b) => {
            toast.success(`Booking with id ${b.id.toString()} successfully created`);
            void queryClient.invalidateQueries({ queryKey: ['bookings'] });
            props.onSuccess();
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const bookedOffCabinDates =
        useMemo(
            () =>
                bookedOffCabinDatesQuery.data?.map((r) => ({
                    from: new Date(r.startDate),
                    to: new Date(r.endDate),
                })),
            [bookedOffCabinDatesQuery.data]
        ) ?? [];

    if (guestsQuery.isPending || cabinsQuery.isPending || settingsQuery.isPending) {
        return <Loading />;
    }

    if (
        guestsQuery.isError ||
        cabinsQuery.isError ||
        bookedOffCabinDatesQuery.error ||
        settingsQuery.error
    ) {
        return (
            <ErrorComponent
                error={
                    guestsQuery.error ||
                    cabinsQuery.error ||
                    bookedOffCabinDatesQuery.error?.message ||
                    settingsQuery.error?.message
                }
            />
        );
    }

    const onSubmit = (formData: BookingFormT) => {
        const { bookingDates } = formData;

        for (let index = 0; index < bookedOffCabinDates.length; index++) {
            const bookedOffDates = bookedOffCabinDates[index];
            if (!bookedOffDates) {
                break;
            }
            const overlappingIntervals = areIntervalsOverlapping(
                interval(bookedOffDates.from, bookedOffDates.to),
                interval(bookingDates.from, bookingDates.to),
                { inclusive: true }
            );
            if (overlappingIntervals) {
                form.setError(
                    'bookingDates',
                    {
                        message: `Cabin is already booked within ${format(bookedOffDates.from, 'PPP')} - ${format(bookedOffDates.to, 'PPP')}`,
                        type: 'validate',
                    },
                    { shouldFocus: true }
                );
                return;
            }
        }

        const cabin = cabinsQuery.data.cabins.find((c) => c.id === formData.cabinId);
        if (props.mode === 'create' && cabin) {
            const booking = getCreateBooking({
                formData,
                cabin,
                breakfastPrice: settingsQuery.data.breakfastPrice,
            });
            createBookingMutation.mutate(booking);
        }
    };

    const disabled = createBookingMutation.isPending || !form.formState.isDirty;

    return (
        <Form {...form}>
            <form className='space-y-3' onSubmit={form.handleSubmit(onSubmit)}>
                <GuestCombo
                    error={form.formState.errors.guestId?.message}
                    guestId={guestId}
                    guests={guestsQuery.data.guests}
                    id='guestId'
                    isDirty={form.formState.isDirty}
                    onSelect={(newGuestId) => {
                        form.setValue('guestId', newGuestId, { shouldDirty: true });
                        setNewComboSelected((c) => !c);
                    }}
                />

                <CabinCombo
                    cabinId={cabinId}
                    cabins={cabinsQuery.data.cabins}
                    error={form.formState.errors.cabinId?.message}
                    isDirty={form.formState.isDirty}
                    onSelect={(newCabinId) => {
                        form.setValue('cabinId', newCabinId, { shouldDirty: true });
                        setNewComboSelected((c) => !c);
                    }}
                />

                <FormField
                    control={form.control}
                    name='bookingDates'
                    render={({ field }) => (
                        <FormItem className='flex flex-col'>
                            <FormLabel>Start date and end date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            className={cn('w-full pl-3 text-left font-normal')}
                                            variant={'outline'}
                                        >
                                            <span>
                                                {format(field.value.from, 'PPP')}
                                                {' - '}
                                                {format(field.value.to, 'PPP')}
                                            </span>

                                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent align='start' className='w-auto p-0'>
                                    <Calendar
                                        disabled={bookedOffCabinDates}
                                        mode='range'
                                        selected={field.value}
                                        onSelect={field.onChange}
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='numGuests'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Number of guests</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='0'
                                    {...field}
                                    inputMode='decimal'
                                    type='number'
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='numNights'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Number of nights</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='0'
                                    {...field}
                                    inputMode='decimal'
                                    type='number'
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='observations'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Observations</FormLabel>
                            <FormControl>
                                <Input placeholder='Gluten free breakfast...' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='hasBreakfast'
                    render={({ field }) => (
                        <FormItem className='flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4'>
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className='hover:cursor-pointer'>Add breakfast</FormLabel>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='isPaid'
                    render={({ field }) => (
                        <FormItem className='flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4'>
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className='hover:cursor-pointer'>Booking paid</FormLabel>
                        </FormItem>
                    )}
                />

                <div className='mt-5 flex items-center justify-between'>
                    <DialogClose asChild>
                        <Button variant='outline'>Cancel</Button>
                    </DialogClose>
                    <Button disabled={disabled} type='submit' variant='default'>
                        {createBookingMutation.isPending ? (
                            <Loader className='size-4 animate-spin stroke-indigo-500 hover:cursor-pointer' />
                        ) : null}
                        Save
                    </Button>
                </div>
            </form>
        </Form>
    );
};
export default BookingForm;
