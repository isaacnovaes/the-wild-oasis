import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popoverDialog';
import { cn } from '@/lib/utils';
import type { getAllCabins } from '@/services/apiCabins';
import { formatCurrency } from '@/utils/helpers';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

const CabinCombo = (props: {
    readonly cabins: Awaited<ReturnType<typeof getAllCabins>>['cabins'];
    readonly cabinId: number;
    readonly onSelect: (cabinId: number) => void;
    readonly error?: string;
    readonly isDirty: boolean;
}) => {
    const [open, setOpen] = useState(false);

    return (
        <div className={`flex flex-col not-first:my-4`}>
            <Label className='mb-2'>Cabin</Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        aria-expanded={open}
                        className='w-full justify-between'
                        role='combobox'
                        variant='outline'
                    >
                        {props.cabinId
                            ? props.cabins.find((g) => g.id === props.cabinId)?.name
                            : 'Select a cabin...'}
                        <ChevronsUpDown className='opacity-50' />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className='w-full p-0'>
                    <Command>
                        <CommandInput placeholder='Search cabin...' />
                        <CommandList>
                            <CommandEmpty>No cabin found.</CommandEmpty>
                            <CommandGroup>
                                {props.cabins.slice().map((g) => {
                                    return (
                                        <CommandItem
                                            key={g.id}
                                            value={g.name}
                                            onSelect={(name) => {
                                                const cabin = props.cabins.find(
                                                    (c) => c.name === name
                                                );
                                                const selectedId = cabin
                                                    ? cabin.id === props.cabinId
                                                        ? 0
                                                        : cabin.id
                                                    : 0;
                                                props.onSelect(selectedId);
                                                setOpen(false);
                                            }}
                                        >
                                            {g.name} {formatCurrency(g.regularPrice)}
                                            <Check
                                                className={cn(
                                                    'ml-auto',
                                                    props.cabinId === g.id
                                                        ? 'opacity-100'
                                                        : 'opacity-0'
                                                )}
                                            />
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <span
                className={`text-xs font-medium text-red-500 ${props.error && props.isDirty ? 'animate-shake' : 'invisible'}`}
            >
                {props.isDirty && props.error ? props.error : ''}
            </span>
        </div>
    );
};
export default CabinCombo;
