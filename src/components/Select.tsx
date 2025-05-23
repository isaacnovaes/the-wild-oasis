import type { ComponentPropsWithoutRef } from 'react';
import type { SelectOption } from '../types/global';

interface SelectProps extends Omit<ComponentPropsWithoutRef<'select'>, 'className'> {
    readonly options: SelectOption[];
}

function Select({ options, ...props }: SelectProps) {
    return (
        <select
            className='rounded-sm bg-gray-50 p-1.5 text-sm font-medium text-slate-700 shadow-sm hover:cursor-pointer'
            {...props}
        >
            {options.map((option) => (
                <option key={option.value} className='hover:cursor-pointer' value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}

export default Select;
