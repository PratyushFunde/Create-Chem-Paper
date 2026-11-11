import { useRef, useState } from 'react'
import logo from '/DESLogo.webp'
import { LLM_PROMPT } from './lib/prompt'
import { SAMPLE_TEXT } from './lib/sample'
import { parseAndValidate } from './lib/validate'
import { save, JSON_KEY } from './lib/storage'
import { go } from './lib/route'
import './Home.css'

function download(name, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }))
  const a = Object.assign(document.createElement('a'), { href: url, download: name })
  a.click()
  URL.revokeObjectURL(url)
}

function useCopy() {
  const [done, setDone] = useState('')
  const copy = async (key, text) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = Object.assign(document.createElement('textarea'), { value: text })
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setDone(key)
    setTimeout(() => setDone(''), 1800)
  }
  return [done, copy]
}

export default function Home() {
  const [text, setText] = useState('')
  const [errors, setErrors] = useState([])
  const [drag, setDrag] = useState(false)
  const [copied, copy] = useCopy()
  const fileRef = useRef(null)

  const open = (raw) => {
    const { errors: errs } = parseAndValidate(raw)
    setErrors(errs)
    if (errs.length) return
    save(JSON_KEY, raw)
    go('/paper')
  }

  const readFile = async (file) => {
    if (!file) return
    const raw = await file.text()
    setText(raw)
    open(raw)
  }

  return (
    <div className="home">
      <header className="h-hero">
        <img src={logo} alt="" className="h-logo" />
        <h1>Question Paper Formatter</h1>
        <p>Turn a question paper JSON into a print-ready A4 paper with cover page, instructions, proper typography and page breaks.</p>
        <ol className="h-steps">
          <li><b>1</b> Copy the prompt below and give it to any AI together with your question paper.</li>
          <li><b>2</b> Import the JSON the AI returns.</li>
          <li><b>3</b> Adjust fonts, margins and cover page, then print or save as PDF.</li>
        </ol>
      </header>

      <main className="h-main">
        <section className="card">
          <h2>Import JSON</h2>
          <div
            className={`drop ${drag ? 'over' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); readFile(e.dataTransfer.files?.[0]) }}
            onClick={() => fileRef.current.click()}
          >
            <strong>Drop a .json file here</strong> or click to browse
            <input ref={fileRef} type="file" accept=".json,application/json" hidden onChange={(e) => { readFile(e.target.files?.[0]); e.target.value = '' }} />
          </div>
          <div className="or">or paste the JSON</div>
          <textarea
            spellCheck="false"
            placeholder='{ "title": "...", "sections": [ ... ] }'
            value={text}
            onChange={(e) => { setText(e.target.value); setErrors([]) }}
          />
          {errors.length > 0 && (
            <div className="errs" role="alert">
              <b>This JSON can’t be imported:</b>
              <ul>{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
            </div>
          )}
          <div className="actions">
            <button className="primary" disabled={!text.trim()} onClick={() => open(text)}>Import &amp; generate paper →</button>
          </div>
        </section>

        <section className="card">
          <h2>LLM prompt</h2>
          <p className="muted">Paste this prompt into ChatGPT, Claude, Gemini or any other LLM, then attach or paste your question paper. It tells the model exactly which JSON to return, including LaTeX for formulas.</p>
          <pre className="box tall">{LLM_PROMPT}</pre>
          <div className="actions">
            <button className="primary" onClick={() => copy('prompt', LLM_PROMPT)}>{copied === 'prompt' ? 'Copied ✓' : 'Copy prompt'}</button>
            <button onClick={() => download('question-paper-prompt.txt', LLM_PROMPT, 'text/plain')}>Download .txt</button>
          </div>
        </section>

        <section className="card wide">
          <h2>Sample JSON</h2>
          <p className="muted">A complete 70-mark paper with placeholder text, showing every supported structure: MCQ groups, question groups, nested parts and sections.</p>
          <pre className="box">{SAMPLE_TEXT}</pre>
          <div className="actions">
            <button className="primary" onClick={() => open(SAMPLE_TEXT)}>Load sample paper →</button>
            <button onClick={() => copy('sample', SAMPLE_TEXT)}>{copied === 'sample' ? 'Copied ✓' : 'Copy JSON'}</button>
            <button onClick={() => download('sample-question-paper.json', SAMPLE_TEXT, 'application/json')}>Download .json</button>
          </div>
        </section>
      </main>

      <footer className="h-foot">Everything runs in your browser — your paper is never uploaded anywhere.</footer>
    </div>
  )
}
