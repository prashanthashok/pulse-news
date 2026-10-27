function Line({ width, height = '0.75rem' }: { width: number; height?: string }) {
  return (
    <div
      className="animate-pulse rounded"
      style={{ height, width: `${width}%`, background: 'var(--surface2)' }}
    />
  )
}

export function FeedSkeleton({ featured = true }: { featured?: boolean }) {
  return (
    <div className="px-4 mt-4" aria-hidden="true">
      {featured && (
        <div
          className="rounded-2xl p-5 mb-4 space-y-3"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <Line width={30} />
          <Line width={90} height="1.1rem" />
          <Line width={70} height="1.1rem" />
          <Line width={100} />
          <Line width={60} />
        </div>
      )}
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-2 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <Line width={40} />
          <Line width={90} height="1rem" />
          <Line width={75} />
        </div>
      ))}
    </div>
  )
}
