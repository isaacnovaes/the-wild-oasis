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
import { ErrorComponent, getRouteApi } from '@tanstack/react-router';
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
                        </DialogContent>
                    </Dialog>
                }
                title='All cabins'
            >
                <CabinTableOperations />
            </PageHeader>
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
