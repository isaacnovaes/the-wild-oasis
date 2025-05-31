import type { ReactNode } from '@tanstack/react-router';
import type { LucideProps } from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

const DataItem = ({
    children,
    icon,
    label,
    iconColor,
}: {
    readonly children: ReactNode;
    readonly label: string;
    readonly icon: ForwardRefExoticComponent<
        Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
    >;
    readonly iconColor?: string;
}) => {
    const Comp = icon;
    return (
        <div className='flex flex-wrap items-center gap-x-5 gap-y-2 py-2'>
            <div className='flex items-center gap-x-5 gap-y-2 font-medium'>
                <Comp className={`size-5 ${iconColor ?? 'stroke-indigo-500'}`} />
                <span>{label}</span>
            </div>
            {children}
        </div>
    );
};
export default DataItem;
