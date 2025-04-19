import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import NavLinks from './NavLinks';

const MobileNavigationContainer = () => {
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    return (
        <div className='md:hidden'>
            <Menu
                className='stroke-indigo-600 stroke-3 hover:cursor-pointer'
                size={15}
                onClick={() => {
                    setIsSidePanelOpen((s) => !s);
                }}
            />
            <AnimatePresence>
                {isSidePanelOpen ? (
                    <motion.aside
                        animate={{ x: 0, opacity: 1 }}
                        className='absolute top-0 right-0 bottom-0 z-10 flex w-[100%] flex-col gap-5 bg-zinc-100 p-8 md:hidden'
                        exit={{ x: -50, opacity: 0 }}
                        initial={{ x: -50, opacity: 0 }}
                        transition={{
                            ease: 'easeOut',
                        }}
                        onClick={() => {
                            setIsSidePanelOpen(false);
                        }}
                    >
                        <motion.div
                            animate={{ scale: 1, y: 0 }}
                            className='size-2 self-end'
                            initial={{ scale: 0, y: 20 }}
                            transition={{ delay: 0.2 }}
                        >
                            <X className='stroke-indigo-600 hover:cursor-pointer' />
                        </motion.div>
                        <img alt='logo' className='mx-auto size-22 py-3' src='logo-light.png' />
                        <NavLinks />
                    </motion.aside>
                ) : null}
            </AnimatePresence>
        </div>
    );
};

export default MobileNavigationContainer;
