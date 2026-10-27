import { useState } from 'react'

interface Props {
  src: string
  className?: string
}

/** Publisher image; disappears if it fails to load (hotlink blocks, 404s). */
export function Thumb({ src, className = '' }: Props) {
  const [failed, setFailed] = useState(false)
  if (failed) return null
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
      style={{ background: 'var(--surface2)' }}
    />
  )
}
