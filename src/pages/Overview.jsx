import PageHeader from '../components/common/PageHeader';
import QueryBoundary from '../components/common/QueryBoundary';
import StatBlock from '../components/cards/StatBlock';
import ChartCard from '../components/charts/ChartCard';
import OccupancyChart from '../components/charts/OccupancyChart';
import DemographicsDonut from '../components/charts/DemographicsDonut';
import DemographicsArea, { Legend } from '../components/charts/DemographicsArea';
import { useFilters } from '../hooks/useFilters';
import { useRealtime } from '../hooks/useRealtime';
import { useDemographics, useDwell, useFootfall, useOccupancy } from '../hooks/useAnalytics';
import { buildGenderSeries, buildSeries, formatCount, genderShare, pctChange } from '../utils/metrics';
import { formatDwellLong } from '../utils/time';


function statProps(query, build) {
  if (query.isPending) return { state: 'loading' };
  if (query.isError) return { state: 'error', onRetry: () => query.refetch() };
  return { state: 'ready', ...build(query.data) };
}

export default function Overview() {
  const { timezone, dateKey } = useFilters();
  const occupancy = useOccupancy();
  const footfall = useFootfall();
  const dwell = useDwell();
  const demographics = useDemographics();
  const { liveOccupancy, liveUpdatedAt } = useRealtime();
  const compareLabel = dateKey === 'today' ? 'yesterday' : 'previous day';

  return (
    <>
      <PageHeader title="Overview" />

      <h2 className="mb-3 text-[22px] font-medium">Occupancy</h2>
      <div className="grid gap-5 lg:grid-cols-3">
        <section className="grid gap-6 rounded-xl bg-white p-6 sm:grid-cols-2 sm:gap-0 lg:col-span-2">
          <div className="sm:border-r sm:border-line sm:pr-6">
            <StatBlock
              title="Live Occupancy"
              compareLabel={compareLabel}
              {...statProps(occupancy, (d) => {
                // Socket value wins for today; the API bucket is the fallback.
                const live = d.nowUtc != null && liveOccupancy != null ? liveOccupancy : d.live;
                return { value: formatCount(live), pct: pctChange(live, d.livePrevious) };
              })}
            />
          </div>
          <div className="sm:pl-8">
            <StatBlock
              title="Today’s Footfall"
              compareLabel={compareLabel}
              {...statProps(footfall, (d) => ({
                value: formatCount(d.value),
                pct: pctChange(d.value, d.previous),
              }))}
            />
          </div>
        </section>

        <section className="rounded-xl bg-white p-6">
          <StatBlock
            title="Avg Dwell Time"
            compareLabel={compareLabel}
            {...statProps(dwell, (d) => ({
              value: formatDwellLong(d.value),
              pct: pctChange(d.value, d.previous),
            }))}
          />
        </section>
      </div>

      <ChartCard title="Overall Occupancy" className="mt-5" right={<span className="flex items-center gap-2 text-[15px] text-muted"><span className="h-2.5 w-2.5 rounded-full bg-[#7fb0ae]" />Occupancy</span>}>
        <QueryBoundary query={occupancy} height={320}>
          {(d) => {
            const useSocket = d.nowUtc != null && liveOccupancy != null;
            const live = useSocket ? liveOccupancy : d.live;
            // Move the LIVE marker forward as socket updates arrive.
            const nowUtc = useSocket ? Math.max(d.nowUtc, liveUpdatedAt ?? 0) : d.nowUtc;
            return (
              <OccupancyChart
                points={buildSeries(d.buckets, nowUtc, 'avg', live)}
                domain={d.domain}
                timezone={timezone}
                nowUtc={nowUtc}
              />
            );
          }}
        </QueryBoundary>
      </ChartCard>

      <h2 className="mb-3 mt-8 text-[22px] font-medium">Demographics</h2>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,12fr)]">
        <ChartCard title="Chart of Demographics">
          <QueryBoundary query={demographics} height={360}>
            {(d) => <DemographicsDonut share={genderShare(d.buckets, d.nowUtc)} />}
          </QueryBoundary>
        </ChartCard>

        <ChartCard title="Demographics Analysis" right={<Legend />}>
          <QueryBoundary query={demographics} height={300}>
            {(d) => (
              <DemographicsArea
                points={buildGenderSeries(d.buckets, d.nowUtc)}
                domain={d.domain}
                timezone={timezone}
              />
            )}
          </QueryBoundary>
        </ChartCard>
      </div>
    </>
  );
}
