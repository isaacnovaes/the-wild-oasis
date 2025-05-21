import type { ReactNode } from '@tanstack/react-router';

const PageHeader = (props: { readonly children: ReactNode; readonly title: ReactNode }) => {
    return (
        <div className='mb-5 flex items-center justify-between'>
            <h1 className='flex items-center text-2xl font-semibold text-slate-700'>
                {props.title}
            </h1>
            {props.children}
        </div>
    );
};
export default PageHeader;
