import type { ReactNode } from '@tanstack/react-router';

const PageHeader = (props: {
    readonly children?: ReactNode;
    readonly button?: ReactNode;
    readonly title: ReactNode;
}) => {
    return (
        <div className='mb-5 flex items-center justify-between pt-4'>
            <div className='flex items-center justify-center gap-x-10'>
                <h1 className='line-he flex items-center text-2xl font-semibold text-slate-700'>
                    {props.title}
                </h1>
                {props.button}
            </div>
            {props.children}
        </div>
    );
};
export default PageHeader;
