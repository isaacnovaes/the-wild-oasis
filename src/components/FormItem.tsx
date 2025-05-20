import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ComponentPropsWithoutRef } from 'react';
import type { FieldValues, Path, UseFormRegister } from 'react-hook-form';

interface InputProps<T extends FieldValues>
    extends Omit<ComponentPropsWithoutRef<'input'>, 'name'> {
    readonly label: string;
    readonly name: Path<T>;
    readonly register: UseFormRegister<T>;
    readonly error: string | undefined;
    readonly isFormDirty: boolean;
    readonly valueAsNumber?: boolean;
}

const FormItem = <T extends FieldValues>({
    label,
    name,
    valueAsNumber,
    register,
    error,
    id,
    isFormDirty,
    ...rest
}: InputProps<T>) => {
    return (
        <div className={`my-4 flex flex-col`}>
            <Label className='flex items-center py-1' htmlFor={id}>
                {label}
            </Label>
            <span
                className={`text-xs font-medium text-red-500 ${error && isFormDirty ? 'animate-shake' : 'invisible'}`}
            >
                {isFormDirty && error ? error : 'No error'}
            </span>
            <Input
                aria-invalid={Boolean(error && isFormDirty)}
                {...register(name, { valueAsNumber })}
                {...rest}
                id={id}
            />
        </div>
    );
};
export default FormItem;
