import type { getBookingsAfterDate } from '@/services/apiBookings';
import { eachDayOfInterval, format, isSameDay, subDays } from 'date-fns';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const colors = {
    totalSales: { stroke: '#4f46e5', fill: '#c7d2fe' },
    extrasSales: { stroke: '#16a34a', fill: '#dcfce7' },
    text: '#374151',
    background: '#fff',
};

const DashboardSalesChart = (props: {
    readonly bookings: Awaited<ReturnType<typeof getBookingsAfterDate>>;
    readonly lastSearchParam: number;
}) => {
    const allDates = eachDayOfInterval({
        start: subDays(new Date(), props.lastSearchParam - 1),
        end: new Date(),
    });

    const data = allDates.map((date) => {
        return {
            label: format(date, 'MMM dd'),
            totalSales: props.bookings
                .filter((booking) => isSameDay(date, new Date(booking.created_at)))
                .reduce((acc, cur) => acc + cur.totalPrice, 0),
            extrasSales: props.bookings
                .filter((booking) => isSameDay(date, new Date(booking.created_at)))
                .reduce((acc, cur) => acc + cur.extrasPrice, 0),
        };
    });

    const startDate = allDates.at(0) ?? new Date();
    const endDate = allDates.at(-1) ?? new Date();

    return (
        <div className='col-span-full flex flex-col gap-10 rounded-md border-2 border-gray-100 bg-white p-5'>
            <h2 className='font-semibold'>
                Sales for{' '}
                <span className='text-indigo-500 italic'>{format(startDate, 'MMM dd, yyyy')}</span>{' '}
                &mdash;{' '}
                <span className='text-indigo-500 italic'>{format(endDate, 'MMM dd, yyyy')}</span>
            </h2>
            <ResponsiveContainer height={300} width='100%'>
                <AreaChart data={data}>
                    <XAxis
                        dataKey='label'
                        tick={{ fill: colors.text }}
                        tickLine={{ stroke: colors.text }}
                    />
                    <YAxis
                        tick={{ fill: colors.text }}
                        tickLine={{ stroke: colors.text }}
                        unit='$'
                        width={85}
                    />
                    <CartesianGrid strokeDasharray='8' />
                    <Tooltip contentStyle={{ backgroundColor: colors.background }} />
                    <Area
                        dataKey='totalSales'
                        fill={colors.totalSales.fill}
                        name='Total sales'
                        stroke={colors.totalSales.stroke}
                        strokeWidth={2}
                        type='monotone'
                        unit='$'
                    />
                    <Area
                        dataKey='extrasSales'
                        fill={colors.extrasSales.fill}
                        name='Extras sales'
                        stroke={colors.extrasSales.stroke}
                        strokeWidth={2}
                        type='monotone'
                        unit='$'
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
export default DashboardSalesChart;
