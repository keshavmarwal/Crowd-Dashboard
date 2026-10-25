import { createContext, useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSites } from '../api/sites';

export const FilterContext = createContext(null);
const SITE_KEY = 'cms_site';


export function FilterProvider({ children }) {
  const sitesQuery = useQuery({ queryKey: ['sites'], queryFn: getSites, staleTime: 10 * 60 * 1000 });
  const [storedSiteId, setStoredSiteId] = useState(() => {
    try {
      return localStorage.getItem(SITE_KEY);
    } catch {
      return null;
    }
  });
  const [dateKey, setDateKey] = useState('today'); // 'today' | 'YYYY-MM-DD'

  const sites = useMemo(() => sitesQuery.data ?? [], [sitesQuery.data]);
  const site = useMemo(
    () => sites.find((s) => s.siteId === storedSiteId) ?? sites[0] ?? null,
    [sites, storedSiteId]
  );

  const selectSite = useCallback((id) => {
    setStoredSiteId(id);
    setDateKey('today');
    try {
      localStorage.setItem(SITE_KEY, id);
    } catch {
     
    }
  }, []);

  const value = useMemo(
    () => ({
      sitesQuery,
      sites,
      site,
      siteId: site?.siteId ?? null,
      timezone: site?.timezone ?? null,
      selectSite,
      dateKey,
      setDateKey,
    }),
    [sitesQuery, sites, site, selectSite, dateKey]
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}
