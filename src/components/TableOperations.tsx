import type { ReactNode } from '@tanstack/react-router';

const TableOperations = (props: { readonly children: ReactNode }) => {
    return (
        <div className='flex flex-col items-start gap-x-7 gap-y-4 @5xl/route:flex-row'>
            {props.children}
        </div>
    );
};

export default TableOperations;
