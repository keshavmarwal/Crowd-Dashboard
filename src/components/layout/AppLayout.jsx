import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { FilterProvider } from '../../context/FilterContext';
import { RealtimeProvider } from '../../context/RealtimeContext';
import { useRealtime } from '../../hooks/useRealtime';
import AlertsPanel from './AlertsPanel';
import { useFilters } from '../../hooks/useFilters';
import Sidebar from './Sidebar';
import Header from './Header';
import ErrorState from '../common/ErrorState';

function Shell() {
  const { sitesQuery } = useFilters();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const { unread, markAllRead } = useRealtime();
  const { pathname } = useLocation();

  const closeAlerts = useCallback(() => {
    markAllRead(); // highlighted cards were seen
    setAlertsOpen(false);
  }, [markAllRead]);

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <div className="flex h-full bg-page">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapse={() => setCollapsed((v) => !v)}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onOpenMobileMenu={() => setMobileOpen(true)} onOpenAlerts={() => setAlertsOpen(true)} unread={unread} />
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-10 md:py-8">
          {sitesQuery.isPending ? (
            <p className="py-20 text-center text-muted" role="status">
              Loading sites…
            </p>
          ) : sitesQuery.isError ? (
            <ErrorState message="Couldn't load the list of sites." onRetry={() => sitesQuery.refetch()} />
          ) : (
            <Outlet />
          )}
        </main>
      </div>

      <AlertsPanel open={alertsOpen} onClose={closeAlerts} />
    </div>
  );
}

export default function AppLayout() {
  return (
    <FilterProvider>
      <RealtimeProvider>
        <Shell />
      </RealtimeProvider>
    </FilterProvider>
  );
}
