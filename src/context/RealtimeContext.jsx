import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFilters } from '../hooks/useFilters';
import { createSocket } from '../socket/socket';
import { MAX_ALERTS, applyLive, liveTotal, normalizeAlerts, normalizeLive, zoneIndex } from '../utils/realtime';

export const RealtimeContext = createContext(null);


const DEBUG = Boolean(import.meta.env?.DEV) || import.meta.env?.VITE_SOCKET_DEBUG === 'true';


export function RealtimeProvider({ children }) {
  const { token } = useAuth();
  const { sites, site, siteId } = useFilters();

  const [status, setStatus] = useState('connecting'); 
  const [alerts, setAlerts] = useState([]); 
  const [live, setLive] = useState({}); 

  const zonesRef = useRef({});
  const siteIdRef = useRef(siteId);
  useEffect(() => {
    zonesRef.current = zoneIndex(sites);
  }, [sites]);
  useEffect(() => {
    siteIdRef.current = siteId;
  }, [siteId]);

  useEffect(() => {
    if (!token) return undefined;
    const socket = createSocket(token);
    const logged = { alert: 0, live_occupancy: 0 };
    const debug = (name, raw) => {
      if (DEBUG && logged[name] < 8) {
        logged[name] += 1;
        console.info(`[socket] ${name}`, raw);
      }
    };

    const onAlert = (raw) => {
      debug('alert', raw);
      const items = normalizeAlerts(raw, zonesRef.current);
      if (items.length) setAlerts((prev) => [...items, ...prev].slice(0, MAX_ALERTS));
    };
    const onLive = (raw) => {
      debug('live_occupancy', raw);
      const items = normalizeLive(raw, siteIdRef.current);
      if (items.length) setLive((prev) => applyLive(prev, items));
      else if (DEBUG) console.warn('[socket] live_occupancy: no count found in payload', raw);
    };

    socket.on('connect', () => setStatus('connected'));
    socket.on('disconnect', () => setStatus('disconnected'));
    socket.on('connect_error', (err) => {
      setStatus('error');
      if (DEBUG) console.warn('[socket] connect_error:', err.message); 
    });
    socket.on('alert', onAlert);
    socket.on('live_occupancy', onLive);

    return () => {
      socket.off('alert', onAlert);
      socket.off('live_occupancy', onLive);
      socket.disconnect();
    };
  }, [token]);

  const markAllRead = useCallback(() => {
    setAlerts((prev) => (prev.some((a) => !a.read) ? prev.map((a) => (a.read ? a : { ...a, read: true })) : prev));
  }, []);

  const siteAlerts = useMemo(() => alerts.filter((a) => !a.siteId || a.siteId === siteId), [alerts, siteId]);
  const unread = useMemo(() => siteAlerts.filter((a) => !a.read).length, [siteAlerts]);

  const zoneIds = useMemo(() => (site?.zones ?? []).map((z) => z.zoneId), [site]);
  const liveEntry = live[siteId];
  const liveOccupancy = useMemo(() => liveTotal(liveEntry, zoneIds), [liveEntry, zoneIds]);

  const value = useMemo(
    () => ({
      status,
      siteAlerts,
      unread,
      markAllRead,
      liveOccupancy, 
      liveUpdatedAt: liveOccupancy != null ? liveEntry.updatedAt : null,
    }),
    [status, siteAlerts, unread, markAllRead, liveOccupancy, liveEntry]
  );

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
}
