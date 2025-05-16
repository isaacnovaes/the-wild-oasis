import type { Booking } from '../types/global';
import { getBookingStatusStyle } from '../utils/helpers';

const Tag = (props: { readonly status: Booking['status'] }) => {
    const tagStyle = getBookingStatusStyle(props.status);
    return (
        <span
            className={`w-fit rounded-4xl px-3 py-1.5 text-xs font-semibold uppercase ${tagStyle.color} ${tagStyle.background}`}
        >
            {props.status.replace('-', ' ')}
        </span>
    );
};
export default Tag;
