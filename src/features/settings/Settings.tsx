import FormItem from '@/components/FormItem';
import Loading from '@/components/Loading';
import PageHeader from '@/components/PageHeader';
import { useSettings } from '@/utils/hooks';
import { ErrorComponent } from '@tanstack/react-router';
import { useState } from 'react';

const Settings = () => {
    const settingsQuery = useSettings();
    const [breakFastPrice, setBreakfastPrice] = useState(0);

    if (settingsQuery.isPending) {
        return <Loading />;
    }

    if (settingsQuery.isError) {
        return <ErrorComponent error={settingsQuery.error} />;
    }

    const { data: settings } = settingsQuery;

    return (
        <div>
            <PageHeader title='Settings' />
            <div className='rounded-sm bg-white p-5'>
                <div className='max-w-[30%]'>
                    <FormItem
                        id='breakfastPrice'
                        inputMode='decimal'
                        inputType='controlled'
                        label='Breakfast price'
                        name='breakfastPrice'
                        step='0.01'
                        type='number'
                        value={breakFastPrice}
                        onChange={(e) => {
                            setBreakfastPrice(e.target.valueAsNumber);
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
export default Settings;
