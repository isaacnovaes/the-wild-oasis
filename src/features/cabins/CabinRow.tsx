import Currency from '../../components/Currency';
import Table from '../../components/Table';
import type { Cabin } from '../../types/cabins';
import CabinRowOperations from './CabinRowOperations';

const CabinRow = ({ cabin }: { readonly cabin: Cabin }) => {
    return (
        <Table.Row>
            <img
                alt={`${cabin.name} cabin`}
                className='rounded-sm'
                height={65}
                src={cabin.image}
                width={65}
            />
            <div className='flex flex-col items-start'>
                <span className='text-sm font-semibold text-blue-950'>{cabin.id}</span>
                <span className='font-serif text-xs text-gray-400 italic'>
                    {cabin.linkedToBooking ? 'linked to a booking' : ''}
                </span>
            </div>
            <span>{cabin.name}</span>
            <span>Fits up to {cabin.maxCapacity} guests</span>
            <Currency amount={cabin.regularPrice} />
            {cabin.discount > 0 ? (
                <Currency amount={cabin.discount} color='text-green-700' />
            ) : (
                <span className='text-slate-800'>&mdash;</span>
            )}
            <CabinRowOperations cabin={cabin} />
        </Table.Row>
    );
};
export default CabinRow;
