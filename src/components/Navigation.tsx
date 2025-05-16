import NavLinks from './NavLinks';

const Navigation = () => {
    return (
        <div className='col-start-1 col-end-2 row-start-1 row-end-3 hidden border-1 border-zinc-200 md:block'>
            <img alt='logo' className='m-auto h-20 w-auto py-3 lg:h-30' src='logo-light.png' />
            <div className='py-5 lg:px-4 lg:py-8'>
                <NavLinks />
            </div>
            {/* <Uploader /> */}
        </div>
    );
};
export default Navigation;
