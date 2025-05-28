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
    { value: 'checked-out', label: 'Checked out', method: 'eq' },
    { value: 'checked-in', label: 'Checked in', method: 'eq' },
    { value: 'unconfirmed', label: 'Unconfirmed', method: 'eq' },
];

const sortByOptions: SelectOption[] = [
    { value: 'all', label: 'Sort fields' },
    {
        value: 'startDate-desc',
        label: 'Sort by start date (newer first)',
    },
    {
        value: 'startDate-asc',
        label: 'Sort by start date (older first)',
    },
    {
        value: 'id-desc',
        label: 'Sort by id (high first)',
    },
    {
        value: 'id-asc',
        label: 'Sort by id (low first)',
    },
    {
        value: 'totalPrice-desc',
        label: 'Sort by amount (high first)',
    },
    {
        value: 'totalPrice-asc',
        label: 'Sort by amount (low first)',
    },
];

const BookingTableOperations = () => {
    const navigate = getRouteApi('/_app/bookings').useNavigate();
    return (
        <TableOperations>
            <Filter filterField='status' options={filterOptions} routePath='/bookings' />
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
                options={sortByOptions}
            />
        </TableOperations>
    );
};
export default BookingTableOperations;
