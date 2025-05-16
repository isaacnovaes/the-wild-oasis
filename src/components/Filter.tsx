import { linkOptions, useNavigate, useSearch } from '@tanstack/react-router';
import type { FilterOption, SearchField, SearchParams } from '../types/global';

const _linkOption = linkOptions([
    { to: '/cabins', search: { page: 1 } },
    { to: '/bookings', search: { page: 1 } },
]);

function Filter({
    filterField,
    options,
    to,
}: {
    readonly options: FilterOption[];
    readonly filterField: SearchField;
    readonly to: [typeof _linkOption]['0'][number]['to'];
}) {
    const navigate = useNavigate({ from: to });
    const currentSearch = useSearch({ strict: false });

    return (
        <div className='flex gap-x-1 rounded-sm border-none bg-gray-50'>
            {options.map((option) => {
                let isActive =
                    currentSearch.filter?.value === option.value &&
                    currentSearch.filter.method === option.method;

                if (currentSearch.filter === undefined && option.value === 'all') {
                    isActive = true;
                }

                return (
                    <button
                        key={option.value}
                        aria-disabled={isActive}
                        className={`rounded-sm border-none p-[0.90rem] text-sm font-medium hover:not-disabled:cursor-pointer hover:not-disabled:bg-indigo-500 hover:not-disabled:text-white aria-disabled:cursor-not-allowed ${isActive ? 'text-indigo-500' : 'text-slate-700'}`}
                        disabled={isActive}
                        type='button'
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
                    </button>
                );
            })}
        </div>
    );
}

export default Filter;
