import { Button } from '@/components/ui/button';
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
                <div className='flex items-center justify-center gap-x-10'>
                    <h1 className='text-2xl font-semibold text-slate-700'>All cabins</h1>
                    <Button variant={'outline'}>Create new cabin</Button>
                    <code>Use Dialog component from shadcn</code>
                    <code>Read react hook form</code>
                    <code>Take a look at shadcn lib form wrapper for react hook form</code>
                </div>
                <CabinTableOperations />
            </div>
            <Table columns='grid-cols-[0.6fr_1fr_2fr_1.5fr_1fr_1fr_3.2rem]'>
                <Table.Header>
                    <div />
                    <div>Id</div>
                    <div>Name</div>
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
