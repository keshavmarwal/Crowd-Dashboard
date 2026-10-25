import Avatar from '../common/Avatar';
import Skeleton from '../common/Skeleton';
import { capitalize } from '../../utils/metrics';
import { formatClock, formatDwellClock } from '../../utils/time';

const HEAD = ['Name', 'Sex', 'Entry', 'Exit', 'Dwell Time'];

export default function EntriesTable({ records, timezone, loading, fetching }) {
  return (
    <div
      className={`overflow-x-auto rounded-xl border border-line bg-white transition-opacity ${fetching ? 'opacity-60' : ''}`}
      aria-busy={fetching || undefined}
    >
      <table className="w-full min-w-[720px] border-collapse text-left text-[16px]">
        <thead>
          <tr className="bg-[#e8e8e8]">
            {HEAD.map((h) => (
              <th key={h} scope="col" className="px-6 py-5 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 10 }, (_, i) => (
                <tr key={i} className="border-t border-line">
                  <td className="px-6 py-4" colSpan={HEAD.length}>
                    <Skeleton className="h-8 w-full" />
                  </td>
                </tr>
              ))
            : records.map((r, i) => (
                <tr key={`${r.personId}-${r.entryUtc}-${i}`} className="border-t border-line text-muted">
                  <td className="px-6 py-3">
                    <span className="flex items-center gap-3">
                      <Avatar name={r.personName} size={42} />
                      <span>{r.personName}</span>
                    </span>
                  </td>
                  <td className="px-6 py-3">{capitalize(r.gender) || '--'}</td>
                  <td className="px-6 py-3">{formatClock(r.entryUtc, timezone)}</td>
                  <td className="px-6 py-3">{r.exitUtc ? formatClock(r.exitUtc, timezone) : '--'}</td>
                  <td className="px-6 py-3">{formatDwellClock(r.dwellMinutes)}</td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}
