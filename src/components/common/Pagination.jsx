import { getPageItems } from '../../utils/metrics';
import { ChevronLeft, ChevronRight } from './Icons';

export default function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages < 1) return null;
  const items = getPageItems(page, totalPages);
  const arrow =
    'flex h-9 w-9 items-center justify-center rounded-md text-ink hover:bg-white disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent';

  return (
    <nav aria-label="Pagination" className="mt-6 flex flex-wrap items-center justify-center gap-1.5">
      <button type="button" className={arrow} disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
        <ChevronLeft />
      </button>

      {items.map((item, i) =>
        item === '…' ? (
          <span key={`gap-${i}`} className="px-2 text-muted" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-current={item === page ? 'page' : undefined}
            aria-label={`Page ${item}`}
            className={`relative h-9 min-w-9 rounded-md px-2 text-[15px] hover:bg-white ${
              item === page ? 'font-semibold text-ink' : 'text-muted'
            }`}
          >
            {item}
            {item === page && <span className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded bg-brand" />}
          </button>
        )
      )}

      <button type="button" className={arrow} disabled={page >= totalPages} onClick={() => onChange(page + 1)} aria-label="Next page">
        <ChevronRight />
      </button>
    </nav>
  );
}
