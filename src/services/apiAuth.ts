import { seedDb } from '@/data/uploader';
import type { UserAttributes } from '@supabase/supabase-js';
import supabase, { SUPABASE_URL } from '../supabase';

export async function signup({
    fullName,
    email,
    password,
}: {
    fullName: string;
    email: string;
    password: string;
}) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                fullName,
                avatar: '',
            },
        },
    });

    if (error) throw new Error(error.message);

    return data.user;
}

export async function login({ email, password }: { email: string; password: string }) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) throw new Error(error.message);

    await seedDb();

    return data;
}

export async function getCurrentUser() {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return null;
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error) throw new Error(error.message);

    if (!user) {
        throw new Error('There is no user');
    }

    return user;
}

export async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
}

export async function updateCurrentUser({
    password,
    fullName,
    avatar,
}: {
    password?: string;
    fullName?: string;
    avatar?: File;
}) {
    const updateData: UserAttributes = {};
    if (password) updateData.password = password;
    if (fullName) updateData.data = { fullName };

    const { data, error } = await supabase.auth.updateUser(updateData);

    if (error) throw new Error(error.message);

    if (!avatar) return data;

    const fileName = `avatar-${data.user.id}-${Math.random().toString()}`;

    const { error: storageError } = await supabase.storage.from('avatars').upload(fileName, avatar);

    if (storageError) throw new Error(storageError.message);

    const { data: updatedUser, error: error2 } = await supabase.auth.updateUser({
        data: {
            avatar: `${SUPABASE_URL}/storage/v1/object/public/avatars/${fileName}`,
        },
    });

    if (error2) throw new Error(error2.message);

    return updatedUser;
}
