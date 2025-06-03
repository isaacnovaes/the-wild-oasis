import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ErrorComponent, getRouteApi } from '@tanstack/react-router';
import { EllipsisVertical } from 'lucide-react';
import { useState } from 'react';
import Loading from '../../components/Loading';
import Pagination from '../../components/Pagination';
import Table from '../../components/Table';
import { PAGE_SIZE } from '../../utils/constants';
import { useCabins } from '../../utils/hooks';
import CabinForm from './CabinForm';
import CabinRow from './CabinRow';
import CabinTableOperations from './CabinTableOperations';

const cabinRouter = getRouteApi('/_app/cabins');

const Cabins = () => {
    const [openCreateCabin, setOpenCreateCabin] = useState(false);
    const cabinsQuery = useCabins();
    const { page } = cabinRouter.useSearch();

    if (cabinsQuery.isError) {
        return <ErrorComponent error={cabinsQuery.error} />;
    }

    const hasNext = PAGE_SIZE * page < (cabinsQuery.data?.count || 0);
    const hasPrevious = page > 1;

    return (
        <div>
            <PageHeader
                button={
                    <Dialog open={openCreateCabin} onOpenChange={setOpenCreateCabin}>
                        <DialogTrigger asChild>
                            <Button variant={'outline'}>Create new cabin</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <ScrollArea
                                className='h-[calc(100dvh-10rem)] max-h-[515px] overflow-hidden'
                                type='auto'
                            >
                                <DialogHeader>
                                    <DialogTitle>New cabin</DialogTitle>
                                    <DialogDescription>
                                        Create cabin form. Click save when you&apos;re done.
                                    </DialogDescription>
                                </DialogHeader>
                                <CabinForm
                                    mode='create'
                                    onSuccess={() => {
                                        setOpenCreateCabin(false);
                                    }}
                                />
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>
                }
                title='All cabins'
            >
                <CabinTableOperations />
            </PageHeader>
            <Table columns='grid-cols-[6rem_4rem_12rem_11rem_8rem_8rem_3rem] @4xl/route:grid-cols-[6rem_0.5fr_1fr_1fr_8rem_8rem_3rem] pl-2 py-3'>
                {cabinsQuery.isLoading ? (
                    <Loading />
                ) : cabinsQuery.data?.cabins ? (
                    <>
                        <Table.Body
                            data={cabinsQuery.data.cabins}
                            header={
                                <>
                                    <div />
                                    <div>Id</div>
                                    <div>Name</div>
                                    <div>Capacity</div>
                                    <div>Price</div>
                                    <div>Discount</div>
                                    <EllipsisVertical className='invisible size-4 stroke-gray-600' />
                                </>
                            }
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
