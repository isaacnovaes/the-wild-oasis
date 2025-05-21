import { getRouteApi } from '@tanstack/react-router';
import Filter from '../../components/Filter';
import SortBy from '../../components/SortBy';
import TableOperations from '../../components/TableOperations';
import {
    SearchFieldsSchema,
    SortByDirectionSchema,
    type FilterOption,
    type SelectOption,
} from '../../types/global';

const filterOptions: FilterOption[] = [
    { value: 'all', label: 'All', method: '' },
    { value: '0', label: 'Discount', method: 'neq' },
    { value: '0', label: 'No discount', method: 'eq' },
];

const sortOptions: SelectOption[] = [
    { value: 'all', label: 'Sort fields' },
    {
        value: 'name-asc',
        label: 'Sort by name (A-Z)',
    },
    { value: 'name-desc', label: 'Sort by name (Z-A)' },
    {
        value: 'id-desc',
        label: 'Sort by id (high first)',
    },
    {
        value: 'id-asc',
        label: 'Sort by id (low first)',
    },
    {
        value: 'regularPrice-asc',
        label: 'Sort by price (low first)',
    },
    {
        value: 'regularPrice-desc',
        label: 'Sort by price (high first)',
    },
    {
        value: 'maxCapacity-asc',
        label: 'Sort by capacity (low first)',
    },
    {
        value: 'maxCapacity-desc',
        label: 'Sort by capacity (high first)',
    },
    {
        value: 'discount-asc',
        label: 'Sort by discount (low first)',
    },
    {
        value: 'discount-desc',
        label: 'Sort by discount (high first)',
    },
];

const CabinTableOperations = () => {
    const navigate = getRouteApi('/_app/cabins').useNavigate();

    return (
        <TableOperations>
            <Filter filterField='discount' options={filterOptions} routePath='/cabins' />
            <SortBy
                handleChange={(e) => {
                    void navigate({
                        search: (prev) => {
                            const selectedValue = e.target.value;
                            if (selectedValue !== 'all') {
                                const [field, direction] = selectedValue.split('-');
                                const sortBy = {
                                    direction: SortByDirectionSchema.parse(direction),
                                    field: SearchFieldsSchema.parse(field),
                                };
                                return { ...prev, sortBy };
                            }
                            return {
                                page: prev.page,
                                filter: prev.filter,
                            };
                        },
                    });
                }}
                options={sortOptions}
            />
        </TableOperations>
    );
};
export default CabinTableOperations;
