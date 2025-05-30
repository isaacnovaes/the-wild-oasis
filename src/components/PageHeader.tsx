import type { ReactNode } from '@tanstack/react-router';

const PageHeader = (props: {
    readonly children?: ReactNode;
    readonly button?: ReactNode;
    readonly title: ReactNode;
}) => {
    return (
        <div className='mb-5 flex flex-col items-start justify-between gap-y-3 pt-4 @xl/route:flex-row'>
            <div className='flex flex-col items-start gap-x-10 gap-y-2 @xl/route:justify-between @xl/route:self-stretch @2xl/route:flex-row'>
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
