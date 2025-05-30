import { cn } from '@/lib/utils';
import type { LucideProps } from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

const colors = {
    blue: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        icon: 'stroke-blue-700',
    },
    green: { bg: 'bg-green-100', text: 'text-green-700', icon: 'stroke-green-700' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-700', icon: 'stroke-indigo-700' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: 'stroke-yellow-700' },
} as const;

const Stat = (props: {
    readonly color: keyof typeof colors;
    // eslint-disable-next-line react/no-unused-prop-types
    readonly icon: ForwardRefExoticComponent<
        Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
    >;
    readonly title: string;
    readonly value: string;
}) => {
    return (
        <div className='col-span-full grid grid-cols-[4rem_1fr] grid-rows-[auto_auto] gap-x-7 rounded-md border-2 border-gray-100 bg-white p-6 @lg/route:@max-5xl/route:odd:col-start-1 @lg/route:@max-5xl/route:odd:col-end-2 @lg/route:@max-5xl/route:even:col-start-2 @lg/route:@max-5xl/route:even:col-end-3 @5xl/route:col-span-1 @5xl/route:col-end-auto'>
            <div
                className={cn(
                    'row-start-1 row-end-3 flex aspect-square items-center justify-center rounded-[50%]',
                    colors[props.color].bg,
                    colors[props.color].text
                )}
            >
                <props.icon className={cn('size-9', colors[props.color].icon)} />
            </div>
            <h5 className='self-center text-base font-semibold tracking-wide text-gray-500 uppercase'>
                {props.title}
            </h5>
            <p className='col-start-2 text-xl leading-none font-medium'>{props.value}</p>
        </div>
    );
};
export default Stat;
