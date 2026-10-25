// Pure functions that turn API responses into what the UI shows. No React here,
// so they are easy to test.

export function pctChange(current, previous) {
  if (current == null || previous == null || previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

export const formatCount = (n) => (n == null ? '--' : Math.round(n).toLocaleString('en-US'));

export const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

// Hourly buckets -> chart points. Buckets in the future are returned as null so the
// line stops at "now" (the API sends 0 for hours that have not happened yet).
// `liveValue` extends the line to the LIVE marker.
export function buildSeries(buckets, nowUtc, valueKey, liveValue = null) {
  if (nowUtc == null) return buckets.map((b) => ({ t: b.utc, value: b[valueKey] }));
  const past = buckets.filter((b) => b.utc <= nowUtc).map((b) => ({ t: b.utc, value: b[valueKey] }));
  const future = buckets.filter((b) => b.utc > nowUtc).map((b) => ({ t: b.utc, value: null }));
  const live = liveValue != null && (past.length === 0 || past[past.length - 1].t < nowUtc);
  return [...past, ...(live ? [{ t: nowUtc, value: liveValue }] : []), ...future];
}

// Two-series version for demographics (male / female).
export function buildGenderSeries(buckets, nowUtc) {
  return buckets.map((b) => {
    const future = nowUtc != null && b.utc > nowUtc;
    return { t: b.utc, male: future ? null : b.male, female: future ? null : b.female };
  });
}

// Male/female split (whole percentages that always add up to 100).
export function genderShare(buckets, nowUtc) {
  const used = nowUtc == null ? buckets : buckets.filter((b) => b.utc <= nowUtc);
  const male = used.reduce((s, b) => s + (b.male || 0), 0);
  const female = used.reduce((s, b) => s + (b.female || 0), 0);
  const total = male + female;
  if (total === 0) return null;
  const malePct = Math.round((male / total) * 100);
  return { male, female, malePct, femalePct: 100 - malePct };
}

// Current occupancy taken from the hourly buckets (the socket `live_occupancy` event
// will override this later). Returns the value and the same hour on the previous day.
export function liveFromBuckets(buckets, previousBuckets, nowUtc) {
  let idx = -1;
  if (nowUtc != null) {
    for (let i = 0; i < buckets.length; i++) if (buckets[i].utc <= nowUtc) idx = i;
  } else {
    for (let i = 0; i < buckets.length; i++) if (buckets[i].avg > 0) idx = i;
  }
  if (idx < 0) return { live: null, livePrevious: null };
  return { live: buckets[idx].avg, livePrevious: previousBuckets?.[idx]?.avg ?? null };
}

export function hourlyTicks(fromUtc, toUtc, stepHours = 2) {
  const ticks = [];
  for (let t = fromUtc; t <= toUtc; t += stepHours * 3600000) ticks.push(t);
  return ticks;
}

// 1 2 3 … 12   |   1 … 4 5 6 … 12   |   1 … 10 11 12
export function getPageItems(current, total) {
  if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, '…', total];
  if (current >= total - 2) return [1, '…', total - 2, total - 1, total];
  return [1, '…', current - 1, current, current + 1, '…', total];
}
