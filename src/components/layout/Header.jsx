import { MenuIcon } from '../common/Icons';
import SiteSelect from './SiteSelect';
import LanguageToggle from './LanguageToggle';
import NotificationBell from './NotificationBell';
import Avatar from '../common/Avatar';
import { useAuth } from '../../hooks/useAuth';

export default function Header({ onOpenMobileMenu, onOpenAlerts, unread }) {
  const { user } = useAuth();
  return (
    <header className="flex h-[72px] shrink-0 items-center gap-3 bg-white px-4 shadow-[0_1px_0_#e4e7ea] md:px-6">
      <button
        type="button"
        onClick={onOpenMobileMenu}
        aria-label="Open menu"
        className="rounded-md p-1.5 hover:bg-page lg:hidden"
      >
        <MenuIcon />
      </button>

      <span className="hidden whitespace-nowrap text-[22px] font-medium sm:block">Crowd Solutions</span>
      <span className="hidden h-8 w-px bg-ink/70 sm:block" aria-hidden="true" />
      <SiteSelect />

      <div className="ml-auto flex items-center gap-2 md:gap-4">
        <LanguageToggle />
        <NotificationBell unread={unread} onClick={onOpenAlerts} />
        <span title={user?.name || user?.email}>
          <Avatar name={user?.name || user?.email || 'User'} size={44} />
        </span>
      </div>
    </header>
  );
}
