export default function ChartCard({ title, subtitle, action, height = 280, children, className = "" }) {
  return (
    <div className={`card p-5 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="mt-4" style={{ width: "100%", height }}>
        {children}
      </div>
    </div>
  );
}
