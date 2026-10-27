const SOURCE_COLORS: Record<string, string> = {
  BBC: '#ff6b6b',
  'The Guardian': '#3ec9c9',
  NPR: '#5d8aff',
  'Al Jazeera': '#3ec9c9',
  DW: '#4dd6a0',
  'The Hindu': '#e8c547',
  NDTV: '#ff6b6b',
  'Ars Technica': '#ff8fa3',
  Wired: '#aaaacc',
  Nature: '#4dd6a0',
  NASA: '#5d8aff',
  'Space.com': '#aaaacc',
  'Inside Climate News': '#4dd6a0',
  Reuters: '#4dd6a0',
  'AP News': '#8888aa',
}

const FALLBACK = '#8888aa'

interface Props {
  source: string
  small?: boolean
}

export function SourceBadge({ source, small }: Props) {
  const color = SOURCE_COLORS[source] ?? FALLBACK
  return (
    <span
      className={`inline-flex items-center rounded-sm font-medium tracking-wide ${small ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'}`}
      style={{ color, background: `${color}18`, border: `1px solid ${color}30` }}
    >
      {source}
    </span>
  )
}
