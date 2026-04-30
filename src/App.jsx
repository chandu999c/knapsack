import { useState, useCallback } from 'react'
import InputForm     from './components/InputForm'
import KnapsackTable from './components/KnapsackTable'
import StepsLog      from './components/StepsLog'
import ProgressBar   from './components/ProgressBar'

/* ════════════════════════════════════════
   FRACTIONAL KNAPSACK ALGORITHM
   ════════════════════════════════════════ */
function fractionalKnapsack(weights, values, capacity) {
  const n = weights.length
  const steps = []

  // Build item objects with original indices
  const items = weights.map((w, i) => ({
    origIndex: i + 1,
    weight:    w,
    value:     values[i],
    ratio:     values[i] / w,
  }))

  // Sort descending by ratio
  const sorted = [...items].sort((a, b) => b.ratio - a.ratio)

  steps.push({
    type: 'sort',
    message: `Sorted ${n} items by value/weight ratio (descending). Starting capacity = ${capacity}.`,
  })

  let remaining   = capacity
  let totalValue  = 0
  const rows      = []

  sorted.forEach((item, si) => {
    if (remaining <= 0) {
      rows.push({
        sortedIndex:    si,
        origIndex:      item.origIndex,
        weight:         item.weight,
        value:          item.value,
        ratio:          item.ratio,
        fraction:       0,
        valueGained:    0,
        remainingAfter: 0,
        status:         'skip',
      })
      steps.push({
        type:    'skip',
        message: `Skipped Item ${item.origIndex} (w=${item.weight}, v=${item.value}, ratio=${item.ratio.toFixed(4)}) — knapsack full.`,
      })
      return
    }

    if (item.weight <= remaining) {
      // Take the full item
      totalValue  += item.value
      remaining   -= item.weight
      rows.push({
        sortedIndex:    si,
        origIndex:      item.origIndex,
        weight:         item.weight,
        value:          item.value,
        ratio:          item.ratio,
        fraction:       1,
        valueGained:    item.value,
        remainingAfter: remaining,
        status:         'full',
      })
      steps.push({
        type: 'full',
        message: `Selected Item ${item.origIndex} FULLY — weight=${item.weight}, value=${item.value}, ratio=${item.ratio.toFixed(4)}. Remaining capacity: ${remaining.toFixed(2)}.`,
      })
    } else {
      // Take fractional part
      const fraction   = remaining / item.weight
      const gained     = item.value * fraction
      totalValue      += gained
      remaining        = 0
      rows.push({
        sortedIndex:    si,
        origIndex:      item.origIndex,
        weight:         item.weight,
        value:          item.value,
        ratio:          item.ratio,
        fraction,
        valueGained:    gained,
        remainingAfter: 0,
        status:         'partial',
      })
      steps.push({
        type: 'partial',
        message: `Partially selected Item ${item.origIndex} — took ${(fraction * 100).toFixed(1)}% (${(item.weight * fraction).toFixed(2)} units), gaining ${gained.toFixed(2)} value. Knapsack now full.`,
      })
    }
  })

  steps.push({
    type: 'result',
    message: `Algorithm complete. Maximum value = ${totalValue.toFixed(2)} | Weight used = ${(capacity - remaining).toFixed(2)} / ${capacity}.`,
  })

  const weightUsed    = capacity - remaining
  const fullCount     = rows.filter(r => r.status === 'full').length
  const partialCount  = rows.filter(r => r.status === 'partial').length

  return { rows, steps, totalValue, weightUsed, fullCount, partialCount, itemCount: n }
}

/* ════════════════════════════════════════
   ROOT COMPONENT
   ════════════════════════════════════════ */
export default function App() {
  const [result, setResult] = useState(null)

  const handleRun = useCallback((weights, values, capacity) => {
    setResult(null) // unmount first so animations re-fire
    requestAnimationFrame(() => {
      setResult(fractionalKnapsack(weights, values, capacity))
    })
  }, [])

  const handleReset = useCallback(() => setResult(null), [])

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="app-header">
        <p className="header-eyebrow">// greedy algorithm visualizer</p>
        <h1 className="header-title">
          Fractional <span className="accent">Knapsack</span>
        </h1>
        <p className="header-sub">
          Greedy selection by value/weight ratio — step-by-step with large dataset support
        </p>
        <div className="header-divider" />
      </header>

      {/* ── Main ── */}
      <main className="app-main">
        {/* Input card */}
        <InputForm onRun={handleRun} onReset={handleReset} />

        {/* Results section */}
        {result && (
          <>
            {/* ── Summary chips ── */}
            <div className="stats-bar">
              <div className="stat-chip">
                <div className="stat-label">Max Value</div>
                <div className="stat-value">{result.totalValue.toFixed(2)}</div>
              </div>
              <div className="stat-chip">
                <div className="stat-label">Weight Used</div>
                <div className="stat-value">{result.weightUsed.toFixed(2)}</div>
              </div>
              <div className="stat-chip">
                <div className="stat-label">Fully Taken</div>
                <div className="stat-value">{result.fullCount}</div>
              </div>
              <div className="stat-chip">
                <div className="stat-label">Partial / Skipped</div>
                <div className="stat-value">
                  {result.partialCount} / {result.itemCount - result.fullCount - result.partialCount}
                </div>
              </div>
            </div>

            {/* ── Capacity bar ── */}
            <div className="card">
              <div className="card-topbar" />
              <ProgressBar used={result.weightUsed} total={result.rows[0]?.remainingAfter + result.weightUsed || result.weightUsed} />
            </div>

            {/* ── Table ── */}
            <div className="card">
              <div className="card-topbar" />
              <div className="card-header">
                <span className="card-title">// 02 — Sorted Results Table</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                  {result.itemCount} items · sorted by ratio ↓
                </span>
              </div>
              <KnapsackTable rows={result.rows} />
            </div>

            {/* ── Step log ── */}
            <div className="card">
              <div className="card-topbar" />
              <div className="card-header">
                <span className="card-title">// 03 — Step-by-Step Execution Log</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                  {result.steps.length} events
                </span>
              </div>
              <StepsLog steps={result.steps} />
            </div>
          </>
        )}

        {/* Empty prompt when no result yet */}
        {!result && (
          <div className="card">
            <div className="card-topbar" />
            <div className="empty-state">
              <div className="empty-icon">◈</div>
              <p>Enter inputs above or click <strong style={{ color: 'var(--cyan)' }}>Load Large Demo</strong> to begin.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
