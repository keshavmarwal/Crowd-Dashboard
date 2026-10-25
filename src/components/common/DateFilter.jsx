import { useRef } from 'react';
import { useFilters } from '../../hooks/useFilters';
import { formatDateLabel, todayYmd } from '../../utils/time';
import { CalendarIcon } from './Icons';


export default function DateFilter() {
  const { dateKey, setDateKey, timezone } = useFilters();
  const inputRef = useRef(null);
  const max = todayYmd(timezone);
  const value = dateKey === 'today' ? max : dateKey;
  const label = dateKey === 'today' ? 'Today' : formatDateLabel(dateKey);

  function openPicker() {
    const el = inputRef.current;
    if (!el) return;
    try {
      el.showPicker();
    } catch {
      el.focus();
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={openPicker}
        className="flex min-w-[170px] items-center gap-3 rounded-md border border-[#c9ced2] bg-white px-4 py-3 text-[17px] hover:border-brand sm:min-w-[210px]"
      >
        <CalendarIcon />
        <span>{label}</span>
      </button>
      <input
        ref={inputRef}
        type="date"
        value={value}
        max={max}
        tabIndex={-1}
        aria-label="Select date"
        onChange={(e) => {
          const v = e.target.value;
          if (v) setDateKey(v === max ? 'today' : v);
        }}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
      />
    </div>
  );
}
