import Currency from '../../components/Currency';
import Table from '../../components/Table';
import type { Cabin } from '../../types/global';

const CabinRow = ({ cabin }: { readonly cabin: Cabin }) => {
    return (
        <Table.Row>
            <img
                alt={`${cabin.name} cabin`}
                className='rounded-sm'
                height={80}
                src={cabin.image}
                width={80}
            />
            <span>{cabin.name}</span>
            <span>Fits up to {cabin.maxCapacity} guests</span>
            <Currency amount={cabin.regularPrice} />
            {cabin.discount > 0 ? (
                <Currency amount={cabin.discount} color='text-green-700' />
            ) : (
                <span className='text-slate-800'>&mdash;</span>
            )}
        </Table.Row>
    );
};
export default CabinRow;
