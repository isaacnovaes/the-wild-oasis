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
            <div className='flex flex-wrap gap-x-3 gap-y-3 rounded-sm bg-white p-5'>
                <SettingsForm settings={settings} />
            </div>
        </div>
    );
};
export default Settings;
