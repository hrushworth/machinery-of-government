# UK Government Organization Chart

An interactive web application for exploring the structure of the UK Government — showing how departments, ministers, agencies, public bodies, and other organisations relate to and oversee one another.

## Licence

Copyright © MMXXV Harry C. Rushworth. All rights reserved.

This project is proprietary software. The source code, design, and data structures may not be copied, reproduced, modified, distributed, or used to create derivative works without the prior explicit written permission of the copyright holder. See the [LICENSE](LICENSE) file for full terms.

### Third-party data

This application incorporates public sector data used under the Open Government Licence v3.0:

- **HM Treasury OSCAR** — 2024–25 Final Outturn budget data. © Crown Copyright.
- **Cabinet Office Civil Service Statistics 2025** — Headcount as at 31 March 2025. © Crown Copyright.

Contains public sector information licensed under the [Open Government Licence v3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).

---

## Features

### Navigation & Visualization
- **Interactive network graph** — click any node to focus it at the centre, with connections arranged radially around it
- **Element pane** — detailed sidebar with tabbed sections for Info, Powers, Budget, and Staff
- **Category pane** — click any category badge to see a description and full list of all elements of that type
- **Tag pane** — click any tag pill to see all organisations sharing that tag
- **Search pane** — full-text and tag-based search across all elements, with results grouped by category and tag
- **Help pane** — in-app guide accessible via the Help button in the header
- **Categories pane** — browse all element types grouped by section

### Element Detail Tabs

Each element's detail pane has up to four tabs, with a scrollable tab bar where needed:

**Info**
- Description, role title, current role holder
- Clickable tag pills (type and sector)
- All parent and child relationships, grouped by relationship type and clickable to navigate
- Link to GOV.UK page

**Powers**
- Powers, duties, functions, and responsibilities listed as cards
- Each entry shows the power type, date in force, and one or more legislative sources
- Sources link directly to [legislation.gov.uk](https://www.legislation.gov.uk) where available
- Sources include Acts of Parliament, Statutory Instruments, Royal Prerogative, case law, and constitutional convention
- Data entered for selected high-profile elements (Prime Minister, HM Treasury); more to be added

**Budget**
- 2024–25 final outturn spending from HM Treasury OSCAR data
- Headline figures: net expenditure, gross expenditure, income
- DEL / AME split shown as a proportional bar (Admin DEL, Programme DEL, Dept AME, Non-Dept AME)
- Spending breakdown with three views selectable via a switcher:
  - **By Type** — economic category (Pay, Goods & Services, Capital Investment, Current Grants, etc.)
  - **By Programme** — named Estimates row (e.g. "State Pension", "Universal Credit", "NHS Providers")
  - **By Body** — spend attributed to individual arm's-length bodies and agencies within the group
- Donut charts with hover tooltips and a full HTML legend — animated when switching views
- Clicking a pie slice for a body navigates to that body's element where one exists
- Link to the body's annual report collection on GOV.UK where known
- Budget data available for 37 department groups

**Staff**
- Civil service headcount as at 31 March 2025 from Civil Service Statistics 2025
- Summary total with breakdown by grade (SCS, Grade 6/7, SEO/HEO, EO, AA/AO, unreported)
- Where a department has sub-organisations, a toggle switches between grade view and by-organisation view
- Grade breakdown table shows per-organisation headcount across all grade bands
- Clicking a pie slice or table row for a sub-organisation navigates to that element where one exists
- Staff data available for all ministerial departments and major non-ministerial departments

### Classification System

Elements are classified by **category** and **subtype**:

**Officials**
- Prime Minister
- Cabinet Ministers
- Junior Ministers
- Civil Servants (Permanent Secretaries)
- Independent Officials (chairs, etc.)

**Departments**
- Ministerial Departments — led by a Secretary of State
- Non-Ministerial Departments — independent of direct ministerial control
- Executive Agencies — operational delivery bodies within departments
- Divisions / Directorates — major public-facing sub-units within departments

**Bodies**
- Executive NDPBs — arm's-length bodies with executive functions (regulators, public corporations, etc.)
- Advisory NDPBs — bodies providing independent advice to government
- Other Bodies — tribunals, ombudsmen, public corporations, and similar entities

**Groups**
- Cabinet — the collective decision-making body of senior ministers

### Tag System

Each element can carry one or more tags describing its **type** (e.g. Regulator, Museum / Gallery, Armed Forces) and **sector** (e.g. Health, Finance, Digital / Technology). Tags are colour-coded and clickable to browse all organisations sharing that tag.

---

## Data Coverage

`src/data/elements.ts` contains a comprehensive database of UK Government structure, including:

- All Cabinet ministers with current role holders
- All junior ministers across every department
- Permanent Secretaries for all major departments
- All 20+ ministerial departments
- All non-ministerial departments
- 40+ executive agencies
- 100+ executive and advisory NDPBs
- Arms-length bodies, tribunals, ombudsmen, regulators, and public corporations
- Government professions and cross-cutting functions (Cabinet Office)
- Sub-bodies and subsidiary organisations

`src/data/powers.ts` contains powers and legislation data for selected elements.

`src/data/budgets-oscar.json` contains 2024–25 outturn budget data for 37 department groups, pre-processed from HM Treasury OSCAR data by `scripts/extract-oscar.mjs`. Body lines include an `elementId` field where the body has a matching element in `elements.ts`, enabling pie-slice click navigation.

`src/data/staffing.ts` contains Civil Service headcount data as at 31 March 2025 for all ministerial departments and major non-ministerial departments, with per-grade breakdowns and sub-organisation detail. The `getStaffProfile()` helper derives sub-organisation profiles at runtime from parent data without duplication.

---

## Tech Stack

- **React 18** — UI framework
- **TypeScript** — type-safe JavaScript
- **Vite** — build tool and dev server
- **Cytoscape.js** — network/graph visualization
- **Recharts** — budget and staff donut charts
- **SheetJS (xlsx)** — OSCAR spreadsheet parsing (extraction script only)
- **CSS3** — component-scoped styling

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation & Development

```bash
# Install dependencies
npm install

# Start development server (available at http://localhost:5173)
npm run dev
```

If port 5173 is in use, specify an alternative:
```bash
npm run dev -- --port 3000
```

### Building for Production

```bash
npm run build        # outputs to dist/
npm run preview      # preview the production build locally
```

---

## Project Structure

```
src/
├── components/
│   ├── OrgChart.tsx            # Cytoscape network visualization
│   ├── OrgChart.css
│   ├── ElementDetails.tsx      # Element detail pane (Info / Powers / Budget / Staff tabs)
│   ├── ElementDetails.css
│   ├── BudgetTab.tsx           # Budget tab with donut charts and breakdown switcher
│   ├── BudgetTab.css
│   ├── StaffTab.tsx            # Staff tab with grade and org breakdown
│   ├── StaffTab.css
│   ├── InfoPane.tsx            # Help / about pane
│   ├── InfoPane.css
│   ├── CategoryInfo.tsx        # Category info & element list pane
│   ├── CategoryInfo.css
│   ├── CategoriesPane.tsx      # Browse all categories pane
│   ├── CategoriesPane.css
│   ├── TagInfo.tsx             # Tag info & element list pane
│   ├── TagInfo.css
│   ├── SearchPane.tsx          # Search and filter pane
│   └── SearchPane.css
├── data/
│   ├── elements.ts             # All government element data and tag definitions
│   ├── powers.ts               # Powers, duties, and legislation data
│   ├── budgets.ts              # Budget types and import of OSCAR JSON
│   ├── budgets-oscar.json      # Pre-processed 2024–25 outturn data (37 depts)
│   └── staffing.ts             # Civil Service headcount data (2025)
├── utils/
│   └── colors.ts               # Element colour scheme
├── App.tsx                     # Main app component and state management
├── App.css                     # App layout and panel ordering
├── main.tsx                    # React entry point
└── index.css                   # Global styles

scripts/
└── extract-oscar.mjs           # OSCAR spreadsheet → budgets-oscar.json
```

---

## Data Structures

### GovElement (`src/data/elements.ts`)

```typescript
{
  id: string                   // unique identifier (kebab-case)
  name: string                 // display name
  category: 'official' | 'department' | 'body' | 'group'
  subtype: string              // see classification system above
  description: string          // overview
  role?: string                // role title (officials only)
  currentHolder?: string       // person currently in the role
  infoUrl?: string             // link to GOV.UK page
  parentIds: string[]          // elements this reports to / is part of
  childIds: string[]           // elements this oversees / contains
  tags?: string[]              // tag IDs from tagDefinitions
}
```

### PowerProfile (`src/data/powers.ts`)

```typescript
{
  elementId: string
  lastReviewed?: string        // ISO date
  powers: Array<{
    id: string
    title: string
    description: string
    powerType: 'power' | 'duty' | 'function' | 'responsibility'
    inForceFrom?: string
    sources: Array<{
      type: 'act' | 'statutory-instrument' | 'prerogative' | 'case-law' | 'convention'
      title: string
      section?: string
      year?: number
      legislationUrl?: string  // links to legislation.gov.uk
      caseRef?: string
    }>
    notes?: string
  }>
}
```

### BudgetProfile (`src/data/budgets.ts`)

```typescript
{
  elementId: string
  oscarDeptGroupCode: string | null   // e.g. "DOH033.GROUP"
  budgets: Array<{
    financialYear: string              // e.g. "2024-25"
    totalNetExpenditure: number        // £ thousands
    totalGrossExpenditure: number
    totalIncome: number                // negative
    unit: 'thousands'
    delAdmin?: number
    delProg?: number
    deptAme?: number
    nonDeptAme?: number
    expenditureLines: BudgetLine[]     // by economic type
    incomeLines: BudgetLine[]
    programmeLines: BudgetLine[]       // by named Estimates row
    programmeIncomeLines: BudgetLine[]
    bodyLines: BudgetLine[]            // by arm's length body
    bodyIncomeLines: BudgetLine[]
    annualReportUrl: string | null
    sourceLabel: string
  }>
}

// BudgetLine
{
  label: string
  amount: number        // £ thousands; positive = expenditure, negative = income
  elementId?: string    // element ID to navigate to when the slice is clicked
  notes?: string
}
```

### StaffProfile (`src/data/staffing.ts`)

```typescript
{
  elementId: string
  year: string                 // e.g. "2024-25"
  grades: GradeBreakdown       // total + scs, g67, sheo, eo, aaao, other
  orgs: Array<{
    label: string
    orgId?: string             // element ID for navigation
    grades: GradeBreakdown
  }>
}
```

Use `getStaffProfile(elementId)` — this searches both top-level profiles and sub-organisation arrays, so sub-orgs like executive agencies can be looked up without duplicating data.

Tags are defined in the `tagDefinitions` record with a label, category (`'type'` or `'sector'`), and hex colour.

---

## Refreshing Budget Data

Budget data is pre-processed from HM Treasury OSCAR spreadsheets.

1. Download the new OSCAR file from [GOV.UK OSCAR publications](https://www.gov.uk/government/publications/oscar-publications)
2. Place it in the project root and update the filename in `scripts/extract-oscar.mjs`
3. Update `BODY_LABEL_TO_ELEMENT` in `extract-oscar.mjs` if any body names have changed
4. Run: `node scripts/extract-oscar.mjs`
5. The script overwrites `src/data/budgets-oscar.json`

The OSCAR file uses `TYPE_LONG_NAME` to distinguish row types. Both `FINAL OUTTURN` and `IN-YEAR RETURN` rows must be summed; `NON-BUDGET` rows are excluded. All figures are in £ thousands; negative values represent income or receipts.

---

## Adding Powers Data

To add powers, duties, or responsibilities for an element, add an entry to the `powerProfiles` record in `src/data/powers.ts`, keyed by the element's ID from `elements.ts`. Sources should include a `legislationUrl` pointing to the relevant section on [legislation.gov.uk](https://www.legislation.gov.uk) where possible.

---

## Visualization Controls

| Action | Control |
|--------|---------|
| Select an element | Click a node |
| Pan the chart | Click and drag |
| Zoom | Scroll wheel |
| Navigate to related element | Click a parent/child in the element pane |
| Navigate via budget/staff pie | Click a labelled slice |
| Open category pane | Click the category badge in the element pane |
| Open tag pane | Click a tag pill in the element pane |
| Search | Click the Search button in the header |
| Browse categories | Click the Categories button in the header |
| Open help / about | Click the Help button in the header |

---

## Future Development

Potential enhancements:
- Powers and legislation data for more elements
- Multi-year budget comparisons
- Historical tracking of organisational changes
- API integration with live GOV.UK data
- Export and sharing of org chart views
#   M a c h i n e r y - o f - G o v e r n m e n t  
 