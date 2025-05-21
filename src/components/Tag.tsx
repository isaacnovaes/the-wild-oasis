import { cn } from '@/lib/utils';
import type { Booking } from '../types/global';
import { getBookingStatusStyle } from '../utils/helpers';

const Tag = (props: { readonly status: Booking['status']; readonly className?: string }) => {
    const tagStyle = getBookingStatusStyle(props.status);
    return (
        <span
            className={cn(
                `w-fit rounded-4xl px-3 py-1.5 text-xs font-semibold uppercase ${tagStyle.color} ${tagStyle.background}`,
                props.className
            )}
        >
            {props.status.replace('-', ' ')}
        </span>
    );
};
export default Tag;
