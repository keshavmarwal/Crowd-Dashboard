import { useEffect, useRef, useState } from 'react';
import { useFilters } from '../../hooks/useFilters';
import { ChevronDown, PinIcon } from '../common/Icons';

export default function SiteSelect() {
  const { sites, site, selectSite } = useFilters();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="relative min-w-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex max-w-[260px] items-center gap-2.5 rounded-lg border border-[#c9ced2] bg-white px-4 py-2.5 text-[17px] hover:border-brand"
      >
        <PinIcon width={20} height={20} className="shrink-0" />
        <span className="truncate">{site?.name}</span>
        <ChevronDown className="shrink-0" />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Select site"
          className="absolute left-0 top-full z-50 mt-2 max-h-80 w-[300px] overflow-auto rounded-lg border border-line bg-white py-1 shadow-xl"
        >
          {sites.map((s) => (
            <li key={s.siteId} role="option" aria-selected={s.siteId === site?.siteId}>
              <button
                type="button"
                onClick={() => {
                  selectSite(s.siteId);
                  setOpen(false);
                }}
                className={`flex w-full flex-col px-4 py-2.5 text-left hover:bg-page ${
                  s.siteId === site?.siteId ? 'bg-page font-medium' : ''
                }`}
              >
                <span>{s.name}</span>
                <span className="text-sm text-muted">
                  {s.city}, {s.country}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
