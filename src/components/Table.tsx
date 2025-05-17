import { useSearch } from '@tanstack/react-router';
import { createContext, useContext, useMemo, type ReactNode } from 'react';

const Footer = (props: { readonly children: ReactNode }) => {
    return <footer className='bg-gray-50 empty:hidden'>{props.children}</footer>;
};

const Empty = (props: { readonly children: ReactNode }) => {
    return <p className='m-10 text-center text-3xl font-medium'>{props.children}</p>;
};

const TableContext = createContext<null | { columns: string }>(null);

const useColumns = () => {
    const context = useContext(TableContext);

    if (!context) {
        throw new Error('useColumns must be used within a Table component');
    }

    return context.columns;
};

function Table({
    columns,
    children,
    header,
}: {
    readonly columns: string;
    readonly children: ReactNode;
    readonly header: ReactNode;
}) {
    const value = useMemo(() => ({ columns }), [columns]);
    return (
        <TableContext.Provider value={value}>
            {header}
            <div
                className='rounded-b-lg border-1 border-gray-200 bg-gray-50 shadow-md'
                role='table'
            >
                {children}
            </div>
        </TableContext.Provider>
    );
}

function Header({ children }: { readonly children: ReactNode }) {
    const columns = useColumns();
    return (
        <header
            className={`grid ${columns} items-center gap-x-5 rounded-sm border-b-1 border-gray-100 bg-zinc-100 p-4 text-sm font-semibold tracking-widest text-gray-600 uppercase shadow-sm`}
            role='row'
        >
            {children}
        </header>
    );
}

function Row({ children }: { readonly children: ReactNode }) {
    const columns = useColumns();
    return (
        <div
            className={`grid ${columns} items-center gap-x-5 border-b-2 border-b-gray-100 px-2 py-1`}
            role='row'
        >
            {children}
        </div>
    );
}

function Body<T>({
    data,
    render,
}: {
    readonly data: T[];
    readonly render: (item: T) => ReactNode;
}) {
    const { page } = useSearch({ strict: false });
    if (!data.length)
        return (
            <Empty>
                No data to show at the moment {page && page > 1 ? `for page ${page}` : ''}
            </Empty>
        );

    return <section className='mx-2 overflow-auto'>{data.map(render)}</section>;
}

Table.Header = Header;
Table.Body = Body;
Table.Row = Row;
Table.Footer = Footer;

export default Table;
