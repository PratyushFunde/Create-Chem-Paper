import katex from 'katex'

const cache = new Map()
function math(src) {
  if (!cache.has(src)) {
    cache.set(src, katex.renderToString(src, { throwOnError: false, output: 'html' }))
  }
  return cache.get(src)
}

// Renders text containing $...$ inline TeX and \n line breaks.
export default function RichText({ text = '' }) {
  const lines = String(text).split('\n')
  return lines.map((line, li) => (
    <span key={li}>
      {li > 0 && <br />}
      {line.split(/(\$[^$]+\$)/g).map((part, i) =>
        part.length > 2 && part.startsWith('$') && part.endsWith('$') ? (
          <span key={i} className="m" dangerouslySetInnerHTML={{ __html: math(part.slice(1, -1)) }} />
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  ))
}

export const plain = (t = '') =>
  t.replace(/\$([^$]*)\$/g, (_, m) => m.replace(/\\text\{([^}]*)\}/g, '$1').replace(/[\\{}^_]/g, ''))
