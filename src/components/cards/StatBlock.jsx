import Skeleton from '../common/Skeleton';
import { TrendDown, TrendUp } from '../common/Icons';

function Trend({ pct, compareLabel }) {
  if (pct == null) {
    return <p className="text-[15px] text-muted">No data for {compareLabel}</p>;
  }
  const rounded = Math.round(Math.abs(pct));
  if (rounded === 0) {
    return <p className="text-[15px] text-muted">Same as {compareLabel}</p>;
  }
  const up = pct > 0;
  const Icon = up ? TrendUp : TrendDown;
  return (
    <p className={`flex items-center gap-2 text-[15px] ${up ? 'text-up' : 'text-down'}`}>
      <Icon />
      <span className="text-ink">
        {rounded}% {up ? 'More' : 'Less'} than {compareLabel}
      </span>
    </p>
  );
}


export default function StatBlock({ title, state, value, pct, compareLabel, onRetry }) {
  return (
    <div className="flex min-w-0 flex-col gap-3 p-1">
      <h3 className="text-lg font-medium">{title}</h3>
      {state === 'loading' && (
        <>
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-5 w-44" />
        </>
      )}
      {state === 'error' && (
        <>
          <p className="text-[34px] font-medium leading-none text-muted">--</p>
          <button type="button" onClick={onRetry} className="w-fit text-sm text-brand underline">
            Couldn’t load. Try again
          </button>
        </>
      )}
      {state === 'ready' && (
        <>
          <p className="text-[38px] font-medium leading-none">{value}</p>
          <Trend pct={pct} compareLabel={compareLabel} />
        </>
      )}
    </div>
  );
}
