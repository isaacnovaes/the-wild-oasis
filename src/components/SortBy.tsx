import { useSearch } from '@tanstack/react-router';
import type { ChangeEvent } from 'react';
import type { SelectOption } from '../types/global';
import Select from './Select';

function SortBy({
    options,
    handleChange,
}: {
    readonly options: SelectOption[];
    readonly handleChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}) {
    const searchParams = useSearch({ strict: false });

    const selectedValue = `${searchParams.sortBy?.field || ''}-${searchParams.sortBy?.direction || ''}`;

    const value = options.find((option) => option.value === selectedValue)?.value ?? 'all';

    return <Select id='selectBy' options={options} value={value} onChange={handleChange} />;
}

export default SortBy;
