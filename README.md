# 📊 Pendency Tracing Tools

A free, browser-based tool to automatically analyze billing/invoice Excel data, categorize payment pendency, filter by month, and export a clean, styled summary report — no backend, no installation, no data leaves your browser.

🔗 **Live Demo:** [https://pendency-tracer.netlify.app](https://pendency-tracer.netlify.app)

---

## 🧩 What problem does it solve?

Manually tracking which bills are prepared, which are pending, and which are paid across multiple monthly Excel sheets is slow and error-prone. This tool automates that entire process — upload your raw billing data, and get instant categorized insights.

---

## ✨ Features

- **📂 Multi-file upload** — drag & drop or browse; upload several files at once and they're automatically merged into one dataset.
- **📑 Flexible file formats** — accepts Excel (`.xlsx`, `.xls`, `.xlsm`, `.xlsb`), CSV, ODS (LibreOffice/OpenOffice), TSV, and more — not locked to one format.
- **🔍 Smart column detection** — automatically finds the relevant columns (invoice status, amount, month/date) even if header names vary slightly, so it works across differently-formatted sheets.
- **📊 Automatic pendency categorization**
  - Bill Not Prepared
  - Bill Prepared
  - Bill Prepared but Payment Not Received
  - Total Amount (auto-summed, excluding blanks/zeros)
- **📅 Month detection & filtering** — automatically detects every month present in the uploaded data and lets you filter the entire dashboard to a single month with one click.
- **📈 Live summary dashboard** — 6 metric cards + a detailed breakdown table, updating instantly as you change the month filter.
- **📥 Styled Excel export** — download a multi-sheet `.xlsx` report (Summary + 3 category sheets) with colored headers, zebra-striped rows, and clean borders — matching exactly what's currently filtered on screen (single month, or all months).
- **🔒 100% client-side** — all processing happens in your browser. No file is ever uploaded to a server, so your data stays private.
- **📱 Responsive design** — works on desktop and mobile.

---

## 💼 Who can use this?

This tool is built for any organization that manages billing/invoice data across multiple agencies or vendors — particularly useful for:

- Organizations tracking contract-labour or manpower agency payments
- Teams managing monthly invoice reconciliation across multiple vendors

Just upload your Excel/CSV file(s) with invoice status and amount columns — the tool adapts to common header name variations automatically.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite |
| Excel/CSV reading | [SheetJS (xlsx)](https://sheetjs.com/) |
| Styled Excel export | [xlsx-populate](https://github.com/dtjohnson/xlsx-populate) |
| Styling | Plain CSS (custom design system) |
| Hosting | Netlify (CI/CD auto-deploy from GitHub) |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── UploadArea.jsx       # drag & drop / file picker
│   ├── MonthFilter.jsx      # month dropdown
│   ├── SummaryCards.jsx     # 6 metric cards
│   ├── SummaryTable.jsx     # detailed breakdown table
│   └── ActionsBar.jsx       # file info, filter, download, reset
├── hooks/
│   └── usePendencyData.js   # all app state & logic orchestration
├── utils/
│   ├── excelReader.js       # parses uploaded files into rows
│   ├── billingProcessor.js  # column detection + categorization logic
│   ├── monthUtils.js        # month label parsing/sorting
│   └── excelExporter.js     # builds the styled .xlsx download
├── App.jsx
└── App.css
```

---

## 🚀 Run Locally

```bash
git clone https://github.com/mr-deepak-kp/Pendency-Tracer.git
cd Pendency-Tracer
npm install
npm run dev
```

Opens at `http://localhost:5173`.

Build for production:
```bash
npm run build
npm run preview
```

---

## 📋 Expected Input Columns

The tool looks for these columns (name matching is flexible/case-insensitive):

| Purpose | Accepted column names |
|---|---|
| Invoice status | `AgencyInvoiceUploaded` |
| Amount | `AgencyWithoutGST` |
| Month/Date | `Month`, `Bill Date`, `Invoice Date`, `Period`, etc. |

---

---

## 👤 Author

**Deepak Kumar Prasad** 
 | Aspiring Data Analyst |
🔗 [GitHub](https://github.com/mr-deepak-kp)

---

## 📄 License

This project is open for personal/portfolio use.
