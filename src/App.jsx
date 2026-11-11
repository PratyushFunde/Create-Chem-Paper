import { useCallback, useMemo, useRef, useState } from 'react'
import Controls from './components/Controls'
import Paper from './components/Paper'
import { DEFAULTS, MM } from './lib/settings'
import './App.css'

const SAMPLE_TEXT = JSON.stringify(sample, null, 2)

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}
function save(key, v) {
  try { localStorage.setItem(key, JSON.stringify(v)) } catch { /* ignore */ }
}

export default function App() {
  const [s, setS] = useState(() => ({ ...DEFAULTS, ...load('qpfe.settings', {}) }))
  const [jsonText, setJsonText] = useState(() => load('qpfe.json', SAMPLE_TEXT))
  const viewRef = useRef(null)

  const set = useCallback((patch) => {
    setS((prev) => {
      const next = { ...prev, ...patch }
      save('qpfe.settings', next)
      return next
    })
  }, [])

  const updateJson = (t) => {
    setJsonText(t)
    save('qpfe.json', t)
  }

  const { paper, error } = useMemo(() => {
    try {
      const p = JSON.parse(jsonText)
      if (!Array.isArray(p.sections)) throw new Error('JSON must contain a "sections" array.')
      return { paper: p, error: '' }
    } catch (e) {
      return { paper: null, error: e.message }
    }
  }, [jsonText])

  // Keep showing the last valid paper while the JSON is being edited.
  const lastGood = useRef(sample)
  if (paper) lastGood.current = paper

  const fit = () => {
    const w = viewRef.current?.clientWidth || 800
    set({ zoom: Math.min(1.5, Math.max(0.3, Math.floor(((w - 48) / (210 * MM)) * 20) / 20)) })
  }

  return (
    <div className="app">
      <Controls
        s={s} set={set} jsonText={jsonText} setJsonText={updateJson} error={error}
        loadSample={() => updateJson(SAMPLE_TEXT)} fit={fit}
      />
      <main className="view" ref={viewRef}>
        <Paper paper={lastGood.current} s={s} />
      </main>
    </div>
  )
}
