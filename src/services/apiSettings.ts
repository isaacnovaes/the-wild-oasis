import supabase from '../supabase';
import { SettingsSchema, type Settings } from '../types/global';

export async function getSettings(): Promise<Settings> {
    const { data, error } = await supabase.from('settings').select('*').single();

    if (error) {
        console.error(error);
        throw new Error(error.message);
    }

    const validation = SettingsSchema.safeParse(data);

    if (validation.error) {
        console.error(validation.error);
        throw new Error(validation.error.message);
    }

    return validation.data;
}

// We expect a newSetting object that looks like {setting: newValue}
export async function updateSetting(newSetting: Partial<Settings>): Promise<Settings> {
    const { data, error } = await supabase.from('settings').update(newSetting).eq('id', 1).single();

    if (error) {
        console.error(error);
        throw new Error(error.message);
    }

    const validation = SettingsSchema.safeParse(data);

    if (validation.error) {
        console.error(validation.error);
        throw new Error(validation.error.message);
    }

    return validation.data;
}
