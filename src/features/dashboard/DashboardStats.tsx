import Loading from '@/components/Loading';
import Stat from '@/components/Stat';
import type { getBookingsAfterDate } from '@/services/apiBookings';
import { getAllCabins } from '@/services/apiCabins';
import { formatCurrency } from '@/utils/helpers';
import { useQuery } from '@tanstack/react-query';
import { ErrorComponent } from '@tanstack/react-router';
import { BadgeDollarSign, Briefcase, CalendarDays, ChartColumnDecreasing } from 'lucide-react';

const DashboardStats = (props: {
    readonly bookings: Awaited<ReturnType<typeof getBookingsAfterDate>>;
    readonly confirmedBookings: Awaited<ReturnType<typeof getBookingsAfterDate>>;
    readonly lastSearchParam: number;
}) => {
    const cabinsQuery = useQuery({
        queryKey: ['cabins', 'all'],
        queryFn: async () => {
            return getAllCabins();
        },
    });

    if (cabinsQuery.isError) {
        return <ErrorComponent error={cabinsQuery.error} />;
    }

    if (cabinsQuery.isPending) {
        return <Loading />;
    }

    const sales = formatCurrency(props.bookings.reduce((acc, cur) => acc + cur.totalPrice, 0));

    const occupation =
        props.confirmedBookings.reduce((acc, cur) => acc + cur.numNights, 0) /
        (props.lastSearchParam * cabinsQuery.data.cabins.length);

    return (
        <>
            <Stat
                color='blue'
                icon={Briefcase}
                title='Bookings'
                value={props.bookings.length.toString()}
            />
            <Stat color='green' icon={BadgeDollarSign} title='Sales' value={sales} />
            <Stat
                color='indigo'
                icon={CalendarDays}
                title='Check ins'
                value={props.confirmedBookings.length.toString()}
            />
            <Stat
                color='yellow'
                icon={ChartColumnDecreasing}
                title='Occupation'
                value={`${Math.round(occupation * 100).toString()}%`}
            />
        </>
    );
};
export default DashboardStats;
