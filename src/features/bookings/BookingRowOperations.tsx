import { Copy, EllipsisVertical, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { BookingRow as BookingRowT } from '../../types/global';

const BookingRowOperations = (props: { readonly bookingRow: BookingRowT }) => {
    const [showOperations, setShowOperations] = useState(false);
    return (
        <button
            className={`relative flex items-center justify-center rounded-sm p-3 hover:cursor-pointer hover:bg-indigo-50 ${showOperations ? 'outline-2 outline-indigo-500' : ''}`}
            type='button'
            onClick={() => {
                setShowOperations((cur) => !cur);
            }}
        >
            <EllipsisVertical className='size-4 stroke-gray-600' />
            {showOperations ? (
                <div className='absolute top-full -left-2 z-20 -translate-x-full rounded-sm bg-white shadow-sm *:flex *:w-full *:items-center *:gap-x-3 *:p-2 *:text-sm *:hover:cursor-pointer *:hover:bg-zinc-100'>
                    <button type='button'>
                        <Copy className='size-4 stroke-slate-700' /> Duplicate
                    </button>
                    <button type='button'>
                        <Pencil className='size-4 stroke-slate-700' /> Edit
                    </button>
                    <button type='button'>
                        <Trash2 className='size-4 stroke-slate-700' /> Delete
                    </button>
                </div>
            ) : null}
        </button>
    );
};
export default BookingRowOperations;
