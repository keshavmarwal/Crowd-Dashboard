// Turns raw Socket.IO payloads into the small shapes the UI needs.
// The docs only describe the payloads in words ("action type, zone, site, severity"),
// so these helpers accept several likely field names. Once real payload samples are
// known, tighten them here - nothing else in the app needs to change.

export const SITE_KEY = '__site__';
export const MAX_ALERTS = 100;
let seq = 0;

const pick = (obj, keys) => {
  for (const k of keys) {
    const v = obj?.[k];
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return undefined;
};

const asId = (v) => {
  if (v == null) return undefined;
  if (typeof v === 'object') return asId(v.siteId ?? v.zoneId ?? v.id);
  return String(v);
};

function toMillis(v, fallback) {
  if (v == null || v === '') return fallback;
  const n = typeof v === 'number' ? v : Number(v);
  if (!Number.isNaN(n)) return n < 1e12 ? n * 1000 : n; // seconds -> ms
  const d = Date.parse(v);
  return Number.isNaN(d) ? fallback : d;
}

// Payload may be an object, an array of objects, or wrapped as { data: ... }.
function unwrap(raw) {
  if (Array.isArray(raw)) return raw.flatMap(unwrap);
  if (raw && typeof raw === 'object') {
    const inner = raw.data ?? raw.payload;
    if (inner && typeof inner === 'object') return unwrap(inner);
    return [raw];
  }
  return [];
}

// zoneId -> { name, level, siteId } built from GET /api/sites
export function zoneIndex(sites = []) {
  const map = {};
  for (const s of sites) {
    for (const z of s.zones ?? []) map[z.zoneId] = { name: z.name, level: z.securityLevel, siteId: s.siteId };
  }
  return map;
}

// ---- `alert` event ----------------------------------------------------------
function normalizeAlert(raw, zones, now) {
  const zoneObj = raw.zone && typeof raw.zone === 'object' ? raw.zone : null;
  const zoneId = asId(raw.zoneId ?? zoneObj?.zoneId ?? zoneObj?.id);
  const known = zoneId ? zones[zoneId] : undefined;

  const action = String(pick(raw, ['action', 'actionType', 'type', 'eventType', 'event']) ?? '').toLowerCase();
  const kind = /exit|leav|out/.test(action) ? 'exit' : /ent|in/.test(action) ? 'entry' : null;

  const severityRaw = String(pick(raw, ['severity', 'level', 'securityLevel']) ?? known?.level ?? '').toLowerCase();
  const severity = ['high', 'medium', 'low'].includes(severityRaw) ? severityRaw : null;

  const personRaw = pick(raw, ['personName', 'name', 'visitorName']) ?? raw.person?.name ?? raw.person;
  const person = typeof personRaw === 'string' ? personRaw : undefined;

  const ts = toMillis(
    pick(raw, ['timestamp', 'ts', 'time', 'utc', 'eventUtc', 'entryUtc', 'exitUtc', 'createdAt']),
    now
  );

  const title = person
    ? kind === 'exit'
      ? `${person} Exited`
      : kind === 'entry'
        ? `${person} Entered`
        : `${person} detected`
    : kind === 'exit'
      ? 'Exit detected'
      : kind === 'entry'
        ? 'Entry detected'
        : 'Movement detected';

  return {
    id: `${ts}-${++seq}`,
    kind,
    title,
    zoneId,
    zoneName: pick(raw, ['zoneName']) ?? zoneObj?.name ?? (typeof raw.zone === 'string' ? raw.zone : undefined) ?? known?.name ?? zoneId ?? '',
    siteId: asId(raw.siteId ?? raw.site) ?? known?.siteId,
    severity,
    ts,
    read: false,
  };
}

// Newest first.
export function normalizeAlerts(raw, zones = {}, now = Date.now()) {
  return unwrap(raw)
    .map((r) => normalizeAlert(r, zones, now))
    .sort((a, b) => b.ts - a.ts);
}

// ---- `live_occupancy` event -------------------------------------------------
const COUNT_KEYS = ['count', 'occupancy', 'liveOccupancy', 'currentOccupancy', 'currentCount', 'total', 'value'];

function toItem(r, fallbackSiteId, now) {
  const count = pick(r, COUNT_KEYS);
  if (typeof count !== 'number' || Number.isNaN(count)) return null;
  const zoneObj = r.zone && typeof r.zone === 'object' ? r.zone : null;
  return {
    siteId: asId(r.siteId ?? r.site) ?? fallbackSiteId,
    zoneId: asId(r.zoneId ?? zoneObj?.zoneId ?? zoneObj?.id),
    count,
    ts: toMillis(pick(r, ['timestamp', 'ts', 'time', 'utc']), now),
  };
}

// -> [{ siteId, zoneId|undefined, count, ts }]
export function normalizeLive(raw, fallbackSiteId, now = Date.now()) {
  const out = [];
  for (const r of unwrap(raw)) {
    if (Array.isArray(r.zones)) {
      const siteId = asId(r.siteId ?? r.site) ?? fallbackSiteId;
      for (const z of r.zones) {
        const it = toItem({ ...z, siteId: z.siteId ?? siteId }, siteId, now);
        if (it) out.push(it);
      }
    } else {
      const it = toItem(r, fallbackSiteId, now);
      if (it) out.push(it);
    }
  }
  return out;
}

// state: { [siteId]: { zones: { [zoneId | SITE_KEY]: count }, updatedAt } }
export function applyLive(prev, items) {
  const next = { ...prev };
  for (const it of items) {
    if (!it.siteId) continue;
    const cur = next[it.siteId] ?? { zones: {}, updatedAt: 0 };
    next[it.siteId] = {
      zones: { ...cur.zones, [it.zoneId ?? SITE_KEY]: it.count },
      updatedAt: Math.max(cur.updatedAt, it.ts),
    };
  }
  return next;
}

// Site total. Uses a site-level number if the server sends one, otherwise the sum of
// ALL the site's zones. Until every zone has reported at least once we return null
// (the UI then keeps showing the API value) so a half-filled sum is never shown.
export function liveTotal(entry, zoneIds = []) {
  if (!entry) return null;
  if (entry.zones[SITE_KEY] != null) return entry.zones[SITE_KEY];
  if (!zoneIds.length || !zoneIds.every((id) => entry.zones[id] != null)) return null;
  return zoneIds.reduce((sum, id) => sum + entry.zones[id], 0);
}
