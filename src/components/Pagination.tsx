import { Link, linkOptions } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PAGE_SIZE } from '../utils/constants';

const _linkOption = linkOptions([
    { to: '/cabins', search: { page: 1 } },
    { to: '/bookings', search: { page: 1 } },
]);

const Pagination = ({
    hasNext,
    hasPrevious,
    to,
    count,
    page,
}: {
    readonly hasNext: boolean;
    readonly hasPrevious: boolean;
    readonly to: [typeof _linkOption]['0'][number]['to'];
    readonly count: number;
    readonly page: number;
}) => {
    const fromItem = (page - 1) * PAGE_SIZE;
    const toItem = fromItem + PAGE_SIZE - 1;

    return (
        <div className='flex flex-col items-center justify-between gap-y-2 bg-zinc-100 px-2 py-4 text-sm @lg/table-footer:flex-row'>
            <div>
                Showing <span className='font-semibold'>{fromItem + 1}</span> to{' '}
                <span className='font-semibold'>{toItem + 1 > count ? count : toItem + 1}</span> of{' '}
                <span className='font-semibold'>{count}</span> results
            </div>
            <div className='flex items-center space-x-10'>
                <Link
                    aria-disabled={!hasPrevious}
                    className='flex items-center justify-between aria-disabled:cursor-not-allowed'
                    disabled={!hasPrevious}
                    search={(prev) => ({ ...prev, page: page - 1 })}
                    to={to}
                >
                    <ChevronLeft /> Previous
                </Link>
                <Link
                    aria-disabled={!hasNext}
                    className='flex items-center justify-between aria-disabled:cursor-not-allowed'
                    disabled={!hasNext}
                    search={(prev) => ({ ...prev, page: page + 1 })}
                    to={to}
                >
                    Next <ChevronRight />
                </Link>
            </div>
        </div>
    );
};
export default Pagination;
