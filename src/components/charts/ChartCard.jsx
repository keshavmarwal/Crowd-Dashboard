export default function ChartCard({ title, right, children, className = '' }) {
  return (
    <section className={`rounded-xl bg-white p-6 ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="text-lg font-medium">{title}</h3>
        {right}
      </div>
      {children}
    </section>
  );
}
