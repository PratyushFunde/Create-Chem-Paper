import katex from 'katex'

const cache = new Map()
function math(src) {
  if (!cache.has(src)) {
    cache.set(src, katex.renderToString(src, { throwOnError: false, output: 'html' }))
  }
  return cache.get(src)
}

function withMath(text, k) {
  return text.split(/(\$[^$]+\$)/g).map((part, i) =>
    part.length > 2 && part.startsWith('$') && part.endsWith('$') ? (
      <span key={`${k}-${i}`} className="m" dangerouslySetInnerHTML={{ __html: math(part.slice(1, -1)) }} />
    ) : (
      <span key={`${k}-${i}`}>{part}</span>
    ),
  )
}

// Renders text containing **bold**, $...$ inline TeX and \n line breaks.
export default function RichText({ text = '' }) {
  return String(text).split('\n').map((line, li) => (
    <span key={li}>
      {li > 0 && <br />}
      {line.split(/(\*\*[^*]+\*\*)/g).map((seg, i) =>
        seg.length > 4 && seg.startsWith('**') && seg.endsWith('**') ? (
          <b key={i}>{withMath(seg.slice(2, -2), `${li}-${i}`)}</b>
        ) : (
          withMath(seg, `${li}-${i}`)
        ),
      )}
    </span>
  ))
}

export const plain = (t = '') =>
  t.replace(/\$([^$]*)\$/g, (_, m) => m.replace(/\\text\{([^}]*)\}/g, '$1').replace(/[\\{}^_]/g, ''))
