# Question Paper Formatter

Turns a question-paper JSON into print-ready A4 pages (cover page, instructions, typography, page breaks).

## Run
    npm install
    npm run dev        # development
    npm run build      # production build -> dist/ (static, relative paths, hash routing)
    npm run preview    # serve the production build locally

The build is a static site: deploy `dist/` to any static host (Netlify, Vercel, GitHub Pages, S3 ...). No server rewrites are needed.

## Usage
1. Home page: copy the **LLM prompt**, give it to any AI together with your question paper.
2. **Import** the JSON it returns (upload, drop or paste). It is validated and errors are listed.
3. Adjust typography, margins and cover page, then **Print / Save as PDF** (A4, margins: None).

Sample data lives in `src/data/sample.json` (committed). `src/data/test.json` is git-ignored and not used by the app.
