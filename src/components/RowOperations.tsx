import { EllipsisVertical } from 'lucide-react';
import { useState, type ReactNode } from 'react';

const RowOperations = (props: { readonly children: ReactNode }) => {
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
                    {props.children}
                </div>
            ) : null}
        </button>
    );
};
export default RowOperations;
