import { useEffect, useRef } from 'react'

const ICON = {
  sort:    '⇅',
  full:    '✔',
  partial: '◑',
  skip:    '–',
  result:  '★',
}

export default function StepsLog({ steps }) {
  const containerRef = useRef(null)

  /* Auto-scroll to bottom as entries animate in */
  useEffect(() => {
    if (!containerRef.current) return
    const t = setTimeout(() => {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }, steps.length * 55 + 200)
    return () => clearTimeout(t)
  }, [steps])

  if (!steps || steps.length === 0) {
    return (
      <div className="steps-log" style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
        <span style={{ fontFamily: 'var(--font-mono)' }}>Awaiting execution...</span>
      </div>
    )
  }

  return (
    <div className="steps-log" ref={containerRef}>
      {steps.map((s, i) => (
        <div
          key={i}
          className={`step-entry log-${s.type}`}
          style={{ animationDelay: `${i * 45}ms` }}
        >
          <span className="step-num">{String(i + 1).padStart(2, '0')}</span>
          <span className="step-icon">{ICON[s.type] ?? '·'}</span>
          <span className="step-text">{s.message}</span>
        </div>
      ))}
    </div>
  )
}
