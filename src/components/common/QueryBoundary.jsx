import Skeleton from './Skeleton';
import ErrorState from './ErrorState';

export default function QueryBoundary({ query, height = 280, children }) {
  if (query.isPending) return <Skeleton className="w-full" style={{ height }} />;
  if (query.isError) return <ErrorState height={height} onRetry={() => query.refetch()} />;
  return children(query.data);
}
