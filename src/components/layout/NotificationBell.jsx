import { BellIcon } from '../common/Icons';


export default function NotificationBell({ unread = 0, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={unread ? `Alerts, ${unread} new` : 'Alerts'}
      aria-haspopup="dialog"
      className="relative rounded-full p-2 text-ink hover:bg-page"
    >
      <BellIcon width={28} height={28} />
      {unread > 0 && <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-[#ef4444] ring-2 ring-white" />}
    </button>
  );
}
