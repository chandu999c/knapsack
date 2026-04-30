import { useEffect, useState } from 'react'

export default function ProgressBar({ used, total }) {
  const [width, setWidth] = useState(0)
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0

  useEffect(() => {
    // Short delay so CSS transition fires after mount
    const t = setTimeout(() => setWidth(pct), 60)
    return () => clearTimeout(t)
  }, [pct])

  const markers = [0, 25, 50, 75, 100]

  return (
    <div className="progress-section">
      <div className="progress-header">
        <span className="progress-label">Capacity Usage</span>
        <span className="progress-pct">
          {used.toFixed(2)} / {total} &nbsp;({pct.toFixed(1)}%)
        </span>
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${width}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <div className="progress-segments">
        {markers.map(m => (
          <span key={m} className="progress-seg-label">{m}%</span>
        ))}
      </div>
    </div>
  )
}
