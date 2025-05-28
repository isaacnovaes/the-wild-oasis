import { linkOptions, useNavigate, useSearch } from '@tanstack/react-router';
import type { FilterOption, SearchField, SearchParams } from '../types/global';
import { Button } from './ui/button';

const _linkOption = linkOptions([
    { to: '/cabins', search: { page: 1 } },
    { to: '/bookings', search: { page: 1 } },
]);

function Filter({
    filterField,
    options,
    routePath,
}: {
    readonly options: FilterOption[];
    readonly filterField: SearchField;
    readonly routePath: '/cabins' | '/bookings';
}) {
    const navigate = useNavigate({ from: routePath });
    const currentSearch = useSearch({ strict: false });

    return (
        <div className='flex gap-x-1 rounded-sm bg-white p-1 shadow-sm'>
            {options.map((option) => {
                let isActive =
                    currentSearch.filter?.value === option.value &&
                    currentSearch.filter.method === option.method;

                if (currentSearch.filter === undefined && option.value === 'all') {
                    isActive = true;
                }

                return (
                    <Button
                        key={`${option.value}${option.method}`}
                        className={`rounded-sm border-2 border-transparent px-2 text-sm font-normal ${isActive ? 'border-indigo-500 bg-indigo-500 text-white hover:cursor-not-allowed' : 'text-slate-700 hover:cursor-pointer hover:bg-indigo-100'}`}
                        size='sm'
                        type='button'
                        variant='ghost'
                        onClick={() => {
                            const search: SearchParams = { page: 1 };
                            if (option.value !== 'all') {
                                search.filter = {
                                    field: filterField,
                                    method: option.method,
                                    value: option.value,
                                };
                            }
                            void navigate({ search });
                        }}
                    >
                        {option.label}
                    </Button>
                );
            })}
        </div>
    );
}

export default Filter;
