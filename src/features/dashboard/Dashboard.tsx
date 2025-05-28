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
            <section className='grid grid-cols-[1fr_1fr_1fr_1fr] grid-rows-[auto_20rem_auto] gap-7'>
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
