import type { ReactNode } from '@tanstack/react-router';

const TableOperations = (props: { readonly children: ReactNode }) => {
    return <div className='flex items-center gap-7'>{props.children}</div>;
};

export default TableOperations;
