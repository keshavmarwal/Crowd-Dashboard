import DateFilter from './DateFilter';

export default function PageHeader({ title }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-[28px] font-medium">{title}</h1>
      <DateFilter />
    </div>
  );
}
