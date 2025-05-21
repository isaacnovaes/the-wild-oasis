import { useRouter } from '@tanstack/react-router';
import { MoveLeft } from 'lucide-react';
import { Button } from './ui/button';

const Back = (props: { readonly isDisabled?: boolean }) => {
    const router = useRouter();
    return (
        <Button
            disabled={props.isDisabled}
            variant='ghost'
            onClick={() => {
                router.history.back();
            }}
        >
            <MoveLeft className='size-4 stroke-indigo-600 md:size-5' /> Back
        </Button>
    );
};
export default Back;
