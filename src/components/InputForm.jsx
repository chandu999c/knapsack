import { useState } from 'react'

const DEMO = {
  weights:  '5, 10, 15, 22, 25, 30, 35, 40, 45, 50, 12, 18, 28, 33, 38, 48, 55, 60',
  values:   '30, 40, 45, 77, 90, 120, 140, 160, 200, 220, 50, 65, 95, 110, 130, 170, 210, 250',
  capacity: '100',
}

export default function InputForm({ onRun, onReset }) {
  const [weights,  setWeights]  = useState('')
  const [values,   setValues]   = useState('')
  const [capacity, setCapacity] = useState('')
  const [errors,   setErrors]   = useState({})
  const [errBanner, setErrBanner] = useState('')

  /* ── Validation ── */
  function validate() {
    const errs = {}
    const wArr = weights.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n))
    const vArr = values.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n))
    const cap  = parseFloat(capacity)

    if (!weights.trim())          errs.weights  = true
    else if (wArr.length === 0)   errs.weights  = true
    if (!values.trim())           errs.values   = true
    else if (vArr.length === 0)   errs.values   = true
    if (!capacity.trim() || isNaN(cap) || cap <= 0) errs.capacity = true

    if (wArr.length > 0 && vArr.length > 0 && wArr.length !== vArr.length) {
      errs.weights = true
      errs.values  = true
      setErrBanner(`Array length mismatch: weights (${wArr.length}) ≠ values (${vArr.length})`)
    } else if (Object.keys(errs).length > 0) {
      setErrBanner('Please fix the highlighted fields.')
    } else {
      setErrBanner('')
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleRun() {
    if (!validate()) return
    const wArr = weights.split(',').map(s => parseFloat(s.trim()))
    const vArr = values.split(',').map(s => parseFloat(s.trim()))
    const cap  = parseFloat(capacity)
    onRun(wArr, vArr, cap)
  }

  function handleDemo() {
    setWeights(DEMO.weights)
    setValues(DEMO.values)
    setCapacity(DEMO.capacity)
    setErrors({})
    setErrBanner('')
    const wArr = DEMO.weights.split(',').map(s => parseFloat(s.trim()))
    const vArr = DEMO.values.split(',').map(s => parseFloat(s.trim()))
    onRun(wArr, vArr, parseFloat(DEMO.capacity))
  }

  function handleReset() {
    setWeights('')
    setValues('')
    setCapacity('')
    setErrors({})
    setErrBanner('')
    onReset()
  }

  return (
    <div className="card">
      <div className="card-topbar" />
      <div className="card-header">
        <span className="card-title">// 01 — Algorithm Inputs</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1 }}>
          fractional · greedy · optimal
        </span>
      </div>
      <div className="card-body">
        <div className="input-grid">
          <div className={`field span-2`}>
            <label htmlFor="weights">Weights Array</label>
            <input
              id="weights"
              type="text"
              value={weights}
              onChange={e => { setWeights(e.target.value); setErrors(p => ({ ...p, weights: false })) }}
              placeholder="e.g. 5, 10, 15, 22, 25 ..."
              className={errors.weights ? 'has-error' : ''}
            />
            <span className="field-hint">comma-separated positive numbers</span>
          </div>

          <div className="field">
            <label htmlFor="capacity">Knapsack Capacity</label>
            <input
              id="capacity"
              type="number"
              value={capacity}
              onChange={e => { setCapacity(e.target.value); setErrors(p => ({ ...p, capacity: false })) }}
              placeholder="e.g. 100"
              min="1"
              className={errors.capacity ? 'has-error' : ''}
            />
          </div>

          <div className="field span-2">
            <label htmlFor="values">Values Array</label>
            <input
              id="values"
              type="text"
              value={values}
              onChange={e => { setValues(e.target.value); setErrors(p => ({ ...p, values: false })) }}
              placeholder="e.g. 30, 40, 45, 77, 90 ..."
              className={errors.values ? 'has-error' : ''}
            />
            <span className="field-hint">must match weights array length</span>
          </div>
        </div>

        {errBanner && <div className="error-banner" style={{ marginTop: 16 }}>⚠ {errBanner}</div>}

        <div className="btn-row" style={{ marginTop: 24 }}>
          <button className="btn btn-run" onClick={handleRun}>
            <span>▶</span> Run Algorithm
          </button>
          <button className="btn btn-demo" onClick={handleDemo}>
            <span>⟳</span> Load Large Demo (18 items)
          </button>
          <button className="btn btn-reset" onClick={handleReset}>
            ✕ Reset
          </button>
        </div>
      </div>
    </div>
  )
}
