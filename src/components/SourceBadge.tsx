const SOURCE_COLORS: Record<string, string> = {
  Reuters: '#4dd6a0',
  BBC: '#ff6b6b',
  'The Guardian': '#3ec9c9',
  NPR: '#5d8aff',
  'AP News': '#8888aa',
  'The Hindu': '#e8c547',
  Wired: '#aaaacc',
  Nature: '#4dd6a0',
  'Ars Technica': '#ff8fa3',
  'Al Jazeera': '#3ec9c9',
  DW: '#4dd6a0',
  NDTV: '#ff6b6b',
  'The Wire': '#5d8aff',
  'Hindustan Times': '#e8c547',
  'Scroll.in': '#3ec9c9',
  Axios: '#ff8fa3',
  ProPublica: '#5d8aff',
  'The Atlantic': '#aaaacc',
}

function getColor(source: string): string {
  return SOURCE_COLORS[source] ?? '#7777aa'
}

interface Props {
  source: string
  small?: boolean
}

export function SourceBadge({ source, small }: Props) {
  const color = getColor(source)
  return (
    <span
      className={`inline-flex items-center rounded-sm font-medium tracking-wide ${small ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'}`}
      style={{
        color,
        background: `${color}18`,
        border: `1px solid ${color}30`,
      }}
    >
      {source}
    </span>
  )
}
