import FormItem from '@/components/FormItem';
import { updateSetting } from '@/services/apiSettings';
import type { Settings } from '@/types/settings';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';

const SettingsForm = ({ settings }: { readonly settings: Settings }) => {
    const queryClient = useQueryClient();
    const [breakFastPrice, setBreakfastPrice] = useState(settings.breakfastPrice);
    const [minBookingLength, setMinBookingLength] = useState(settings.minBookingLength);
    const [maxBookingLength, setMaxBookingLength] = useState(settings.maxBookingLength);
    const [maxGestsPerBooking, setMaxGestsPerBooking] = useState(settings.maxGestsPerBooking);

    const { mutate } = useMutation({
        mutationKey: ['settings', 'form'],
        mutationFn: updateSetting,
        onMutate: () => toast.loading('Updating setting'),
        onSuccess: (_data, _vars, toasterId) => {
            toast.success('Settings updated', { id: toasterId });
            void queryClient.invalidateQueries({ queryKey: ['settings'] });
        },
        onError: (e, _vars, toasterId) => {
            toast.error(e.message, { id: toasterId });
        },
    });

    const updateSettingItem = (item: keyof Settings, value: number) => {
        if (settings[item] !== value) {
            mutate({ [item]: value, editedAt: new Date().toISOString() });
        }
    };

    return (
        <>
            <FormItem
                id='breakfastPrice'
                inputMode='decimal'
                inputType='controlled'
                label='Breakfast price'
                name='breakfastPrice'
                step='0.01'
                type='number'
                value={breakFastPrice}
                onBlur={(e) => {
                    const value = e.target.valueAsNumber;
                    updateSettingItem('breakfastPrice', value);
                }}
                onChange={(e) => {
                    const value = e.target.valueAsNumber;
                    setBreakfastPrice(value);
                }}
            />
            <FormItem
                id='minBookingLength'
                inputMode='decimal'
                inputType='controlled'
                label='Min booking length'
                name='minBookingLength'
                type='number'
                value={minBookingLength}
                onBlur={(e) => {
                    const value = e.target.valueAsNumber;
                    updateSettingItem('minBookingLength', value);
                }}
                onChange={(e) => {
                    const value = e.target.valueAsNumber;
                    setMinBookingLength(value);
                }}
            />
            <FormItem
                id='maxBookingLength'
                inputMode='decimal'
                inputType='controlled'
                label='Max booking length'
                name='maxBookingLength'
                type='number'
                value={maxBookingLength}
                onBlur={(e) => {
                    const value = e.target.valueAsNumber;
                    updateSettingItem('maxBookingLength', value);
                }}
                onChange={(e) => {
                    const value = e.target.valueAsNumber;
                    setMaxBookingLength(value);
                }}
            />
            <FormItem
                id='maxGuestsPerBooking'
                inputMode='decimal'
                inputType='controlled'
                label='Max guests per booking'
                name='maxGuestsPerBooking'
                type='number'
                value={maxGestsPerBooking}
                onBlur={(e) => {
                    const value = e.target.valueAsNumber;
                    updateSettingItem('maxGestsPerBooking', value);
                }}
                onChange={(e) => {
                    const value = e.target.valueAsNumber;
                    setMaxGestsPerBooking(value);
                }}
            />
        </>
    );
};
export default SettingsForm;
