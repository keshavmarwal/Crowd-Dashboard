import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatClock, formatHourTick } from '../../utils/time';
import { hourlyTicks } from '../../utils/metrics';

const AXIS = { fill: '#6b7378', fontSize: 13 };
const AXIS_TITLE = { fill: '#1d2327', fontSize: 14, fontWeight: 500 };


function LiveBadge({ viewBox }) {
  if (!viewBox || viewBox.x == null) return null;
  const { x, y } = viewBox;
  return (
    <g>
      <rect x={x - 11} y={y - 38} width={22} height={50} rx={5} fill="#b42318" />
      <text
        transform={`translate(${x + 4}, ${y - 13}) rotate(-90)`}
        fill="#fff"
        fontSize="11"
        fontWeight="600"
        textAnchor="middle"
      >
        LIVE
      </text>
    </g>
  );
}

// points: [{ t, value }]  (value null = no data yet)
export default function OccupancyChart({ points, domain, timezone, nowUtc, height = 320 }) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 44, right: 16, bottom: 26, left: 8 }}>
          <defs>
            <linearGradient id="occFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7fb0ae" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#7fb0ae" stopOpacity={0.02} />
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
            formatter={(v) => [Math.round(v), 'Occupancy']}
            contentStyle={{ borderRadius: 8, border: '1px solid #e4e7ea' }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#7fb0ae"
            strokeWidth={2}
            fill="url(#occFill)"
            connectNulls={false}
            isAnimationActive={false}
          />
          {nowUtc != null && (
            <ReferenceLine x={nowUtc} stroke="#b42318" strokeWidth={2} strokeDasharray="3 3" label={<LiveBadge />} />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
