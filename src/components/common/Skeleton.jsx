export default function Skeleton({ className = '', style }) {
  return <div className={`animate-pulse rounded-md bg-[#e9edef] ${className}`} style={style} aria-hidden="true" />;
}
