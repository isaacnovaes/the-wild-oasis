import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ComponentPropsWithoutRef } from 'react';
import type { FieldValues, UseFormRegister } from 'react-hook-form';

interface BasicProps extends ComponentPropsWithoutRef<'input'> {
    readonly label: string;
    readonly error?: string;
}

interface RegisteredProps<T extends FieldValues>
    extends Omit<BasicProps, keyof ReturnType<UseFormRegister<T>>> {
    readonly isFormDirty?: boolean;
    readonly inputType: 'registered';
}

interface ControlledProps extends BasicProps {
    readonly inputType: 'controlled';
}

type InputProps<T extends FieldValues> = RegisteredProps<T> | ControlledProps;

const FormItem = <T extends FieldValues>(props: InputProps<T>) => {
    const { label, id, error, inputType, isFormDirty, ...rest } = props;
    const isDirty = inputType === 'registered' ? isFormDirty : false;

    return (
        <div className={`my-4 flex flex-col`}>
            <Label className='flex items-center py-1' htmlFor={id}>
                {label}
            </Label>
            <span
                className={`text-xs font-medium text-red-500 ${error && isDirty ? 'animate-shake' : 'invisible'}`}
            >
                {isDirty && error ? error : ''}
            </span>
            <Input aria-invalid={Boolean(error && isDirty)} {...rest} id={id} />
        </div>
    );
};
export default FormItem;
