import { useEffect, useRef } from 'react'

/* Assign CSS animation delay per row so they stagger in */
function RowAnimStyle(i) {
  return { animationDelay: `${i * 55}ms` }
}

/* Determine ratio tier for colour hint */
function ratioClass(ratio, max) {
  if (ratio >= max * 0.75) return 'ratio-high'
  if (ratio >= max * 0.4)  return 'ratio-mid'
  return ''
}

export default function KnapsackTable({ rows }) {
  const tbodyRef = useRef(null)

  /* Reset bar widths then re-animate when rows change */
  useEffect(() => {
    if (!tbodyRef.current) return
    const bars = tbodyRef.current.querySelectorAll('.frac-bar-fill')
    bars.forEach(b => { b.style.width = '0%' })
    const ids = []
    bars.forEach((b, i) => {
      const target = b.dataset.target
      const tid = setTimeout(() => { b.style.width = target }, 80 + i * 55)
      ids.push(tid)
    })
    return () => ids.forEach(clearTimeout)
  }, [rows])

  if (!rows || rows.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">⬡</div>
        <p>No results yet — run the algorithm above to see the table.</p>
      </div>
    )
  }

  const maxRatio = Math.max(...rows.map(r => r.ratio))

  return (
    <>
      {/* Legend */}
      <div className="legend">
        <div className="legend-item">
          <div className="legend-dot full" />
          <span>Fully selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot partial" />
          <span>Partially selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot skip" />
          <span>Skipped</span>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Item #</th>
              <th>Weight</th>
              <th>Value</th>
              <th>Ratio (V/W)</th>
              <th>Fraction Taken</th>
              <th>Value Gained</th>
              <th>Remaining Cap.</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody ref={tbodyRef}>
            {rows.map((row, i) => {
              const rowClass =
                row.status === 'full'    ? 'row-full' :
                row.status === 'partial' ? 'row-partial' :
                                           'row-skip'

              const barClass =
                row.status === 'full'    ? 'full' :
                row.status === 'partial' ? 'partial' : 'skip'

              const badge =
                row.status === 'full'    ? <span className="badge badge-full">Full</span> :
                row.status === 'partial' ? <span className="badge badge-partial">Partial</span> :
                                           <span className="badge badge-skip">Skip</span>

              const fracPct = (row.fraction * 100).toFixed(1)

              return (
                <tr
                  key={row.sortedIndex}
                  className={rowClass}
                  style={RowAnimStyle(i)}
                >
                  <td>
                    <span style={{ color: 'var(--text-muted)', marginRight: 6, fontSize: 10 }}>
                      #{String(i + 1).padStart(2, '0')}
                    </span>
                    Item {row.origIndex}
                  </td>
                  <td>{row.weight}</td>
                  <td>{row.value}</td>
                  <td>
                    <span className={ratioClass(row.ratio, maxRatio)}>
                      {row.ratio.toFixed(4)}
                    </span>
                  </td>
                  <td>
                    <div className="frac-cell">
                      <div className="frac-bar-bg">
                        <div
                          className={`frac-bar-fill ${barClass}`}
                          style={{ width: '0%' }}
                          data-target={`${fracPct}%`}
                        />
                      </div>
                      <span>{fracPct}%</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ color: row.status !== 'skip' ? 'var(--text-primary)' : undefined }}>
                      {row.valueGained.toFixed(2)}
                    </span>
                  </td>
                  <td>{row.remainingAfter.toFixed(2)}</td>
                  <td>{badge}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
