/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { ReactNode } from '@tanstack/react-router';
import { createPortal } from 'react-dom';

const Modal = (props: {
    readonly title: string;
    readonly children: ReactNode;
    readonly primaryTitle: string;
    readonly primaryFunction: () => void;
    readonly primaryClassName: string;
    readonly secondaryTitle?: string;
    readonly secondaryFunction?: () => void;
    readonly secondaryClassName?: string;
}) => {
    return createPortal(
        <div className='absolute inset-0 z-40 flex h-dvh items-center justify-center bg-red-50/0 backdrop-blur-xs'>
            <div className='rounded-sm bg-zinc-50 p-10 shadow-sm'>
                <h1 className='mb-5 text-lg font-semibold'>{props.title}</h1>
                {props.children}
                <div className='mt-4 flex flex-row-reverse items-center justify-between'>
                    {props.secondaryTitle ? (
                        <button
                            className={props.secondaryClassName}
                            type='button'
                            onClick={(e) => {
                                e.stopPropagation();
                                props.secondaryFunction?.();
                            }}
                        >
                            {props.secondaryTitle}
                        </button>
                    ) : null}
                    <button
                        className={props.primaryClassName}
                        type='button'
                        onClick={(e) => {
                            e.stopPropagation();
                            props.primaryFunction();
                        }}
                    >
                        {props.primaryTitle}
                    </button>
                </div>
            </div>
        </div>,
        document.querySelector('#modal')!
    );
};
export default Modal;
