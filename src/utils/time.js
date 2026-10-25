// ---- Timezone helpers -------------------------------------------------------
// The API wants fromUtc/toUtc as UTC epoch millis. "Today" must be the calendar
// day of the SITE's timezone (e.g. Asia/Tokyo), never the browser's timezone.

const fmtCache = new Map();
function getFormatter(key, timeZone, options) {
  const k = `${key}|${timeZone}`;
  if (!fmtCache.has(k)) fmtCache.set(k, new Intl.DateTimeFormat('en-US', { timeZone, ...options }));
  return fmtCache.get(k);
}

function tzOffsetMs(utcMs, timeZone) {
  const f = getFormatter('parts', timeZone, {
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const p = Object.fromEntries(f.formatToParts(new Date(utcMs)).map((x) => [x.type, x.value]));
  const asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  return asUtc - Math.floor(utcMs / 1000) * 1000;
}

// UTC millis of 00:00:00.000 on a calendar day in `timeZone`.
function zonedStartOfDay(y, m, d, timeZone) {
  const guess = Date.UTC(y, m - 1, d);
  const first = guess - tzOffsetMs(guess, timeZone);
  return guess - tzOffsetMs(first, timeZone); // second pass handles DST edges
}

// Whole calendar day (y-m-d may overflow, e.g. d = 0 means "day before the 1st").
function dayRangeForYmd(timeZone, y, m, d) {
  const a = new Date(Date.UTC(y, m - 1, d));
  const b = new Date(Date.UTC(y, m - 1, d + 1));
  return {
    fromUtc: zonedStartOfDay(a.getUTCFullYear(), a.getUTCMonth() + 1, a.getUTCDate(), timeZone),
    toUtc: zonedStartOfDay(b.getUTCFullYear(), b.getUTCMonth() + 1, b.getUTCDate(), timeZone) - 1,
  };
}

export function parseYmd(str) {
  const [y, m, d] = str.split('-').map(Number);
  return { y, m, d };
}

// 'YYYY-MM-DD' of "now" in the site's timezone.
export function todayYmd(timeZone, now = Date.now()) {
  const p = Object.fromEntries(
    getFormatter('ymd', timeZone, { year: 'numeric', month: '2-digit', day: '2-digit' })
      .formatToParts(new Date(now))
      .map((x) => [x.type, x.value])
  );
  return `${p.year}-${p.month}-${p.day}`;
}

// dayOffset: 0 = today, -1 = yesterday ...
export function getDayRange(timeZone, dayOffset = 0, now = Date.now()) {
  const { y, m, d } = parseYmd(todayYmd(timeZone, now));
  return dayRangeForYmd(timeZone, y, m, d + dayOffset);
}

/**
 * Everything a dashboard query needs for the selected date.
 * dateKey: 'today' or 'YYYY-MM-DD'.
 * For "today" the comparison window is yesterday up to the SAME time of day,
 * otherwise a half-finished day would always look "less busy" than a full one.
 */
export function getRanges(timeZone, dateKey = 'today', now = Date.now()) {
  const today = todayYmd(timeZone, now);
  const key = dateKey === 'today' ? today : dateKey;
  const isToday = key === today;
  const { y, m, d } = parseYmd(key);
  const current = dayRangeForYmd(timeZone, y, m, d);
  const prevFull = dayRangeForYmd(timeZone, y, m, d - 1);
  const previous = isToday
    ? { fromUtc: prevFull.fromUtc, toUtc: prevFull.fromUtc + (now - current.fromUtc) }
    : prevFull;
  return { current, previous, isToday, nowUtc: isToday ? now : null };
}

// ---- Formatting -------------------------------------------------------------
const pad = (n) => String(n).padStart(2, '0');

// 8.5 -> "08min 30sec"  (dashboard card)
export function formatDwellLong(minutes) {
  if (minutes == null || Number.isNaN(minutes)) return '--';
  const totalSec = Math.round(minutes * 60);
  return `${pad(Math.floor(totalSec / 60))}min ${pad(totalSec % 60)}sec`;
}

// 20 -> "00:20"  (entries table, HH:MM like the design)
export function formatDwellClock(minutes) {
  if (minutes == null || Number.isNaN(minutes)) return '--';
  const total = Math.round(minutes);
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
}

// "07:56 PM" in the site's timezone. NOTE: never use the API's `entryLocal` /
// `exitLocal` strings - they are actually UTC. Format from entryUtc instead.
export function formatClock(utcMs, timeZone) {
  if (utcMs == null) return '--';
  return getFormatter('clock', timeZone, { hour: '2-digit', minute: '2-digit', hour12: true }).format(
    new Date(utcMs)
  );
}

// "8:00" (axis tick) in the site's timezone.
export function formatHourTick(utcMs, timeZone) {
  const p = Object.fromEntries(
    getFormatter('tick', timeZone, { hourCycle: 'h23', hour: 'numeric', minute: '2-digit' })
      .formatToParts(new Date(utcMs))
      .map((x) => [x.type, x.value])
  );
  return `${Number(p.hour)}:${p.minute}`;
}

// "25 Oct 2026" from a 'YYYY-MM-DD' key.
export function formatDateLabel(ymd) {
  const { y, m, d } = parseYmd(ymd);
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'UTC',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

// "October 25 2026" (alert card date, as in the design)
export function formatAlertDate(utcMs, timeZone) {
  const p = Object.fromEntries(
    getFormatter('alertDate', timeZone, { month: 'long', day: '2-digit', year: 'numeric' })
      .formatToParts(new Date(utcMs))
      .map((x) => [x.type, x.value])
  );
  return `${p.month} ${p.day} ${p.year}`;
}

// "19:56" (24h)
export function formatTime24(utcMs, timeZone) {
  const p = Object.fromEntries(
    getFormatter('time24', timeZone, { hourCycle: 'h23', hour: '2-digit', minute: '2-digit' })
      .formatToParts(new Date(utcMs))
      .map((x) => [x.type, x.value])
  );
  return `${p.hour}:${p.minute}`;
}
