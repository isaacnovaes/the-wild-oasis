import { Link } from '@tanstack/react-router';

const DashBoardOperations = () => {
    return (
        <div className='flex items-center justify-end gap-x-1 rounded-sm bg-white p-1 shadow-sm'>
            <Link
                activeProps={{
                    className:
                        'text-white border-indigo-500 bg-indigo-500 hover:cursor-not-allowed',
                }}
                className='rounded-sm border-2 border-transparent px-2 text-sm font-normal'
                inactiveProps={{
                    className: 'text-slate-700 hover:cursor-pointer hover:bg-indigo-100',
                }}
                search={{ last: 7 }}
                to='/dashboard'
            >
                Past 7 days
            </Link>
            <Link
                activeProps={{
                    className:
                        'text-white border-indigo-500 bg-indigo-500 hover:cursor-not-allowed',
                }}
                className='rounded-sm border-2 border-transparent px-2 text-sm font-normal'
                inactiveProps={{
                    className: 'text-slate-700 hover:cursor-pointer hover:bg-indigo-200',
                }}
                search={{ last: 30 }}
                to='/dashboard'
            >
                Past 30 days
            </Link>
            <Link
                activeProps={{
                    className:
                        'text-white  border-indigo-500 bg-indigo-500 hover:cursor-not-allowed',
                }}
                className='rounded-sm border-2 border-transparent px-2 text-sm font-normal'
                inactiveProps={{
                    className: 'text-slate-700 hover:cursor-pointer hover:bg-indigo-200',
                }}
                search={{ last: 90 }}
                to='/dashboard'
            >
                Past 90 days
            </Link>
        </div>
    );
};
export default DashBoardOperations;
