function App() {
    return (
        <div className='group grid h-dvh place-items-center bg-indigo-200 has-focus:bg-red-500'>
            <button
                className='text-center hover:cursor-pointer focus-visible:bg-amber-600'
                type='button'
            >
                Hello world
            </button>
            <a
                className='group-hover:bg-blend-lighten'
                href='https://google.com'
                rel='noopener noreferrer'
                target='_blank'
            >
                Hello
            </a>
        </div>
    );
}

export default App;
