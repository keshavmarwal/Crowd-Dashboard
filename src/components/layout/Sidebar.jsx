import { NavLink } from 'react-router-dom';
import Logo from '../common/Logo';
import { EntriesIcon, HomeIcon, LogoutIcon, MenuIcon } from '../common/Icons';
import { useAuth } from '../../hooks/useAuth';

const NAV = [
  { to: '/', label: 'Overview', Icon: HomeIcon, end: true },
  { to: '/entries', label: 'Crowd Entries', Icon: EntriesIcon },
];

export default function Sidebar({ collapsed, mobileOpen, onToggleCollapse, onCloseMobile }) {
  const { logout } = useAuth();
  const hideLabel = collapsed ? 'lg:hidden' : '';

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onCloseMobile} aria-hidden="true" />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col text-white transition-[width,transform] duration-200 lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'lg:w-[84px]' : 'lg:w-[280px]'}`}
        style={{
          background:
            'linear-gradient(180deg, #262b2c 0%, #265a58 42%, #255251 70%, #292e2f 100%)',
        }}
      >
        <div className={`flex h-[72px] items-center px-5 ${collapsed ? 'lg:justify-center' : 'justify-between'}`}>
          <Logo compact={collapsed} className={collapsed ? 'lg:[&>svg]:h-8' : ''} />
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label="Toggle sidebar"
            className={`rounded-md p-1.5 text-white/90 hover:bg-white/10 ${collapsed ? 'lg:hidden' : ''}`}
          >
            <MenuIcon />
          </button>
        </div>

        {collapsed && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label="Expand sidebar"
            className="mx-auto mb-2 hidden rounded-md p-1.5 text-white/90 hover:bg-white/10 lg:block"
          >
            <MenuIcon />
          </button>
        )}

        <nav className="mt-3 flex flex-col gap-2 px-3" aria-label="Main">
          {NAV.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onCloseMobile}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `relative flex items-center gap-4 rounded-lg px-4 py-3.5 text-[17px] transition-colors ${
                  isActive ? 'bg-white/25' : 'hover:bg-white/10'
                } ${collapsed ? 'lg:justify-center lg:px-0' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute -left-3 top-2 bottom-2 w-1 rounded-r bg-white" />}
                  <Icon />
                  <span className={hideLabel}>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto px-3 pb-5">
          <button
            type="button"
            onClick={logout}
            title={collapsed ? 'Logout' : undefined}
            className={`flex w-full items-center gap-4 rounded-lg px-4 py-3.5 text-[17px] hover:bg-white/10 ${
              collapsed ? 'lg:justify-center lg:px-0' : ''
            }`}
          >
            <LogoutIcon />
            <span className={hideLabel}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
