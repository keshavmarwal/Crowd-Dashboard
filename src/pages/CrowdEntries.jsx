import { useEffect, useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import EntriesTable from '../components/entries/EntriesTable';
import Pagination from '../components/common/Pagination';
import ErrorState from '../components/common/ErrorState';
import { useFilters } from '../hooks/useFilters';
import { useEntries } from '../hooks/useAnalytics';

const PAGE_SIZE = 10;

export default function CrowdEntries() {
  const { siteId, dateKey, timezone } = useFilters();
  const [page, setPage] = useState(1);

  
  useEffect(() => setPage(1), [siteId, dateKey]);

  const query = useEntries(page, PAGE_SIZE);
  const records = query.data?.records ?? [];
  const totalPages = query.data?.totalPages ?? 0;

  return (
    <>
      <PageHeader title="Crowd Entries" />

      {query.isError && !query.data ? (
        <ErrorState message="Couldn't load entries." onRetry={() => query.refetch()} />
      ) : (
        <>
          <EntriesTable
            records={records}
            timezone={timezone}
            loading={query.isPending}
            fetching={query.isPlaceholderData}
          />
          {!query.isPending && records.length === 0 && (
            <p className="mt-6 text-center text-muted">No entries recorded for this day.</p>
          )}
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={(p) => {
              setPage(p);
              window.scrollTo?.({ top: 0 });
            }}
          />
        </>
      )}
    </>
  );
}
