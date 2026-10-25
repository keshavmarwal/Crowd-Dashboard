import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getDemographics, getDwell, getEntryExit, getFootfall, getOccupancy } from '../api/analytics';
import { useFilters } from './useFilters';
import { getRanges } from '../utils/time';
import { liveFromBuckets } from '../utils/metrics';

const REFRESH_MS = 60_000;


const optional = (promise) => promise.catch(() => null);

function useBase() {
  const { siteId, timezone, dateKey } = useFilters();
  return {
    siteId,
    timezone,
    dateKey,
    enabled: Boolean(siteId && timezone),
    refetchInterval: dateKey === 'today' ? REFRESH_MS : false,
  };
}

export function useFootfall() {
  const { siteId, timezone, dateKey, enabled, refetchInterval } = useBase();
  return useQuery({
    queryKey: ['footfall', siteId, dateKey],
    enabled,
    refetchInterval,
    queryFn: async () => {
      const r = getRanges(timezone, dateKey);
      const [cur, prev] = await Promise.all([
        getFootfall({ siteId, ...r.current }),
        optional(getFootfall({ siteId, ...r.previous })),
      ]);
      return { value: cur.footfall, previous: prev?.footfall ?? null };
    },
  });
}

export function useDwell() {
  const { siteId, timezone, dateKey, enabled, refetchInterval } = useBase();
  return useQuery({
    queryKey: ['dwell', siteId, dateKey],
    enabled,
    refetchInterval,
    queryFn: async () => {
      const r = getRanges(timezone, dateKey);
      const [cur, prev] = await Promise.all([
        getDwell({ siteId, ...r.current }),
        optional(getDwell({ siteId, ...r.previous })),
      ]);
      return { value: cur.avgDwellMinutes, previous: prev?.avgDwellMinutes ?? null };
    },
  });
}

export function useOccupancy() {
  const { siteId, timezone, dateKey, enabled, refetchInterval } = useBase();
  return useQuery({
    queryKey: ['occupancy', siteId, dateKey],
    enabled,
    refetchInterval,
    queryFn: async () => {
      const r = getRanges(timezone, dateKey);
      const [cur, prev] = await Promise.all([
        getOccupancy({ siteId, ...r.current }),
        optional(getOccupancy({ siteId, ...r.previous })),
      ]);
      const { live, livePrevious } = liveFromBuckets(cur.buckets, prev?.buckets, r.nowUtc);
      return {
        buckets: cur.buckets,
        domain: [r.current.fromUtc, r.current.toUtc + 1],
        nowUtc: r.nowUtc,
        live,
        livePrevious,
      };
    },
  });
}

export function useDemographics() {
  const { siteId, timezone, dateKey, enabled, refetchInterval } = useBase();
  return useQuery({
    queryKey: ['demographics', siteId, dateKey],
    enabled,
    refetchInterval,
    queryFn: async () => {
      const r = getRanges(timezone, dateKey);
      const cur = await getDemographics({ siteId, ...r.current });
      return { buckets: cur.buckets, domain: [r.current.fromUtc, r.current.toUtc + 1], nowUtc: r.nowUtc };
    },
  });
}

export function useEntries(page, pageSize = 10) {
  const { siteId, timezone, dateKey, enabled } = useBase();
  return useQuery({
    queryKey: ['entries', siteId, dateKey, page, pageSize],
    enabled,
    placeholderData: keepPreviousData, 
    refetchInterval: dateKey === 'today' && page === 1 ? 30_000 : false,
    queryFn: () => {
      const r = getRanges(timezone, dateKey);
      return getEntryExit({ siteId, ...r.current, pageSize, pageNumber: page });
    },
  });
}
