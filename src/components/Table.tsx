import { useSearch } from '@tanstack/react-router';
import { createContext, useContext, useMemo, type ReactNode } from 'react';

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

function Table({ columns, children }: { readonly columns: string; readonly children: ReactNode }) {
    const value = useMemo(() => ({ columns }), [columns]);
    return (
        <TableContext.Provider value={value}>
            <div
                className='@container/table rounded-b-lg border-1 border-gray-200 shadow-md'
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
            className={`grid ${columns} w-max rounded-sm border-b-1 border-gray-100 bg-zinc-100 text-xs font-semibold tracking-widest text-gray-600 uppercase shadow-sm @4xl/table:w-auto`}
            role='row'
        >
            {children}
        </header>
    );
}

function Body<T>({
    data,
    render,
    header,
}: {
    readonly data: T[];
    readonly render: (item: T) => ReactNode;
    readonly header: ReactNode;
}) {
    const { page } = useSearch({ strict: false });
    if (!data.length)
        return (
            <Empty>
                No data to show at the moment{' '}
                {page && page > 1 ? `for page ${page.toString()}` : ''}
            </Empty>
        );

    return (
        <section className='overflow-auto'>
            <Header>{header}</Header>
            {data.map(render)}
        </section>
    );
}

function Row({
    children,
    className,
}: {
    readonly children: ReactNode;
    readonly className?: string;
}) {
    const columns = useColumns();
    return (
        <div
            className={`grid ${columns} border-b-2 border-b-gray-100 ${className ?? ''}`}
            role='row'
        >
            {children}
        </div>
    );
}

const Footer = (props: { readonly children: ReactNode }) => {
    return (
        <footer className='@container/table-footer bg-gray-50 empty:hidden'>
            {props.children}
        </footer>
    );
};

Table.Body = Body;
Table.Row = Row;
Table.Footer = Footer;

export default Table;
