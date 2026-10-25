import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatClock, formatHourTick } from '../../utils/time';
import { hourlyTicks } from '../../utils/metrics';

export const MALE_COLOR = '#8bb0ae';
export const FEMALE_COLOR = '#bde0e0';
const AXIS = { fill: '#6b7378', fontSize: 13 };
const AXIS_TITLE = { fill: '#1d2327', fontSize: 14, fontWeight: 500 };

export function Legend() {
  return (
    <div className="flex items-center gap-4 text-[15px] text-muted">
      <span className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: MALE_COLOR }} /> Male
      </span>
      <span className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: FEMALE_COLOR }} /> Female
      </span>
    </div>
  );
}


export default function DemographicsArea({ points, domain, timezone, height = 300 }) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 10, right: 16, bottom: 26, left: 8 }}>
          <defs>
            <linearGradient id="maleFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={MALE_COLOR} stopOpacity={0.3} />
              <stop offset="100%" stopColor={MALE_COLOR} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="femaleFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={FEMALE_COLOR} stopOpacity={0.35} />
              <stop offset="100%" stopColor={FEMALE_COLOR} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e7ea" />
          <XAxis
            dataKey="t"
            type="number"
            domain={domain}
            ticks={hourlyTicks(domain[0], domain[1], 2)}
            tickFormatter={(t) => formatHourTick(t, timezone)}
            tickLine={false}
            axisLine={{ stroke: '#d5d9dc' }}
            tick={AXIS}
            label={{ value: 'Time', position: 'insideBottom', offset: -16, ...AXIS_TITLE }}
          />
          <YAxis
            allowDecimals={false}
            domain={[0, 'auto']}
            tickLine={false}
            axisLine={false}
            width={52}
            tick={AXIS}
            label={{ value: 'Count', angle: -90, position: 'insideLeft', offset: 4, ...AXIS_TITLE }}
          />
          <Tooltip
            labelFormatter={(t) => formatClock(t, timezone)}
            formatter={(v, name) => [Math.round(v), name]}
            contentStyle={{ borderRadius: 8, border: '1px solid #e4e7ea' }}
          />
          <Area type="monotone" dataKey="male" name="Male" stroke={MALE_COLOR} strokeWidth={2} fill="url(#maleFill)" connectNulls={false} isAnimationActive={false} />
          <Area type="monotone" dataKey="female" name="Female" stroke="#a8d4d4" strokeWidth={2} fill="url(#femaleFill)" connectNulls={false} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
