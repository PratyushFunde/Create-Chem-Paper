import { useCallback, useMemo, useRef, useState } from 'react'
import Controls from './components/Controls'
import ErrorBoundary from './components/ErrorBoundary'
import Paper from './components/Paper'
import { DEFAULTS, MM } from './lib/settings'
import { SAMPLE, SAMPLE_TEXT } from './lib/sample'
import { parseAndValidate } from './lib/validate'
import { load, save, JSON_KEY, SETTINGS_KEY } from './lib/storage'
import { go } from './lib/route'
import './App.css'

export default function Studio() {
  const [s, setS] = useState(() => ({ ...DEFAULTS, ...load(SETTINGS_KEY, {}) }))
  const [jsonText, setJsonText] = useState(() => load(JSON_KEY, SAMPLE_TEXT))
  const viewRef = useRef(null)

  const set = useCallback((patch) => {
    setS((prev) => {
      const next = { ...prev, ...patch }
      save(SETTINGS_KEY, next)
      return next
    })
  }, [])

  const updateJson = (t) => {
    setJsonText(t)
    save(JSON_KEY, t)
  }

  const { paper, errors } = useMemo(() => parseAndValidate(jsonText), [jsonText])

  // Keep showing the last valid paper while the JSON is being edited.
  const [lastGood, setLastGood] = useState(() => paper || SAMPLE)
  if (paper && paper !== lastGood) setLastGood(paper)

  const fit = () => {
    const w = viewRef.current?.clientWidth || 800
    set({ zoom: Math.min(1.5, Math.max(0.3, Math.floor(((w - 48) / (210 * MM)) * 20) / 20)) })
  }

  return (
    <div className="app">
      <Controls
        s={s} set={set} jsonText={jsonText} setJsonText={updateJson} errors={errors}
        loadSample={() => updateJson(SAMPLE_TEXT)} fit={fit} home={() => go('/')}
      />
      <main className="view" ref={viewRef}>
        <ErrorBoundary resetKey={jsonText}><Paper paper={lastGood} s={s} /></ErrorBoundary>
      </main>
    </div>
  )
}
