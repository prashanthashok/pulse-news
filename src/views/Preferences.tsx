import type { Preferences } from '../types'

interface ToggleProps {
  checked: boolean
  onChange: () => void
}

function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors"
      style={{ background: checked ? 'var(--accent)' : 'var(--surface2)' }}
    >
      <span
        className="inline-block h-4 w-4 rounded-full shadow transition-transform"
        style={{
          background: checked ? '#0a0a0f' : 'var(--muted)',
          transform: checked ? 'translateX(22px)' : 'translateX(4px)',
        }}
      />
    </button>
  )
}

interface SectionProps {
  title: string
  children: React.ReactNode
}

function Section({ title, children }: SectionProps) {
  return (
    <div className="mb-6">
      <h3
        className="px-4 mb-1 text-xs font-semibold tracking-widest uppercase"
        style={{ color: 'var(--muted)' }}
      >
        {title}
      </h3>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', margin: '0 16px' }}>
        {children}
      </div>
    </div>
  )
}

interface RowProps {
  label: string
  description?: string
  checked: boolean
  onChange: () => void
  last?: boolean
}

function Row({ label, description, checked, onChange, last }: RowProps) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3"
      style={!last ? { borderBottom: '1px solid var(--border)' } : undefined}
    >
      <div className="flex-1 mr-4">
        <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{label}</p>
        {description && (
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{description}</p>
        )}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  )
}

interface Props {
  prefs: Preferences
  onToggle: (key: keyof Preferences) => void
}

export function Preferences({ prefs, onToggle }: Props) {
  return (
    <div className="flex flex-col min-h-screen" style={{ paddingBottom: '72px' }}>
      <div
        className="sticky top-0 z-40 px-4 py-3"
        style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}
      >
        <h2
          className="text-xl font-black"
          style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text)' }}
        >
          Preferences
        </h2>
      </div>

      <div className="mt-6">
        <Section title="Content Filters">
          <Row
            label="Reduce political noise"
            description="Minimize partisan coverage unless globally significant"
            checked={prefs.reducePolitical}
            onChange={() => onToggle('reducePolitical')}
          />
          <Row
            label="Limit doom loops"
            description="Avoid repetitive crisis or negative content"
            checked={prefs.limitDoomLoops}
            onChange={() => onToggle('limitDoomLoops')}
          />
          <Row
            label="Include constructive news"
            description="At least one positive or solutions story per batch"
            checked={prefs.constructiveNews}
            onChange={() => onToggle('constructiveNews')}
          />
          <Row
            label="Balanced sourcing only"
            description="Non-partisan global sources"
            checked={prefs.balancedSourcing}
            onChange={() => onToggle('balancedSourcing')}
            last
          />
        </Section>

        <Section title="Focus Areas">
          <Row
            label="🇮🇳 India edition"
            checked={prefs.focusIndia}
            onChange={() => onToggle('focusIndia')}
          />
          <Row
            label="🇺🇸 US edition"
            checked={prefs.focusUS}
            onChange={() => onToggle('focusUS')}
          />
          <Row
            label="🔬 Science & Research"
            checked={prefs.focusScience}
            onChange={() => onToggle('focusScience')}
          />
          <Row
            label="🤖 AI & Tech"
            checked={prefs.focusAITech}
            onChange={() => onToggle('focusAITech')}
            last
          />
        </Section>

        <Section title="Sources">
          <div className="px-4 py-3">
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
              Reuters, BBC, The Guardian, NPR, AP News, Al Jazeera, DW, The Hindu, NDTV, The Wire,
              Axios, Wired, Ars Technica, Nature, ProPublica, The Atlantic
            </p>
          </div>
        </Section>

        <Section title="About">
          <div className="px-4 py-3 space-y-2">
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                style={{ background: '#5d8aff18', color: 'var(--accent2)', border: '1px solid #5d8aff30' }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--accent2)' }} />
                AI powered by Claude
              </span>
            </div>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              Pulse News uses Google Gemini AI to generate curated, plausible news briefings. All
              article bodies are AI-generated summaries — always verify at the original source.
            </p>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              Version 1.0.0 · Built with React + Vite
            </p>
          </div>
        </Section>
      </div>
    </div>
  )
}
