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
        <div className='flex gap-x-1 rounded-sm border-none'>
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
                        className={`hover:not-disabled:cursor-pointer aria-disabled:cursor-not-allowed ${isActive ? 'text-indigo-500' : 'text-slate-700'}`}
                        type='button'
                        variant='link'
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
