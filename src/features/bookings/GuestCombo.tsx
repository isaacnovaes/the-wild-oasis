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
import type { getGuests } from '@/services/apiGuests';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

const GuestCombo = (props: {
    readonly guests: Awaited<ReturnType<typeof getGuests>>['guests'];
    readonly guestId: number;
    readonly id: string;
    readonly onSelect: (guestId: number) => void;
    readonly error?: string;
    readonly isDirty: boolean;
}) => {
    const [open, setOpen] = useState(false);
    return (
        <div className={`flex flex-col not-first:my-4`}>
            <Label className='mb-2'>Guest</Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        aria-expanded={open}
                        className='w-full justify-between'
                        role='combobox'
                        variant='outline'
                    >
                        {props.guestId
                            ? props.guests.find((g) => g.id === props.guestId)?.fullName
                            : 'Select a guest...'}
                        <ChevronsUpDown className='opacity-50' />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className='w-full p-0'>
                    <Command>
                        <CommandInput placeholder='Search guest...' />
                        <CommandList>
                            <CommandEmpty>No guest found.</CommandEmpty>
                            <CommandGroup>
                                {props.guests
                                    .slice(props.guests.length > 10 ? 10 : undefined)
                                    .map((g) => (
                                        <CommandItem
                                            key={g.id}
                                            id={props.id}
                                            value={g.fullName}
                                            onSelect={(name) => {
                                                const guest = props.guests.find(
                                                    (g2) => g2.fullName === name
                                                );
                                                const selectedId = guest
                                                    ? guest.id === props.guestId
                                                        ? 0
                                                        : guest.id
                                                    : 0;
                                                props.onSelect(selectedId);
                                                setOpen(false);
                                            }}
                                        >
                                            {g.fullName} {g.email}
                                            <Check
                                                className={cn(
                                                    'ml-auto',
                                                    props.guestId === g.id
                                                        ? 'opacity-100'
                                                        : 'opacity-0'
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
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
export default GuestCombo;
