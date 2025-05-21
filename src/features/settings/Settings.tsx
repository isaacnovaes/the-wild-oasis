import Loading from '@/components/Loading';
import { useSettings } from '@/utils/hooks';
import { ErrorComponent } from '@tanstack/react-router';

const Settings = () => {
    const settings = useSettings();

    if (settings.isPending) {
        return <Loading />;
    }

    if (settings.isError) {
        return <ErrorComponent error={settings.error} />;
    }

    return (
        <div>
            {Object.entries(settings).map(([key, value]) => (
                <div key={key}>
                    {key} {value}
                </div>
            ))}
        </div>
    );
};
export default Settings;
