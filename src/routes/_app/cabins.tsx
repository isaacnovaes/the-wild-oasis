import { createFileRoute } from '@tanstack/react-router';
import Cabins from '../../features/cabins/Cabins';

export const Route = createFileRoute('/_app/cabins')({
    component: Cabins,
});
