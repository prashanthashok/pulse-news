interface Props {
  loading: boolean
}

export function ProgressBar({ loading }: Props) {
  return (
    <div className="h-[2px] w-full overflow-hidden" style={{ background: 'var(--border)' }}>
      {loading && (
        <div
          className="h-full w-1/3 rounded-full animate-progress"
          style={{ background: 'var(--accent)' }}
        />
      )}
    </div>
  )
}
