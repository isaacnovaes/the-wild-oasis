import { z } from 'zod';
import supabase, { SUPABASE_URL } from '../supabase';
import { CabinSchema, type Cabin, type SearchParams } from '../types/global';
import { PAGE_SIZE } from '../utils/constants';

export async function getCabins({ page, filter, sortBy }: SearchParams) {
    let query = supabase.from('cabins').select('*', { count: 'exact' });

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);

    // FILTER
    if (filter && filter.value !== 'all') {
        query = query[filter.method || 'eq'](filter.field, filter.value);
    }

    // SORT
    if (sortBy)
        query = query.order(sortBy.field, {
            ascending: sortBy.direction === 'asc',
        });

    const { data, error, count } = await query;

    if (error) {
        console.error(error);
        throw new Error(error.message);
    }

    const responseSchema = z.object({
        cabins: z.array(CabinSchema),
        count: z.number(),
    });

    const validation = responseSchema.safeParse({ cabins: data, count });

    if (validation.error) {
        console.error(validation.error);
        throw new Error(validation.error.message);
    }

    return validation.data;
}

export async function createEditCabin(newCabin: Partial<Cabin>, id?: string): Promise<Cabin[]> {
    const hasImagePath = newCabin.image?.startsWith(SUPABASE_URL);

    const imageName = `${Math.random().toString()}-${newCabin.image?.name}`.replaceAll('/', '');
    const imagePath = hasImagePath
        ? newCabin.image
        : `${SUPABASE_URL}/storage/v1/object/public/cabin-images/${imageName}`;

    // 1. Create/edit cabin
    let query = supabase.from('cabins');

    // A) CREATE
    if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

    // B) EDIT
    if (id) query = query.update({ ...newCabin, image: imagePath }).eq('id', id);

    const { data, error } = await query.select().single();

    if (error) {
        console.error(error);
        throw new Error(error.message);
    }

    // 2. Upload image
    if (hasImagePath) return data;

    const { error: storageError } = await supabase.storage
        .from('cabin-images')
        .upload(imageName, newCabin.image);

    // 3. Delete the cabin IF there was an error uplaoding image
    if (storageError) {
        await supabase.from('cabins').delete().eq('id', data.id);
        console.error(storageError);
        throw new Error('Cabin image could not be uploaded and the cabin was not created');
    }

    return data;
}

export async function deleteCabin(id: string) {
    const { data, error } = await supabase.from('cabins').delete().eq('id', id);

    if (error) {
        console.error(error);
        throw new Error(error.message);
    }

    return data;
}
