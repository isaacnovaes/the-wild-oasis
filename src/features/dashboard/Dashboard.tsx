import Loading from '@/components/Loading';
import PageHeader from '@/components/PageHeader';
import { getBookingsAfterDate } from '@/services/apiBookings';
import { useQuery } from '@tanstack/react-query';
import { ErrorComponent, getRouteApi } from '@tanstack/react-router';
import { startOfDay, subDays } from 'date-fns';
import DashBoardOperations from './DashBoardOperations';
import DashboardSalesChart from './DashboardSalesChart';
import DashboardStats from './DashboardStats';
import DashboardSummary from './DashboardSummary';

const dashboardRouterApi = getRouteApi('/_app/dashboard');

const Dashboard = () => {
    const { last: lastSearchParam } = dashboardRouterApi.useSearch();

    const bookingsAfterLastSearchParamQuery = useQuery({
        queryFn: async () => {
            return getBookingsAfterDate(
                startOfDay(subDays(new Date(), lastSearchParam)).toISOString()
            );
        },
        queryKey: ['bookings', `last-${lastSearchParam.toString()}`, lastSearchParam],
    });

    if (bookingsAfterLastSearchParamQuery.isError) {
        return <ErrorComponent error={bookingsAfterLastSearchParamQuery.error} />;
    }

    if (bookingsAfterLastSearchParamQuery.isPending) {
        return <Loading />;
    }

    const { data: bookings } = bookingsAfterLastSearchParamQuery;

    const confirmedBookings = bookings.filter(
        (stay) => stay.status === 'checked-in' || stay.status === 'checked-out'
    );

    return (
        <div>
            <PageHeader title='Dashboard'>
                <DashBoardOperations />
            </PageHeader>
            <section className='grid grid-cols-1 grid-rows-[7rem_7rem_7rem_7rem_20rem_20rem_25rem] gap-y-5 @lg/route:grid-cols-2 @lg/route:grid-rows-[7rem_7rem_20rem_20rem_24rem] @lg/route:gap-x-5 @5xl/route:grid @5xl/route:grid-cols-[1fr_1fr_1fr_1fr] @5xl/route:grid-rows-[auto_21rem_auto] @5xl/route:gap-5'>
                <DashboardStats
                    bookings={bookings}
                    confirmedBookings={confirmedBookings}
                    lastSearchParam={lastSearchParam}
                />
                <DashboardSummary confirmedBookings={confirmedBookings} />
                <DashboardSalesChart bookings={bookings} lastSearchParam={lastSearchParam} />
            </section>
        </div>
    );
};

export default Dashboard;
