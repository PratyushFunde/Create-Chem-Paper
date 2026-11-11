// Validates an uploaded question-paper JSON and returns a list of human-readable problems.
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)

export function parseAndValidate(text) {
  let data
  try {
    data = JSON.parse(text)
  } catch (e) {
    return { paper: null, errors: [`Not valid JSON: ${e.message}`] }
  }
  const errors = validate(data)
  return { paper: errors.length ? null : data, errors }
}

export function validate(paper) {
  const errors = []
  const ids = new Set()
  const err = (path, msg) => errors.length < 30 && errors.push(`${path}: ${msg}`)

  if (!isObj(paper)) return ['Root must be a JSON object.']
  for (const k of ['title', 'subject']) {
    if (paper[k] != null && typeof paper[k] !== 'string') err(k, 'must be a string')
  }
  if (paper.total_marks != null && typeof paper.total_marks !== 'number') err('total_marks', 'must be a number')
  if (!Array.isArray(paper.sections) || paper.sections.length === 0) {
    err('sections', 'must be a non-empty array')
    return errors
  }

  const checkNode = (q, path, depth) => {
    if (!isObj(q)) return err(path, 'must be an object')
    if (typeof q.id !== 'string' || !q.id) err(path, '"id" is required (non-empty string)')
    else if (ids.has(q.id)) err(path, `duplicate id "${q.id}"`)
    else ids.add(q.id)
    if (typeof q.text !== 'string') err(path, '"text" must be a string (use "" if empty)')
    if (depth === 0 && q.number != null && typeof q.number !== 'string') err(path, '"number" must be a string')
    if (depth > 0 && (typeof q.label !== 'string')) err(path, 'sub-question needs a string "label" (e.g. "i" or "a")')
    if (q.marks != null && typeof q.marks !== 'number') err(path, '"marks" must be a number or null')
    if (q.options != null) {
      if (!Array.isArray(q.options)) err(path, '"options" must be an array')
      else q.options.forEach((o, i) => {
        if (!isObj(o) || typeof o.label !== 'string' || typeof o.text !== 'string') {
          err(`${path}.options[${i}]`, 'must be { "label": string, "text": string }')
        }
      })
    }
    if (q.subquestions != null) {
      if (!Array.isArray(q.subquestions)) err(path, '"subquestions" must be an array')
      else q.subquestions.forEach((s, i) => checkNode(s, `${path}.subquestions[${i}]`, depth + 1))
    }
  }

  paper.sections.forEach((sec, si) => {
    const sp = `sections[${si}]`
    if (!isObj(sec)) return err(sp, 'must be an object')
    if (typeof sec.name !== 'string') err(sp, '"name" must be a string')
    if (sec.marks != null && typeof sec.marks !== 'number') err(sp, '"marks" must be a number or null')
    if (sec.instructions != null && (!Array.isArray(sec.instructions) || sec.instructions.some((t) => typeof t !== 'string'))) {
      err(sp, '"instructions" must be an array of strings')
    }
    if (!Array.isArray(sec.questions)) err(sp, '"questions" must be an array')
    else sec.questions.forEach((q, qi) => checkNode(q, `${sp}.questions[${qi}]`, 0))
  })
  return errors
}
