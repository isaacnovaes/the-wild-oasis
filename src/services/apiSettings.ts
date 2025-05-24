import supabase from '../supabase';
import { SettingsSchema, type Settings } from '../types/settings';

export async function getSettings(): Promise<Settings> {
    const response = await supabase.from('settings').select('*').single();

    if (response.error) {
        console.error(response.error);
        throw new Error(response.error.message);
    }

    const validation = SettingsSchema.safeParse(response.data);

    if (validation.error) {
        console.error(validation.error);
        throw new Error(validation.error.message);
    }

    return validation.data;
}

export async function updateSetting(newSetting: Partial<Settings>) {
    const { error } = await supabase.from('settings').update(newSetting).eq('id', 1).single();

    if (error) {
        console.error(error);
        throw new Error(error.message);
    }
}
