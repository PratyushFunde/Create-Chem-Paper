import RichText from './RichText'
import logo from '/DESLogo.webp'

const ROMAN = ['', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x', 'xi', 'xii', 'xiii', 'xiv', 'xv']
export const roman = (n) => ROMAN[n] ?? String(n)

export default function Cover({ paper, s, total }) {
  const c = s.cover
  const fill = (t = '') =>
    t
      .replaceAll('{total}', total)
      .replaceAll('{marks}', paper.total_marks ?? '')
      .replaceAll('{subject}', paper.subject ?? '')
      .replaceAll('{SUBJECT}', (paper.subject ?? '').toUpperCase())
  const on = (k) => c[k]?.show
  const heads = (s.coverHeadings || []).filter((h) => h.show !== false && h.text)
  const items = s.instructions.filter((it) => it.show !== false)
  const hasHead1 = on('pageNo') || on('subjectCode') || on('seat')
  const hasHead2 = on('date') || on('time') || on('subject') || on('medium')
  const hasHead3 = on('duration') || on('totalPages') || on('totalMarks')
  const hasHead = hasHead1 || hasHead2 || hasHead3
  const hasInstr = on('title') || on('intro') || items.length > 0

  return (
    <section className="page cover">
      {(on('logo') || on('institution') || heads.length > 0) && (
        <div className="cover-top">
          {on('logo') && <img className="cover-logo" src={logo} alt="" />}
          {on('institution') && <div className="cover-inst">{fill(c.institution.text)}</div>}
          {heads.map((h, i) => <div className="cover-head" key={i}>{fill(h.text)}</div>)}
        </div>
      )}
      {(hasHead || hasInstr) && (
        <div className="cbox">
          {hasHead && (
            <div className={hasInstr ? 'chead' : 'chead last'}>
              {hasHead1 && (
                <div className="crow1">
                  {on('pageNo') && <div className="pbox">{fill(c.pageNo.text)}</div>}
                  {on('subjectCode') && <div className="sbox">{fill(c.subjectCode.text)}</div>}
                  {on('seat') && (
                    <div className="seat">
                      <span>{c.seat.text}</span>
                      <span className="seatboxes">
                        {Array.from({ length: c.seat.boxes }, (_, i) => <i key={i} />)}
                      </span>
                    </div>
                  )}
                </div>
              )}
              {hasHead2 && (
                <div className="crow2">
                  <div className="dt">
                    {on('date') && <div>{fill(c.date.text)}</div>}
                    {on('time') && <div>{fill(c.time.text)}</div>}
                  </div>
                  <div className="subj">{on('subject') && fill(c.subject.text)}</div>
                  <div className="med">{on('medium') && <span>{fill(c.medium.text)}</span>}</div>
                </div>
              )}
              {hasHead3 && (
                <div className="crow3">
                  {on('duration') && <span>{fill(c.duration.text)}</span>}
                  {on('totalPages') && <span>{fill(c.totalPages.text)}</span>}
                  {on('totalMarks') && <span>{fill(c.totalMarks.text)}</span>}
                </div>
              )}
            </div>
          )}
          {hasInstr && (
            <div className="cinstr">
              {on('title') && <div className="ititle"><RichText text={fill(c.title.text)} /></div>}
              {on('intro') && <div className="iintro"><RichText text={fill(c.intro.text)} /></div>}
              {items.map((it, i) => (
                <div className="irow" key={i}>
                  <span className="ilab">({roman(i + 1)})</span>
                  {it.head ? <span className="ihead"><RichText text={fill(it.head)} /></span> : null}
                  <span className={it.head ? 'itext' : 'itext wide'}><RichText text={fill(it.text)} /></span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <footer className="page-foot">
        <span />
        <span className="pto">{on('pto') && fill(c.pto.text)}</span>
      </footer>
    </section>
  )
}
