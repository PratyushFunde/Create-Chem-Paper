import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { buildBlocks } from '../lib/blocks'
import { MM } from '../lib/settings'
import Cover from './Cover'

export default function Paper({ paper, s }) {
  const blocks = useMemo(() => buildBlocks(paper, s), [paper, s])
  const measureRef = useRef(null)
  const [pages, setPages] = useState([[...blocks.keys()]])
  const [fontTick, setFontTick] = useState(0)

  // Re-measure once the chosen font has actually loaded.
  useEffect(() => {
    const f = s.fontFamily.split(',')[0].replace(/"/g, '').trim()
    const spec = (w, st) => `${st} ${w} ${s.fontSize}pt "${f}"`
    Promise.all([spec(400, 'normal'), spec(700, 'normal'), spec(400, 'italic')].map((x) => document.fonts.load(x)))
      .catch(() => {})
      .then(() => document.fonts.ready)
      .then(() => setFontTick((t) => t + 1))
  }, [s.fontFamily, s.fontSize])

  useLayoutEffect(() => {
    const el = measureRef.current
    if (!el) return
    const avail = (297 - s.marginTop - s.marginBottom) * MM - 1
    const heights = [...el.children].map((c) => c.getBoundingClientRect().height)
    // Group consecutive blocks belonging to the same question so it stays on one page.
    const groups = []
    blocks.forEach((b, i) => {
      const last = groups[groups.length - 1]
      if (last && last.g === b.g) {
        last.idx.push(i)
        last.h += heights[i]
      } else groups.push({ g: b.g, idx: [i], h: heights[i] })
    })
    const out = [[]]
    let used = 0
    const place = (i, h) => {
      if (used + h > avail && out[out.length - 1].length) {
        out.push([])
        used = 0
      }
      out[out.length - 1].push(i)
      used += h
    }
    for (const gr of groups) {
      if (gr.h <= avail) {
        // Whole question: move to a fresh page if it doesn't fit in the space left.
        if (used + gr.h > avail && out[out.length - 1].length) {
          out.push([])
          used = 0
        }
        gr.idx.forEach((i) => place(i, heights[i]))
      } else {
        // Question taller than a page: only then split it between pages.
        gr.idx.forEach((i) => place(i, heights[i]))
      }
    }
    setPages((prev) => (JSON.stringify(prev) === JSON.stringify(out) ? prev : out))
  }, [blocks, s, fontTick])

  const offset = s.showCover ? 1 : 0
  const total = pages.length + offset
  const vars = {
    '--fs': `${s.fontSize}pt`,
    '--lh': s.lineHeight,
    '--gap': `${s.gap}pt`,
    '--subgap': `${s.subGap}pt`,
    '--ml': `${s.marginLeft}mm`,
    '--mr': `${s.marginRight}mm`,
    '--mt': `${s.marginTop}mm`,
    '--mb': `${s.marginBottom}mm`,
    fontFamily: s.fontFamily,
    textAlign: s.justify ? 'justify' : 'left',
  }
  const inner = `calc(210mm - ${s.marginLeft}mm - ${s.marginRight}mm)`

  return (
    <div className="paper" style={vars}>
      <div ref={measureRef} className="measure" style={{ width: inner }}>
        {blocks.map((b, i) => <div className="blk" key={i}>{b.nodes}</div>)}
      </div>
      <div className="pages" style={{ zoom: s.zoom }}>
        {s.showCover && <Cover paper={paper} s={s} total={total} />}
        {pages.map((idxs, p) => (
          <section className="page" key={p}>
            <div className="page-body">
              {idxs.map((i) => <div className="blk" key={i}>{blocks[i].nodes}</div>)}
            </div>
            <footer className="page-foot">
              <span>{s.footerText}</span>
              <span>{s.showPageNumbers ? `Page ${p + 1 + offset} of ${total}` : ''}</span>
            </footer>
          </section>
        ))}
      </div>
    </div>
  )
}
