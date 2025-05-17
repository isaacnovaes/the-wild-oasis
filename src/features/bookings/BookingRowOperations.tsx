import { Copy, Pencil, Trash2 } from 'lucide-react';
import RowOperations from '../../components/RowOperations';
import type { BookingRow as BookingRowT } from '../../types/global';

const BookingRowOperations = (props: { readonly bookingRow: BookingRowT }) => {
    return (
        <RowOperations>
            <button type='button'>
                <Copy className='size-4 stroke-slate-700' /> Duplicate
            </button>
            <button type='button'>
                <Pencil className='size-4 stroke-slate-700' /> Edit
            </button>
            <button type='button'>
                <Trash2 className='size-4 stroke-slate-700' /> Delete
            </button>
        </RowOperations>
    );
};
export default BookingRowOperations;
