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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCheckOut, useDeleteBookingMutation } from '@/utils/hooks';
import { Link } from '@tanstack/react-router';
import { ArrowDown, ArrowUp, EllipsisVertical, Eye, Loader, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { BookingRow as BookingRowT } from '../../types/bookings';
import BookingForm from './BookingForm';

const BookingRowOperations = ({ bookingRow }: { readonly bookingRow: BookingRowT }) => {
    const [openEditBooking, setOpenEditBooking] = useState(false);

    const checkoutMutation = useCheckOut();
    const deleteBookingMutation = useDeleteBookingMutation();

    const isLoading = checkoutMutation.isPending || deleteBookingMutation.isPending;

    return (
        <Dialog open={openEditBooking} onOpenChange={setOpenEditBooking}>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    {isLoading ? (
                        <Loader className='size-4 animate-spin stroke-indigo-500 hover:cursor-pointer' />
                    ) : (
                        <EllipsisVertical className='size-4 stroke-gray-600 hover:cursor-pointer' />
                    )}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Booking row operations</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link
                            params={{ bookingId: bookingRow.id.toString() }}
                            to='/booking/$bookingId'
                        >
                            <Eye className='size-4 stroke-slate-700' /> Details
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <AlertDialog>
                            <AlertDialogTrigger
                                className='flex items-center justify-center gap-x-2'
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                            >
                                <Trash2 className='size-4 stroke-slate-700' /> Delete
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className='text-slate-700'>
                                        Are you sure you want to delete this booking?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete
                                        this booking.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        variant='destructive'
                                        onClick={() => {
                                            deleteBookingMutation.mutate({
                                                id: bookingRow.id.toString(),
                                                cabinId: bookingRow.cabinId.toString(),
                                            });
                                        }}
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuItem>
                    {bookingRow.status === 'unconfirmed' ? (
                        <>
                            {!bookingRow.isPaid && (
                                <DropdownMenuItem asChild>
                                    <DialogTrigger
                                        className='w-full'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    >
                                        <Pencil className='size-4 stroke-slate-700' /> Edit
                                    </DialogTrigger>
                                </DropdownMenuItem>
                            )}

                            <DropdownMenuItem>
                                <Link
                                    className='flex items-center justify-between gap-x-2'
                                    params={{ bookingId: bookingRow.id.toString() }}
                                    to='/check-in/$bookingId'
                                >
                                    <ArrowDown className='size-4 stroke-slate-700' /> Check in
                                </Link>
                            </DropdownMenuItem>
                        </>
                    ) : null}
                    {bookingRow.status === 'checked-in' ? (
                        <DropdownMenuItem
                            onClick={() => {
                                checkoutMutation.mutate(bookingRow.id.toString());
                            }}
                        >
                            <ArrowUp className='size-4 stroke-slate-700' /> Check out
                        </DropdownMenuItem>
                    ) : null}
                </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
                <ScrollArea
                    className='h-[calc(100dvh-10rem)] max-h-[655px] overflow-hidden'
                    type='auto'
                >
                    <DialogHeader className='mb-3'>
                        <DialogTitle>Edit booking #{bookingRow.id}</DialogTitle>
                        <DialogDescription>
                            Edit booking. Click save when you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>
                    <BookingForm
                        booking={bookingRow}
                        mode='edit'
                        onSuccess={() => {
                            setOpenEditBooking(false);
                        }}
                    />
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};
export default BookingRowOperations;
