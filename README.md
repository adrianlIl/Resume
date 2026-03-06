# Resume (Vue)

Professional online resume built with **Vue 3 + Vite + TypeScript + Tailwind CSS**.

## Project structure

- `site/`: the Vue app
- `site/src/resume/resume.ts`: **edit this file to update your resume content**

## Requirements

- Node.js (LTS recommended)
- npm

## Getting started

```bash
cd site
npm install
npm run dev
```

Then open the local URL printed in your terminal.

## Build & preview

```bash
cd site
npm run build
npm run preview
```

## Edit your resume

Update the data in:

- `site/src/resume/resume.ts`

The UI automatically renders:

- Basics (name / headline / summary / links)
- Experience
- Projects
- Skills
- Education

## Print / Export PDF

Use the **Print / PDF** button in the top-right.

- In Chrome/Edge: Print → Destination “Save as PDF”
- Paper size: A4 (recommended)

## Notes

- This repo includes a `.npmrc` to ensure npm uses `registry.npmjs.org` (some environments block certain mirrors).

