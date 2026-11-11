import { useRef } from 'react'
import { FONTS, DEFAULTS, COVER_FIELDS } from '../lib/settings'

function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  )
}

export default function Controls({ s, set, jsonText, setJsonText, error, loadSample, fit }) {
  const fileRef = useRef(null)
  const num = (k, min, max, step = 1) => (
    <div className="num-in">
      <input type="range" min={min} max={max} step={step} value={s[k]} onChange={(e) => set({ [k]: +e.target.value })} />
      <input type="number" min={min} max={max} step={step} value={s[k]} onChange={(e) => set({ [k]: +e.target.value })} />
    </div>
  )
  const text = (k, ph) => <input type="text" value={s[k]} placeholder={ph} onChange={(e) => set({ [k]: e.target.value })} />
  const check = (k, label) => (
    <label className="check">
      <input type="checkbox" checked={s[k]} onChange={(e) => set({ [k]: e.target.checked })} /> {label}
    </label>
  )

  const setCover = (k, patch) => set({ cover: { ...s.cover, [k]: { ...s.cover[k], ...patch } } })
  const setHead = (i, patch) =>
    set({ coverHeadings: s.coverHeadings.map((h, j) => (j === i ? { ...h, ...patch } : h)) })
  const setInstr = (i, patch) =>
    set({ instructions: s.instructions.map((it, j) => (j === i ? { ...it, ...patch } : it)) })
  const moveInstr = (i, d) => {
    const a = [...s.instructions]
    ;[a[i], a[i + d]] = [a[i + d], a[i]]
    set({ instructions: a })
  }

  const onFile = async (e) => {
    const f = e.target.files?.[0]
    if (f) setJsonText(await f.text())
    e.target.value = ''
  }

  return (
    <aside className="controls">
      <h1>Question Paper Formatter</h1>

      <details open>
        <summary>Paper JSON</summary>
        <div className="btns">
          <button onClick={() => fileRef.current.click()}>Upload JSON…</button>
          <button onClick={loadSample}>Load sample</button>
          <input ref={fileRef} type="file" accept=".json,application/json" hidden onChange={onFile} />
        </div>
        <textarea spellCheck="false" value={jsonText} onChange={(e) => setJsonText(e.target.value)} />
        {error && <p className="err">{error}</p>}
      </details>

      <details open>
        <summary>Cover page &amp; instructions</summary>
        {check('showCover', 'Show cover page')}
        <p className="hint">Tick to show, untick to hide. Placeholders: {'{total}'} pages, {'{marks}'} total marks, {'{SUBJECT}'} / {'{subject}'}.</p>
        {COVER_FIELDS.map(([k, label, editable]) => (
          <div className="cf" key={k}>
            <label className="check">
              <input type="checkbox" checked={s.cover[k].show} onChange={(e) => setCover(k, { show: e.target.checked })} /> {label}
            </label>
            {editable && s.cover[k].show && (
              <input type="text" value={s.cover[k].text} onChange={(e) => setCover(k, { text: e.target.value })} />
            )}
            {k === 'institution' && s.cover.institution.show && (
              <>
                {(s.coverHeadings || []).map((h, i) => (
                  <div className="inst-top extra-head" key={i}>
                    <input type="checkbox" title="Show" checked={h.show !== false} onChange={(e) => setHead(i, { show: e.target.checked })} />
                    <input type="text" value={h.text} placeholder="Extra heading" onChange={(e) => setHead(i, { text: e.target.value })} />
                    <button title="Delete" onClick={() => set({ coverHeadings: s.coverHeadings.filter((_, j) => j !== i) })}>✕</button>
                  </div>
                ))}
                <button className="add-head" onClick={() => set({ coverHeadings: [...(s.coverHeadings || []), { show: true, text: '' }] })}>+ Add heading</button>
              </>
            )}
            {k === 'seat' && s.cover.seat.show && (
              <div className="num-in"><span>Boxes</span><input type="number" min={1} max={12} value={s.cover.seat.boxes} onChange={(e) => setCover('seat', { boxes: +e.target.value })} /></div>
            )}
          </div>
        ))}
        <p className="hint">Instructions are numbered automatically. Leave “Heading” empty for a full-width line. Use new lines for separate paragraphs and $…$ for formulas.</p>
        {s.instructions.map((it, i) => (
          <div className="inst-item" key={i}>
            <div className="inst-top">
              <input type="checkbox" title="Show" checked={it.show !== false} onChange={(e) => setInstr(i, { show: e.target.checked })} />
              <b>({i + 1})</b>
              <input type="text" value={it.head} placeholder="Heading (e.g. Section A :)" onChange={(e) => setInstr(i, { head: e.target.value })} />
              <button title="Move up" disabled={i === 0} onClick={() => moveInstr(i, -1)}>↑</button>
              <button title="Move down" disabled={i === s.instructions.length - 1} onClick={() => moveInstr(i, 1)}>↓</button>
              <button title="Delete" onClick={() => set({ instructions: s.instructions.filter((_, j) => j !== i) })}>✕</button>
            </div>
            <textarea className="small" value={it.text} onChange={(e) => setInstr(i, { text: e.target.value })} />
          </div>
        ))}
        <button onClick={() => set({ instructions: [...s.instructions, { show: true, head: '', text: '' }] })}>+ Add instruction</button>
      </details>

      <details open>
        <summary>Typography</summary>
        <Field label="Font">
          <select value={s.fontFamily} onChange={(e) => set({ fontFamily: e.target.value })}>
            {FONTS.map((f) => <option key={f.label} value={f.value}>{f.label}</option>)}
          </select>
        </Field>
        <Field label="Font size (pt)">{num('fontSize', 8, 16, 0.5)}</Field>
        <Field label="Line height">{num('lineHeight', 1.0, 2.0, 0.05)}</Field>
        <Field label="Question spacing (pt)">{num('gap', 0, 24, 1)}</Field>
        <Field label="Sub-question spacing (pt)">{num('subGap', 0, 24, 1)}</Field>
        {check('justify', 'Justify text')}
      </details>

      <details open>
        <summary>Page margins (mm)</summary>
        <Field label="Top">{num('marginTop', 5, 40)}</Field>
        <Field label="Bottom">{num('marginBottom', 5, 40)}</Field>
        <Field label="Left">{num('marginLeft', 5, 40)}</Field>
        <Field label="Right">{num('marginRight', 5, 40)}</Field>
      </details>

      <details open>
        <summary>Header &amp; footer</summary>
        {check('showHeader', 'Show paper header (only when cover is off)')}
        <Field label="Time">{text('time')}</Field>
        <Field label="Date">{text('date', 'optional')}</Field>
        <Field label="Footer text">{text('footerText', 'optional')}</Field>
        {check('showPageNumbers', 'Page numbers')}
        {check('showMarks', 'Show marks')}
      </details>

      <details open>
        <summary>View</summary>
        <Field label={`Zoom ${Math.round(s.zoom * 100)}%`}>{num('zoom', 0.3, 1.5, 0.05)}</Field>
        <div className="btns">
          <button onClick={fit}>Fit width</button>
          <button onClick={() => set(DEFAULTS)}>Reset settings</button>
        </div>
      </details>

      <button className="primary" onClick={() => window.print()}>Print / Save as PDF</button>
      <p className="hint">In the print dialog choose paper size A4, margins “None”, and enable background graphics off.</p>
    </aside>
  )
}
