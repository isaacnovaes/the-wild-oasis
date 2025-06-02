/* eslint-disable camelcase */
import { BookingSchema } from '@/types/bookings';
import type { SearchParams } from '@/types/global';
import { z } from 'zod';
import supabase, { SUPABASE_URL } from '../supabase';

import {
    CabinImageFileListSchema,
    CabinImageFileSchema,
    CabinSchema,
    type Cabin,
    type CabinForm,
} from '../types/cabins';
import { PAGE_SIZE } from '../utils/constants';

export async function getCabins({ page, filter, sortBy }: SearchParams) {
    let query = supabase.from('cabins').select('*', { count: 'exact' });

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);

    if (filter && filter.value !== 'all') {
        switch (filter.method) {
            case 'eq':
                query = query.eq(filter.field, filter.value);
                break;
            case 'neq':
                query = query.neq(filter.field, filter.value);
                break;
            case 'gt':
                query = query.gt(filter.field, filter.value);
                break;
            case 'lt':
                query = query.lt(filter.field, filter.value);
                break;
            case 'gte':
                query = query.gte(filter.field, filter.value);
                break;
            case 'lte':
                query = query.lte(filter.field, filter.value);
                break;
            case 'like':
                query = query.like(filter.field, filter.value);
                break;
            case 'ilike':
                query = query.ilike(filter.field, filter.value);
                break;
            case 'is':
                query = query.is(filter.field, filter.value);
                break;
            default:
                query = query.eq(filter.field, filter.value);
        }
    }

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

export async function getAllCabins() {
    const query = supabase
        .from('cabins')
        .select('id,name, maxCapacity, regularPrice, discount, image');

    const { data, error } = await query;

    if (error) {
        console.error(error);
        throw new Error(error.message);
    }

    const responseSchema = z.object({
        cabins: z.array(CabinSchema.omit({ created_at: true, linkedToBooking: true })),
    });

    const validation = responseSchema.safeParse({ cabins: data });

    if (validation.error) {
        console.error(validation.error);
        throw new Error(validation.error.message);
    }

    return validation.data;
}

export async function getBookedOffCabinDates(cabinId: string) {
    const query = await supabase
        .from('bookings')
        .select('id,startDate, endDate')
        .eq('cabinId', cabinId);

    if (query.error) {
        throw new Error(query.error.message);
    }

    const schema = BookingSchema.pick({
        id: true,
        startDate: true,
        endDate: true,
    });

    const validation = z.array(schema).safeParse(query.data);

    if (validation.error) {
        throw new Error(validation.error.message);
    }

    return validation.data;
}

export async function createEditCabin({
    newCabin,
    id,
}: {
    newCabin: Partial<CabinForm>;
    id?: number;
}): Promise<Cabin> {
    const hasImagePath =
        typeof newCabin.image === 'string' ? newCabin.image.startsWith(SUPABASE_URL) : false;

    const imageName =
        newCabin.image instanceof FileList
            ? `${Math.random().toString()}-${newCabin.image.item(0)?.name ?? ''}`.replaceAll(
                  '/',
                  ''
              )
            : '';
    const imagePath = hasImagePath
        ? newCabin.image
        : `${SUPABASE_URL}/storage/v1/object/public/cabin-images/${imageName}`;

    const query = id
        ? supabase
              .from('cabins')
              .update({ ...newCabin, image: imagePath })
              .eq('id', id)
        : supabase.from('cabins').insert([{ ...newCabin, image: imagePath }]);

    const response = await query.select().single();

    if (response.error) {
        throw new Error(response.error.message);
    }

    const cabinValidation = CabinSchema.safeParse(response.data);

    if (cabinValidation.error) {
        console.error(cabinValidation.error);
        throw new Error(cabinValidation.error.message);
    }

    if (hasImagePath) return cabinValidation.data;

    const imageFileList = CabinImageFileListSchema.parse(newCabin.image);
    const imageFileValidation = CabinImageFileSchema.parse(imageFileList.item(0));

    const { error: storageError } = await supabase.storage
        .from('cabin-images')
        .upload(imageName, imageFileValidation);

    if (storageError) {
        await supabase.from('cabins').delete().eq('id', cabinValidation.data.id);
        console.error(storageError);
        throw new Error('Cabin image could not be uploaded and the cabin was not created');
    }

    return cabinValidation.data;
}

export async function deleteCabin(id: number): Promise<null> {
    const { data, error } = await supabase.from('cabins').delete().eq('id', id);

    if (error) {
        console.error(error);
        throw new Error(error.message);
    }

    return data;
}
