// Prompt that can be pasted into any LLM (together with the question paper) to get an app-ready JSON.
export const LLM_PROMPT = String.raw`You are an expert exam-paper digitiser. I will give you a question paper (typed text, PDF, scanned image or photo). Convert it into ONE JSON document that follows the schema and rules below EXACTLY.

OUTPUT FORMAT
- Reply with the JSON ONLY. No explanation, no comments, no markdown, no code fences, no text before or after.
- The JSON must be valid: double quotes, no trailing commas, no comments.

SCHEMA
{
  "title": "string - paper title",
  "subject": "string - subject name, e.g. Chemistry",
  "total_marks": 70,
  "sections": [
    {
      "id": "section-a",
      "name": "Section A",
      "marks": 16,
      "instructions": ["Attempt any EIGHT of the following questions."],
      "questions": [
        {
          "id": "q3",
          "number": "3",
          "text": "Question text",
          "type": "direct",
          "marks": null,
          "options": [],
          "subquestions": []
        }
      ]
    }
  ]
}

Every question AND every sub-question uses this same object shape:
{
  "id": "unique string",
  "number": "main question number as a string, e.g. \"12\" (sub-questions: same value as label)",
  "label": "sub-questions only: label as printed WITHOUT brackets, e.g. \"i\" or \"a\"",
  "text": "the question text, or \"\" if there is none",
  "type": "direct | mcq | mcq_group | question_group",
  "marks": null,
  "options": [],
  "subquestions": []
}

FIELD RULES
1. Keep the original order, wording and numbering. Fix only obvious OCR/typing errors. Do NOT answer the questions and do NOT invent content.
2. One entry in "sections" per printed section (Section A, B, C ...). If the paper has no sections, use a single section named "Section A".
3. Section "marks" = total marks the section is worth after applying its choice rule (e.g. "Attempt any 8 of 12 questions of 2 marks" => 16). Use null if it cannot be worked out.
4. Section "instructions" = every instruction printed under the section heading, one string each (e.g. "Attempt any THREE of the following."). Use [] if none. Do NOT put the general instructions from the front page here.
5. "type":
   - "direct": a normal question with no sub-parts.
   - "question_group": a question that has sub-parts (a), (b), (c) or (i), (ii)...  Put the common stem in "text" ("" if there is none) and the parts in "subquestions".
   - "mcq_group": a question made of several multiple-choice questions (e.g. "Q.1 Select and write the correct answer"). Put the MCQs in "subquestions", each with "type": "mcq".
   - "mcq": a single multiple-choice question. Its "options" has one entry per choice.
6. "marks": put the marks on the main question when the marks of the whole question are printed (e.g. Q.1 carries 10 marks => "marks": 10). Otherwise null. Sub-questions get marks only if their own marks are printed next to them.
7. "options": for MCQs use [{ "label": "a", "text": "..." }, ...] with lowercase labels as printed. For every non-MCQ use [].
8. Sub-parts can be nested to any depth (a sub-question may have its own "subquestions", e.g. Q31 (b) (i) (ii)).
9. If a question is printed twice as an alternative ("OR"), output two separate question objects in the printed order, each with its own unique id (e.g. "q6" and "q6-alt"). If a printed number is missing, use "".
10. "id" values must be UNIQUE across the whole document and use this pattern: sections "section-a"; questions "q1", "q2"; sub-questions "q1-i", "q2-a"; nested "q31-b-i".
11. Diagrams, figures and graphs cannot be displayed. Replace each with a short bracketed description inside "text", e.g. "[Figure: circuit with two resistors in series]". Tables: rewrite the rows as lines separated by "\n" with " | " between cells.
12. A line break inside a text is written as \n. Never use HTML or markdown inside strings.
13. "total_marks" = the maximum marks printed on the paper (number). "title" and "subject" come from the paper heading.

MATHS / SCIENCE FORMATTING (VERY IMPORTANT)
The app renders LaTeX with KaTeX.
A. Write EVERY formula, equation, symbol, chemical formula, ion, unit with a power/subscript, Greek letter, fraction, root and mathematical expression in LaTeX between single dollar signs: $ ... $ (inline only; never use $$ ... $$, \( \) or \[ \]).
B. Because the output is JSON, every backslash must be doubled: write "\\frac{a}{b}", "\\text{NaOH}", "\\times", "\\Delta", "\\longrightarrow".
C. Plain words stay OUTSIDE the dollar signs. Do not wrap whole sentences in $...$. Use \\text{...} for letters/words that must stay upright inside a formula (chemical symbols, units, labels).
D. Never use Unicode super/subscripts or special symbols such as x2, 10^-3, H2SO4 written plainly, ⁻¹, ², ₂, °, ×, →, ⇌, Δ, α, β. Write them in LaTeX instead.
E. Do not use a literal dollar sign for currency; write "Rs." or "USD".
F. Examples (as they must appear inside the JSON strings):
   chemical formula : "$\\text{H}_2\\text{SO}_4$", "$\\text{BrF}_3$", "$\\text{CaCl}_2$"
   ions             : "$\\text{Cu}^{2+}$", "$\\text{SO}_4^{2-}$"
   reaction         : "$\\text{C}_2\\text{H}_4 + \\text{H}_2 \\longrightarrow \\text{C}_2\\text{H}_6$"
   reversible       : "$\\text{N}_2 + 3\\text{H}_2 \\rightleftharpoons 2\\text{NH}_3$"
   units            : "$2\\text{ kJ}$", "$0.050\\text{ M}$", "$20.0\\text{ cm}^3$", "$\\text{mol dm}^{-3}$", "$25^\\circ\\text{C}$"
   scientific       : "$1.5 \\times 10^{10}\\text{ s}$", "$K_{sp} = 1.7 \\times 10^{-6}$"
   symbols          : "$\\Delta G^\\circ$", "$\\alpha$-helix", "$\\pi r^2$"
   fractions / roots: "$\\frac{a+b}{2}$", "$\\sqrt{x^2+y^2}$", "$\\int_0^1 x\\,dx$"
   plain number with no unit can stay as normal text (e.g. "Q. 5 marks").

SELF-CHECK BEFORE YOU REPLY
- The whole reply parses as JSON.
- All "id" values are unique.
- Every backslash inside strings is doubled and every $ is closed.
- Every question/sub-question has all of: id, number, text, type, marks, options, subquestions (sub-questions also have label).
- The section marks add up to "total_marks".
- Nothing outside the JSON is in your reply.

SMALL EXAMPLE OF THE EXPECTED OUTPUT
{"title":"Physics Paper","subject":"Physics","total_marks":6,"sections":[{"id":"section-a","name":"Section A","marks":null,"instructions":["Answer all questions."],"questions":[{"id":"q1","number":"1","text":"","type":"mcq_group","marks":2,"options":[],"subquestions":[{"id":"q1-i","number":"i","label":"i","text":"The SI unit of force is","type":"mcq","marks":null,"options":[{"label":"a","text":"$\\text{N}$"},{"label":"b","text":"$\\text{J}$"},{"label":"c","text":"$\\text{W}$"},{"label":"d","text":"$\\text{Pa}$"}],"subquestions":[]}]},{"id":"q2","number":"2","text":"Answer the following","type":"question_group","marks":4,"options":[],"subquestions":[{"id":"q2-i","number":"i","label":"i","text":"State Newton's second law.","type":"direct","marks":null,"options":[],"subquestions":[]},{"id":"q2-ii","number":"ii","label":"ii","text":"Find $F$ if $m = 2\\text{ kg}$ and $a = 3\\text{ m s}^{-2}$.","type":"direct","marks":null,"options":[],"subquestions":[]}]}]}]}

NOW CONVERT THE QUESTION PAPER THAT I PROVIDE BELOW. Reply with the JSON only.`
