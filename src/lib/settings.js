export const FONTS = [
  { label: 'Times New Roman', value: '"Times New Roman", Tinos, Times, serif' },
  { label: 'Tinos (Times-like)', value: 'Tinos, "Times New Roman", serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Noto Serif', value: '"Noto Serif", serif' },
  { label: 'Lora', value: 'Lora, serif' },
  { label: 'Merriweather', value: 'Merriweather, serif' },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Roboto', value: 'Roboto, sans-serif' },
]

export const DEFAULTS = {
  fontFamily: FONTS[0].value,
  fontSize: 11, // pt
  lineHeight: 1.4,
  gap: 11, // pt between questions
  subGap: 7, // pt between sub-questions
  justify: true,
  marginTop: 18, // mm
  marginBottom: 18,
  marginLeft: 20,
  marginRight: 15,
  showHeader: true,
  time: '3 Hours',
  date: '',
  showMarks: true,
  showPageNumbers: true,
  footerText: '',
  zoom: 0.8,
  // cover page
  showCover: true,
  coverHeadings: [], // extra heading lines under the institution name: { show, text }
  cover: {
    logo: { show: true },
    institution: { show: true, text: 'Institution Name' },
    pageNo: { show: true, text: 'Page No. 1/{total}' },
    subjectCode: { show: true, text: 'Subject Code : J-261' },
    seat: { show: true, text: 'Seat No.', boxes: 7 },
    date: { show: true, text: 'DATE : 22/06/2026' },
    time: { show: true, text: 'Time : 11.00 - 2.00' },
    subject: { show: true, text: 'SUBJECT : {SUBJECT} (55)' },
    medium: { show: true, text: 'E' },
    duration: { show: true, text: 'DURATION : 3 Hours' },
    totalPages: { show: true, text: 'TOTAL PAGES : {total}' },
    totalMarks: { show: true, text: 'TOTAL MARKS : {marks}' },
    title: { show: true, text: 'General Instructions :' },
    intro: { show: true, text: 'The question paper is divided into four sections.' },
    pto: { show: true, text: 'End of Page 1 (P.T.O.)' },
  },
  instructions: [
    { show: true, head: 'Section A :', text: 'Q. No. 1 contains Ten multiple choice type of questions carrying One mark each. Only the first attempt will be considered for evaluation.\nQ. No. 2 contains Eight very short answer type of questions carrying One mark each.' },
    { show: true, head: 'Section B :', text: 'Q. No. 3 to Q. No. 14 are Twelve short answer type of questions carrying Two marks each. (Attempt any Eight)' },
    { show: true, head: 'Section C :', text: 'Q. No. 15 to Q. No. 26 are Twelve short answer type of questions carrying Three marks each. (Attempt any Eight)' },
    { show: true, head: 'Section D :', text: 'Q. No. 27 to Q. No. 31 are Five long answer type of questions carrying Four marks each. (Attempt any Three)' },
    { show: true, head: '', text: 'Use of log table is allowed. Use of calculator is not allowed.' },
    { show: true, head: '', text: 'Figures to the right indicate full marks.' },
    { show: true, head: 'Physical Constants :', text: "(1) Avogadro's Number = $\\text{N}_\\text{A}$ = $6.022 \\times 10^{23}$\n(2) Gas constant R = $0.08206\\ \\text{L-atm K}^{-1}\\text{ mol}^{-1}$ / $8.314\\ \\text{JK}^{-1}\\text{ mol}^{-1}$\n(3) 1 Faraday = (F) = 96500 Coulombs" },
  ],
}

export const MM = 96 / 25.4 // px per mm

export const COVER_FIELDS = [
  ['logo', 'Logo', false],
  ['institution', 'Institution name', true],
  ['pageNo', 'Page number box', true],
  ['subjectCode', 'Subject code box', true],
  ['seat', 'Seat number label', true],
  ['date', 'Date', true],
  ['time', 'Time', true],
  ['subject', 'Subject line', true],
  ['medium', 'Medium / set box', true],
  ['duration', 'Duration', true],
  ['totalPages', 'Total pages', true],
  ['totalMarks', 'Total marks', true],
  ['title', 'Instructions title', true],
  ['intro', 'Intro line', true],
  ['pto', 'Bottom note', true],
]
