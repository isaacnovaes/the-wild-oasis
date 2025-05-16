import { useSuspenseQuery } from '@tanstack/react-query';
import { settingsQueryOptions } from '../../utils/queryOptions';

const Settings = () => {
    const { data: settings } = useSuspenseQuery(settingsQueryOptions);
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
