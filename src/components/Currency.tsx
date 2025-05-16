import { formatCurrency } from '../utils/helpers';

const Currency = (props: { readonly amount: number; readonly color?: string }) => {
    return (
        <span className={`text-xs font-medium tracking-widest ${props.color ?? 'text-slate-600'}`}>
            {formatCurrency(props.amount)}
        </span>
    );
};
export default Currency;
