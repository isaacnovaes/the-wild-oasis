import Loading from '@/components/Loading';
import PageHeader from '@/components/PageHeader';
import { useSettings } from '@/utils/hooks';
import { ErrorComponent } from '@tanstack/react-router';
import SettingsForm from './SettingsForm';

const Settings = () => {
    const settingsQuery = useSettings();

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
                    <SettingsForm settings={settings} />
                </div>
            </div>
        </div>
    );
};
export default Settings;
