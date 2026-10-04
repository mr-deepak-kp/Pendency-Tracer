# Pendency Tracing Tools (React)

A React rewrite of the Pendency Tracing Tool — upload one or more billing
Excel files, get instant pendency summary metrics, filter by month, and
download a styled Excel report (filtered to the selected month, or all
months combined).

## Features

- **Multi-file upload** — drag & drop or browse, select several `.xlsx`/`.xls`
  files at once; all rows are merged automatically.
- **Auto column detection** — finds `AgencyInvoiceUploaded`,
  `CedmapToAgencyWithoutGST`, and a Month/Date column even if the header
  name varies slightly.
- **Month filter** — a dropdown (auto-populated from your data) filters
  the on-screen summary cards and table live.
- **Styled Excel export** — the downloaded report has colored headers,
  zebra-striped rows, and borders (via `xlsx-populate`, since the free
  SheetJS build can't write cell styles). The download only contains the
  currently selected month's data (or everything, if "All Months" is picked).

## Project structure

```
src/
├── components/       # UploadArea, MonthFilter, SummaryCards, SummaryTable, ActionsBar
├── hooks/
│   └── usePendencyData.js   # all app state lives here
├── utils/
│   ├── excelReader.js       # reads uploaded files into JSON rows
│   ├── billingProcessor.js  # column detection + categorization logic
│   ├── monthUtils.js        # month label parsing/sorting
│   └── excelExporter.js     # builds the styled .xlsx download
├── App.jsx
└── App.css
```

## Run it locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

To build a production bundle:

```bash
npm run build      # outputs to dist/
npm run preview    # serve the built bundle locally to double-check it
```

## ⚠️ One thing to fix before you rely on this long-term

`npm install` will show a **high severity advisory for the `xlsx` package**.
This is a known, old issue with the version SheetJS publishes to the npm
registry — there's no fix published there. SheetJS's own recommended fix is
to install directly from their CDN instead:

```bash
npm uninstall xlsx
npm install https://cdn.sheetjs.com/xlsx-latest/xlsx-latest.tgz
```

This gets you their latest patched build. No code changes needed — the
import (`import * as XLSX from "xlsx"`) stays exactly the same.

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial React version of Pendency Tracing Tool"
git branch -M main
git remote add origin https://github.com/mr-deepak-kp/pendency-tracker-react.git
git push -u origin main
```

(Create an empty repo with this name on GitHub first.)

## Deploy

### Netlify (recommended)
1. netlify.com → sign in with GitHub
2. "Add new site" → "Import from GitHub" → select this repo
3. Build command: `npm run build`
4. Publish directory: `dist`

### Render
1. render.com → New → Static Site → connect this GitHub repo
2. Build command: `npm run build`
3. Publish directory: `dist`

Both platforms auto-redeploy on every `git push`.
