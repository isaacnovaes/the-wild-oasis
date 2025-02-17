import { useState } from 'react';
import styles from './App.module.css';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

const CONSTANTS = {
    zero: 0,
    one: 1,
};

function App() {
    const [count, setCount] = useState(CONSTANTS.zero);

    return (
        <>
            <div>
                <a href='https://vite.dev' rel='noreferrer' target='_blank'>
                    <img alt='Vite logo' className={styles.logo} src={viteLogo} />
                </a>
                <a href='https://react.dev' rel='noreferrer' target='_blank'>
                    <img
                        alt='React logo'
                        className={`${styles.logo || ''} ${styles.react || ''}`}
                        src={reactLogo}
                    />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className={styles.card}>
                <button
                    type='button'
                    onClick={() => {
                        setCount((prevCount) => prevCount + CONSTANTS.one);
                    }}
                >
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className={styles['read-the-docs']}>
                Click on the Vite and React logos to learn more
            </p>
        </>
    );
}

export default App;
