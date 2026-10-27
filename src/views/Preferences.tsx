import { useState, type ReactNode } from 'react'
import { IconPlus, IconX } from '@tabler/icons-react'
import type { Preferences as Prefs } from '../types'
import { SOURCES } from '../data/sources'
import { SourceBadge } from '../components/SourceBadge'

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
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

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <div className="mb-6">
      <h3
        className="mb-1 px-4 text-xs font-semibold uppercase tracking-widest"
        style={{ color: 'var(--muted)' }}
      >
        {title}
      </h3>
      {hint && (
        <p className="mb-2 px-4 text-xs" style={{ color: 'var(--muted)' }}>
          {hint}
        </p>
      )}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          margin: '0 16px',
        }}
      >
        {children}
      </div>
    </div>
  )
}

interface Props {
  prefs: Prefs
  onToggleSource: (name: string) => void
  onAddMutedWord: (word: string) => void
  onRemoveMutedWord: (word: string) => void
}

export function Preferences({ prefs, onToggleSource, onAddMutedWord, onRemoveMutedWord }: Props) {
  const [word, setWord] = useState('')

  const submit = () => {
    onAddMutedWord(word)
    setWord('')
  }

  return (
    <div className="flex min-h-screen flex-col" style={{ paddingBottom: '72px' }}>
      <div
        className="sticky top-0 z-40 px-4 py-3"
        style={{
          background: 'var(--bg)',
          borderBottom: '1px solid var(--border)',
          paddingTop: 'max(0.75rem, env(safe-area-inset-top))',
        }}
      >
        <h2
          className="text-xl font-black"
          style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text)' }}
        >
          Preferences
        </h2>
      </div>

      <div className="mt-6">
        <Section title="Sources" hint="Turn off any publisher you don't want in your feed.">
          {SOURCES.map((name, i) => {
            const enabled = !prefs.disabledSources.includes(name)
            return (
              <div
                key={name}
                className="flex items-center justify-between px-4 py-3"
                style={i < SOURCES.length - 1 ? { borderBottom: '1px solid var(--border)' } : undefined}
              >
                <SourceBadge source={name} />
                <Toggle checked={enabled} onChange={() => onToggleSource(name)} label={`Show ${name}`} />
              </div>
            )
          })}
        </Section>

        <Section
          title="Muted words"
          hint="Hide stories whose headline or summary contains any of these."
        >
          <div className="p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                submit()
              }}
              className="flex gap-2"
            >
              <input
                value={word}
                onChange={(e) => setWord(e.target.value)}
                placeholder="e.g. election"
                autoCapitalize="none"
                enterKeyHint="done"
                className="min-w-0 flex-1 rounded-xl px-3 py-2 text-base outline-none"
                style={{ background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border)' }}
              />
              <button
                type="submit"
                aria-label="Add muted word"
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: 'var(--accent)', color: '#0a0a0f' }}
              >
                <IconPlus size={18} />
              </button>
            </form>
            {prefs.mutedWords.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {prefs.mutedWords.map((w) => (
                  <span
                    key={w}
                    className="inline-flex items-center gap-1 rounded-full py-1 pl-3 pr-1.5 text-sm"
                    style={{ background: 'var(--surface2)', color: 'var(--text)' }}
                  >
                    {w}
                    <button
                      onClick={() => onRemoveMutedWord(w)}
                      aria-label={`Unmute ${w}`}
                      className="flex h-5 w-5 items-center justify-center rounded-full"
                      style={{ color: 'var(--muted)' }}
                    >
                      <IconX size={13} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </Section>

        <Section title="About">
          <div className="space-y-2 px-4 py-3">
            <p className="text-sm" style={{ color: 'var(--text)' }}>
              Headlines straight from publishers' public RSS feeds. No AI, no accounts, no tracking.
            </p>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              Search uses Google News. Summaries are the publishers' own; tap “Read at …” for the full story.
            </p>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              Your saved stories and filters stay on this device.
            </p>
          </div>
        </Section>
      </div>
    </div>
  )
}
