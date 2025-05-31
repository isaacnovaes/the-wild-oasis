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
import { createBooking, updateBooking } from '@/services/apiBookings';
import { getAllCabins, getBookedOffCabinDates } from '@/services/apiCabins';
import { getGuests } from '@/services/apiGuests';
import {
    BookingFormSchema,
    type Booking,
    type BookingForm as BookingFormT,
    type BookingRow,
} from '@/types/bookings';
import { prepareBooking } from '@/utils/helpers';
import { useSettings } from '@/utils/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ErrorComponent } from '@tanstack/react-router';
import { add, areIntervalsOverlapping, differenceInCalendarDays, format, interval } from 'date-fns';
import { CalendarIcon, Loader } from 'lucide-react';
import { useState } from 'react';
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
        defaultValues:
            props.mode === 'create'
                ? {
                      guestId: 0,
                      cabinId: 0,
                      bookingDates: { from: new Date(), to: add(new Date(), { days: 3 }) },
                      numGuests: 1,
                      hasBreakfast: false,
                      isPaid: false,
                      observations: '',
                  }
                : {
                      guestId: props.booking.guestId,
                      cabinId: props.booking.cabinId,
                      bookingDates: {
                          from: new Date(props.booking.startDate),
                          to: new Date(props.booking.endDate),
                      },
                      numGuests: props.booking.numGuests,
                      hasBreakfast: props.booking.hasBreakfast,
                      isPaid: props.booking.isPaid,
                      observations: props.booking.observations,
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
        queryKey: ['cabins', 'all'],
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
        onMutate: () => toast.loading(`Creating booking`),
        onSuccess: (b, _vars, toasterId) => {
            toast.success(`Booking with id ${b.id.toString()} successfully created`, {
                id: toasterId,
            });
            void queryClient.invalidateQueries({ queryKey: ['bookings'] });
            props.onSuccess();
        },
        onError: (error, _vars, toasterId) => {
            toast.error(error.message, { id: toasterId });
        },
    });

    const editBookingMutation = useMutation({
        mutationKey: ['bookings', 'edit'],
        mutationFn: async ({ id, obj }: { id: string; obj: Partial<Booking> }) => {
            return updateBooking(id, obj);
        },
        onMutate: ({ id }) => toast.loading(`Editing booking #${id}`),
        onSuccess: (b, _vars, toasterId) => {
            toast.success(`Booking  ${b.id.toString()} successfully edited`, { id: toasterId });
            void queryClient.invalidateQueries({ queryKey: ['bookings'] });
            props.onSuccess();
        },
        onError: (error, _vars, toasterId) => {
            toast.error(error.message, { id: toasterId });
        },
    });

    const bookedOffCabinDates =
        bookedOffCabinDatesQuery.data
            ?.filter((r) => {
                if (props.mode === 'edit' && r.id === props.booking.id) {
                    return false;
                }
                return true;
            })
            .map((r) => ({
                from: new Date(r.startDate),
                to: new Date(r.endDate),
            })) ?? [];

    const disabledDates = [...bookedOffCabinDates, { before: new Date() }];
    const disabledDatesFrom = [...disabledDates, { after: form.getValues('bookingDates.to') }];
    const disabledDatesTo = [...disabledDates, { before: form.getValues('bookingDates.from') }];

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

        let isError = false;

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
                    'bookingDates.from',
                    {
                        message: `Cabin is already booked within ${format(bookedOffDates.from, 'PPP')} - ${format(bookedOffDates.to, 'PPP')}`,
                        type: 'validate',
                    },
                    { shouldFocus: true }
                );
                isError = true;
                break;
            }
        }

        const { maxBookingLength, minBookingLength, maxGestsPerBooking } = settingsQuery.data;

        if (formData.numGuests > maxGestsPerBooking) {
            form.setError('numGuests', {
                message: `Max number of guests setting is ${maxGestsPerBooking.toString()}`,
                type: 'validate',
            });
            isError = true;
        }

        const numNights = differenceInCalendarDays(
            formData.bookingDates.to,
            formData.bookingDates.from
        );

        if (numNights > maxBookingLength) {
            form.setError('bookingDates.to', {
                message: `Max number of nights setting is ${maxBookingLength.toString()}`,
                type: 'validate',
            });
            isError = true;
        }

        if (numNights < minBookingLength) {
            form.setError('bookingDates.to', {
                message: `Min number of nights setting is ${minBookingLength.toString()}`,
                type: 'validate',
            });
            isError = true;
        }

        if (isError) {
            return;
        }

        const cabin = cabinsQuery.data.cabins.find((c) => c.id === formData.cabinId);
        if (props.mode === 'create' && cabin) {
            const booking = prepareBooking({
                formData,
                cabin,
                breakfastPrice: settingsQuery.data.breakfastPrice,
                type: props.mode,
            });
            createBookingMutation.mutate(booking);
        }

        if (props.mode === 'edit' && cabin) {
            editBookingMutation.mutate({
                id: props.booking.id.toString(),
                obj: prepareBooking({
                    formData,
                    cabin,
                    breakfastPrice: settingsQuery.data.breakfastPrice,
                    type: props.mode,
                }),
            });
        }
    };

    const disabled =
        createBookingMutation.isPending || !form.formState.isDirty || editBookingMutation.isPending;

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
                    name='bookingDates.from'
                    render={({ field }) => (
                        <FormItem className='flex flex-col'>
                            <FormLabel>Start date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            className={cn('w-full pl-3 text-left font-normal')}
                                            variant={'outline'}
                                        >
                                            <span>{format(field.value, 'PPP')}</span>

                                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent align='start' className='w-auto p-0'>
                                    <Calendar
                                        disabled={disabledDatesFrom}
                                        mode='single'
                                        numberOfMonths={2}
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
                    name='bookingDates.to'
                    render={({ field }) => (
                        <FormItem className='flex flex-col'>
                            <FormLabel>End date </FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            className={cn('w-full pl-3 text-left font-normal')}
                                            variant={'outline'}
                                        >
                                            <span>{format(field.value, 'PPP')}</span>

                                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent align='start' className='w-auto p-0'>
                                    <Calendar
                                        disabled={disabledDatesTo}
                                        mode='single'
                                        numberOfMonths={2}
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
                    name='observations'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Observations</FormLabel>
                            <FormControl>
                                <Input placeholder='Gluten-free breakfast...' {...field} />
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
