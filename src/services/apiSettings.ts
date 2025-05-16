import supabase from '../supabase';
import type { Settings } from '../types/global';

export async function getSettings(): Promise<Settings> {
    const response = await supabase.from('settings').select('*').single();
    const { data, error } = response;
    if (error) {
        console.error(error);
        throw new Error('Settings could not be loaded');
    }
    return data;
}

// We expect a newSetting object that looks like {setting: newValue}
export async function updateSetting(newSetting: Partial<Settings>): Promise<Settings> {
    const { data, error } = await supabase
        .from('settings')
        .update(newSetting)
        // There is only ONE row of settings, and it has the ID=1, and so this is the updated one
        .eq('id', 1)
        .single();

    if (error) {
        console.error(error);
        throw new Error('Settings could not be updated');
    }
    return data;
}
