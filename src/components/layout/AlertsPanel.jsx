import { useEffect, useRef } from 'react';
import { useFilters } from '../../hooks/useFilters';
import { useRealtime } from '../../hooks/useRealtime';
import { formatAlertDate, formatTime24 } from '../../utils/time';
import { CloseIcon, PinIcon } from '../common/Icons';

const SEVERITY = {
  high: { label: 'High', bg: '#a8281c' },
  medium: { label: 'Medium', bg: '#f2a03d' },
  low: { label: 'Low', bg: '#44a97f' },
};

function AlertCard({ alert, timezone }) {
  const sev = SEVERITY[alert.severity];
  return (
    <li
      className={`rounded-lg border p-4 ${
        alert.read ? 'border-line bg-white' : 'border-brand bg-[#e8f5f4]'
      }`}
    >
      <p className="text-[15px]">
        <span className="text-muted">{formatAlertDate(alert.ts, timezone)}</span>{' '}
        <span className="ml-1 font-medium">{formatTime24(alert.ts, timezone)}</span>
      </p>
      <p className="mt-1 text-[17px] font-semibold">{alert.title}</p>
      <div className="mt-2 flex items-end justify-between gap-3">
        <p className="flex min-w-0 items-center gap-1.5 text-[15px] text-muted">
          <PinIcon width={16} height={16} className="shrink-0" />
          <span className="truncate">{alert.zoneName || 'Unknown zone'}</span>
        </p>
        {sev && (
          <span
            className="shrink-0 rounded px-2.5 py-0.5 text-[13px] font-medium text-white"
            style={{ background: sev.bg }}
          >
            {sev.label}
          </span>
        )}
      </div>
    </li>
  );
}


export default function AlertsPanel({ open, onClose }) {
  const { timezone } = useFilters();
  const { siteAlerts, status } = useRealtime();
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    closeRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/35" onClick={onClose} aria-hidden="true" />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Alerts"
        className="slide-in-right fixed inset-y-0 right-0 z-[60] flex w-full max-w-[340px] flex-col bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between px-5 py-5">
          <h2 className="text-xl font-medium">Alerts</h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close alerts"
            className="rounded-md p-1 hover:bg-page"
          >
            <CloseIcon />
          </button>
        </div>

        {status !== 'connected' && (
          <p className="mx-4 mb-3 rounded-md bg-page px-3 py-2 text-sm text-muted" role="status">
            {status === 'error' || status === 'disconnected'
              ? 'Live updates are paused. Trying to reconnect…'
              : 'Connecting to live updates…'}
          </p>
        )}

        {siteAlerts.length === 0 ? (
          <p className="px-5 py-10 text-center text-muted">
            No alerts yet. Entries and exits will appear here as they happen.
          </p>
        ) : (
          <ul className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 pb-6">
            {siteAlerts.map((a) => (
              <AlertCard key={a.id} alert={a} timezone={timezone} />
            ))}
          </ul>
        )}
      </aside>
    </>
  );
}
