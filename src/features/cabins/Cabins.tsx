import { ErrorComponent, getRouteApi } from '@tanstack/react-router';
import Loading from '../../components/Loading';
import Pagination from '../../components/Pagination';
import Table from '../../components/Table';
import { PAGE_SIZE } from '../../utils/constants';
import { useCabins } from '../../utils/hooks';
import CabinRow from './CabinRow';
import CabinTableOperations from './CabinTableOperations';

const cabinRouter = getRouteApi('/_app/cabins');

const Cabins = () => {
    const cabinsQuery = useCabins();
    const { page } = cabinRouter.useSearch();

    if (cabinsQuery.isError) {
        return <ErrorComponent error={cabinsQuery.error} />;
    }

    const hasNext = PAGE_SIZE * page < (cabinsQuery.data?.count || 0);
    const hasPrevious = page > 1;

    return (
        <div>
            <div className='mb-5 flex items-center justify-between'>
                <h1 className='text-2xl font-semibold text-slate-700'>All cabins</h1>
                <CabinTableOperations />
            </div>
            <Table columns='grid-cols-[0.6fr_1.8fr_2.2fr_1fr_1fr_1fr]'>
                <Table.Header>
                    <div />
                    <div>Cabin</div>
                    <div>Capacity</div>
                    <div>Price</div>
                    <div>Discount</div>
                    <div />
                </Table.Header>
                {cabinsQuery.isLoading ? (
                    <Loading />
                ) : cabinsQuery.data?.cabins ? (
                    <>
                        <Table.Body
                            data={cabinsQuery.data.cabins}
                            render={(cabin) => <CabinRow key={cabin.id} cabin={cabin} />}
                        />
                        <Table.Footer>
                            {cabinsQuery.data.count > PAGE_SIZE && (
                                <Pagination
                                    count={cabinsQuery.data.count || 0}
                                    hasNext={hasNext}
                                    hasPrevious={hasPrevious}
                                    page={page}
                                    to='/cabins'
                                />
                            )}
                        </Table.Footer>
                    </>
                ) : null}
            </Table>
        </div>
    );
};
export default Cabins;
