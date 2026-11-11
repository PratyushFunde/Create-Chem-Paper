import RichText from '../components/RichText'

function Options({ options }) {
  return (
    <div className="opts">
      {options.map((o) => (
        <div className="opt" key={o.label}>
          <span className="olab">({o.label})</span>
          <span><RichText text={o.text} /></span>
        </div>
      ))}
    </div>
  )
}

function Nested({ subs }) {
  return (
    <div className="nested">
      {subs.map((n, i) => (
        <div className="nrow" key={n.id}>
          <span className="nlab">{i > 0 && subs[i - 1].label === n.label ? '' : `(${n.label})`}</span>
          <div><Body node={n} /></div>
        </div>
      ))}
    </div>
  )
}

function Body({ node, textOnly, bold }) {
  const subs = node.subquestions || []
  return (
    <>
      {node.text?.trim() && <div className={bold ? 'txt bold' : 'txt'}><RichText text={node.text} /></div>}
      {!textOnly && node.options?.length > 0 && <Options options={node.options} />}
      {!textOnly && subs.length > 0 && <Nested subs={subs} />}
    </>
  )
}

function Row({ num = '', label, marks, s, children }) {
  const hasLabel = label !== undefined
  return (
    <div className="row">
      <div className="num">{num}</div>
      {hasLabel && <div className="lab">{label}</div>}
      <div className={hasLabel ? 'content' : 'content wide'}>{children}</div>
      <div className="marks">{s.showMarks && marks != null ? `[${marks}]` : ''}</div>
    </div>
  )
}

function Header({ paper, s }) {
  return (
    <div className="hdr">
      <div className="ptitle">{paper.title}</div>
      <div className="meta">
        <span>{paper.subject && `Subject: ${paper.subject}`}</span>
        <span>{[s.time && `Time: ${s.time}`, s.date && `Date: ${s.date}`].filter(Boolean).join('   ')}</span>
        <span>{paper.total_marks != null && `Total Marks: ${paper.total_marks}`}</span>
      </div>
    </div>
  )
}

function SectionHead({ sec, s }) {
  return (
    <div className="sec">
      <div className="sec-line">
        <span />
        <span className="sec-name">{sec.name}</span>
        <span className="sec-marks">{s.showMarks && sec.marks != null ? `[${sec.marks} Marks]` : ''}</span>
      </div>
      {sec.instructions?.map((t, i) => (
        <div className="instr" key={i}><RichText text={t} /></div>
      ))}
    </div>
  )
}

function pushQuestion(q, items, s) {
  const start = items.length
  const subs = q.subquestions || []
  const num = q.number ? `Q.${q.number}` : ''
  if (!subs.length) {
    items.push({ node: <Row num={num} marks={q.marks} s={s}><Body node={q} /></Row> })
    items.slice(start).forEach((it) => { it.g = q.id })
    return
  }
  const hasText = q.text?.trim()
  if (hasText) {
    items.push({
      node: <Row num={num} marks={q.marks} s={s}><Body node={q} textOnly bold={q.marks != null} /></Row>,
      keepNext: true,
    })
  }
  subs.forEach((sub, i) => {
    const first = !hasText && i === 0
    const dup = i > 0 && subs[i - 1].label === sub.label
    items.push({
      node: (
        <Row
          num={first ? num : ''}
          label={dup ? '' : `(${sub.label})`}
          marks={first ? (sub.marks ?? q.marks) : sub.marks}
          s={s}
        >
          <Body node={sub} />
        </Row>
      ),
    })
  })
  items.slice(start).forEach((it) => { it.g = q.id })
}

// Flattens the paper into a list of indivisible blocks that the paginator packs onto pages.
export function buildBlocks(paper, s) {
  const items = []
  if (s.showHeader && !s.showCover) items.push({ node: <Header paper={paper} s={s} />, keepNext: true, head: true })
  for (const sec of paper.sections || []) {
    items.push({ node: <SectionHead sec={sec} s={s} />, keepNext: true, head: true })
    for (const q of sec.questions || []) pushQuestion(q, items, s)
  }
  // Header/section items take the group of the question that follows them.
  for (let i = items.length - 1, next = null; i >= 0; i--) {
    if (items[i].g) next = items[i].g
    else items[i].g = next
  }
  const blocks = []
  let group = []
  items.forEach((it, i) => {
    const lastInQuestion = !items[i + 1] || items[i + 1].g !== it.g
    const pad = it.head ? 0 : lastInQuestion ? 'var(--gap)' : 'var(--subgap)'
    group.push(<div key={i} style={{ paddingBottom: pad }}>{it.node}</div>)
    if (!it.keepNext || i === items.length - 1) {
      blocks.push({ nodes: group, g: it.g })
      group = []
    }
  })
  return blocks
}
