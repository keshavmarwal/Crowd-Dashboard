import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { PersonIcon } from '../common/Icons';
import { FEMALE_COLOR, MALE_COLOR } from './DemographicsArea';


export default function DemographicsDonut({ share }) {
  const data = share
    ? [
        { name: 'Male', value: share.male },
        { name: 'Female', value: share.female },
      ]
    : [{ name: 'No data', value: 1 }];
  const colors = share ? [MALE_COLOR, FEMALE_COLOR] : ['#e4e7ea'];

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative h-[230px] w-[230px]" role="img" aria-label={share ? `${share.malePct}% male, ${share.femalePct}% female` : 'No demographic data yet'}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius="64%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
              paddingAngle={share ? 3 : 0}
              cornerRadius={share ? 10 : 0}
              stroke="none"
              isAnimationActive={false}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm text-muted">Total Crowd</span>
          <span className="text-2xl font-semibold">{share ? '100%' : '--'}</span>
        </div>
      </div>

      <ul className="flex flex-col gap-3 self-start text-[17px]">
        <li className="flex items-center gap-3">
          <PersonIcon style={{ color: MALE_COLOR }} />
          <span className="font-medium">{share ? `${share.malePct}%` : '--'} Males</span>
        </li>
        <li className="flex items-center gap-3">
          <PersonIcon female style={{ color: FEMALE_COLOR }} />
          <span className="font-medium">{share ? `${share.femalePct}%` : '--'} Females</span>
        </li>
      </ul>
    </div>
  );
}
