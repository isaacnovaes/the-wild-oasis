import BookingStatus from '@/components/BookingStatus';
import Loading from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { getStaysTodayActivity, type getBookingsAfterDate } from '@/services/apiBookings';
import { useCheckOut } from '@/utils/hooks';
import { useQuery } from '@tanstack/react-query';
import { ErrorComponent, Link } from '@tanstack/react-router';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const startData = [
    {
        duration: '1 night',
        value: 0,
        color: '#ef4444',
    },
    {
        duration: '2 nights',
        value: 0,
        color: '#f97316',
    },
    {
        duration: '3 nights',
        value: 0,
        color: '#eab308',
    },
    {
        duration: '4-5 nights',
        value: 0,
        color: '#84cc16',
    },
    {
        duration: '6-7 nights',
        value: 0,
        color: '#22c55e',
    },
    {
        duration: '8-14 nights',
        value: 0,
        color: '#14b8a6',
    },
    {
        duration: '15-21 nights',
        value: 0,
        color: '#3b82f6',
    },
    {
        duration: '21+ nights',
        value: 0,
        color: '#a855f7',
    },
];

function incArrayValue(arr: typeof startData, field: string) {
    return arr.map((obj) => (obj.duration === field ? { ...obj, value: obj.value + 1 } : obj));
}

function prepareData(stays: Awaited<ReturnType<typeof getBookingsAfterDate>>) {
    const data = stays
        .reduce((acc, b) => {
            const num = b.numNights;
            if (num === 1) return incArrayValue(acc, '1 night');
            if (num === 2) return incArrayValue(acc, '2 nights');
            if (num === 3) return incArrayValue(acc, '3 nights');
            if ([4, 5].includes(num)) return incArrayValue(acc, '4-5 nights');
            if ([6, 7].includes(num)) return incArrayValue(acc, '6-7 nights');
            if (num >= 8 && num <= 14) return incArrayValue(acc, '8-14 nights');
            if (num >= 15 && num <= 21) return incArrayValue(acc, '15-21 nights');
            if (num >= 21) return incArrayValue(acc, '21+ nights');
            return acc;
        }, startData)
        .filter((obj) => obj.value > 0);

    return data;
}

const DashboardSummary = (props: {
    readonly confirmedBookings: Awaited<ReturnType<typeof getBookingsAfterDate>>;
}) => {
    const checkoutMutation = useCheckOut();

    const todayBookingsQuery = useQuery({
        queryKey: ['bookings', 'today'],
        queryFn: async () => {
            return getStaysTodayActivity();
        },
    });

    if (todayBookingsQuery.isError) {
        return <ErrorComponent error={todayBookingsQuery.error} />;
    }

    if (todayBookingsQuery.isPending) {
        return <Loading />;
    }

    const durationChartData = prepareData(props.confirmedBookings);

    return (
        <>
            <div className='col-span-2 overflow-auto rounded-sm border-2 border-gray-100 bg-white p-5 @5xl/route:col-start-1 @5xl/route:col-end-3'>
                <h2 className='font-semibold'>Today</h2>
                <div>
                    {todayBookingsQuery.data.length ? (
                        todayBookingsQuery.data.map((b) => (
                            <div
                                key={b.id}
                                className='gray-100 grid grid-cols-[6rem_2rem_1fr_5rem_5rem] items-center gap-x-8 border-b-2 border-b-gray-100 px-3 py-1 text-xl'
                            >
                                {b.status === 'unconfirmed' && (
                                    <BookingStatus className='p-2' status={b.status} />
                                )}
                                {b.status === 'checked-in' && (
                                    <BookingStatus className='p-2' status={b.status} />
                                )}
                                <img
                                    alt='guest flag'
                                    height={30}
                                    src={b.guests.countryFlag}
                                    width={30}
                                />
                                <span className='truncate text-sm'>{b.guests.fullName}</span>
                                <span className='text-sm'>{b.numNights} nights</span>
                                {b.status === 'unconfirmed' && (
                                    <Button asChild variant='link'>
                                        <Link
                                            params={{ bookingId: b.id.toString() }}
                                            to='/check-in/$bookingId'
                                        >
                                            Check in
                                        </Link>
                                    </Button>
                                )}
                                {b.status === 'checked-in' && (
                                    <Button
                                        disabled={checkoutMutation.isPending}
                                        size={'sm'}
                                        variant='ghost'
                                        onClick={() => {
                                            checkoutMutation.mutate(b.id.toString());
                                        }}
                                    >
                                        Check out
                                    </Button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className='grid place-items-center'>No bookings starting today</p>
                    )}
                </div>
            </div>
            <div className='col-span-2 overflow-auto rounded-sm border-2 border-gray-100 bg-white p-5 @5xl/route:col-start-3 @5xl/route:col-end-5'>
                <h2 className='font-semibold'>Stay duration summary</h2>
                <ResponsiveContainer height={240} minWidth={500} width='100%'>
                    <PieChart>
                        <Pie
                            cx='40%'
                            cy='50%'
                            data={durationChartData}
                            dataKey='value'
                            innerRadius={85}
                            nameKey='duration'
                            outerRadius={110}
                            paddingAngle={3}
                        >
                            {durationChartData.map((entry) => (
                                <Cell
                                    key={entry.duration}
                                    fill={entry.color}
                                    stroke={entry.color}
                                />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend
                            align='right'
                            iconSize={15}
                            iconType='circle'
                            layout='vertical'
                            verticalAlign='middle'
                            width='30%'
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </>
    );
};
export default DashboardSummary;
