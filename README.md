# Machinery of Government

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

### Views

**Focus view** (default)
The selected element is placed at the centre with its parents, grandparents, children, and grandchildren arranged radially. Click any node to re-focus the chart. The ↺ button resets the layout.

**Full view**
Every element in the network is shown simultaneously, arranged in concentric rings by constitutional distance from the Prime Minister:
- Ring 0 — Prime Minister
- Ring 1 — Cabinet Ministers
- Ring 2 — Junior Ministers
- Ring 3 — Ministerial and Non-Ministerial Departments
- Ring 4 — Executive Agencies and Divisions/Directorates
- Ring 5+ — All other bodies, placed by BFS distance from the nearest ring-1–4 node

Node names are hidden by default. Hover any node to reveal its name and highlight its full ancestor chain (all parents, grandparents, etc.) plus direct children. Click to pin the highlight and open the element pane. Click on the background to clear the pin. The ↺ button re-centres on the PM.

When the search pane is open in full view, matching elements are highlighted across the whole network and all edges are hidden, making it easy to see where a filtered set of organisations sits in the network.

**Dark / light mode**
Toggle between light and dark appearances via the header button (desktop) or the moon/sun icon in the mobile navigation bar.

### Navigation & Visualization
- **Interactive network graph** — click any node to focus it; connections arranged radially in focus view
- **Element pane** — detailed sidebar with tabbed sections for Info, Powers, Budget, and Staff
- **Category pane** — click any category badge to see a description and full list of all elements of that type
- **Tag pane** — click any tag pill to see all organisations sharing that tag
- **Search pane** — full-text and tag-based search across all elements; in full view, results are highlighted live on the network
- **Help pane** — in-app guide accessible via the Help button
- **Categories pane** — browse all element types grouped by section

### Element Detail Tabs

Each element's detail pane has up to four tabs:

**Info**
- Description, role title, current role holder
- Clickable tag pills (type and sector)
- All parent and child relationships, grouped by relationship type and clickable to navigate
- Link to GOV.UK page

**Powers**
- Powers, duties, functions, and responsibilities listed as cards, filterable by type
- Each entry shows the power type, date in force, and one or more legislative sources
- Sources link directly to [legislation.gov.uk](https://www.legislation.gov.uk) where available
- Data entered for all Cabinet ministers, the PM, the Comptroller and Auditor General, the Investigatory Powers Commissioner, and other key officials

**Budget**
- 2024–25 final outturn spending from HM Treasury OSCAR data
- Headline figures: net expenditure, gross expenditure, income
- DEL / AME split shown as a proportional bar
- Spending breakdown with three views: By Type, By Programme, By Body
- Donut charts with hover tooltips; clicking a body slice navigates to that element
- Budget data available for 37 department groups

**Staff**
- Civil Service headcount as at 31 March 2025
- Grade breakdown (SCS, Grade 6/7, SEO/HEO, EO, AA/AO)
- For departments, a toggle switches between grade view and by-organisation view
- Clicking a sub-organisation row navigates to that element

### Classification System

| Category | Subtypes |
|----------|----------|
| Official | Prime Minister, Cabinet Minister, Junior Minister, Civil Servant, Independent Official |
| Department | Ministerial Department, Non-Ministerial Department, Executive Agency, Division / Directorate |
| Body | Executive NDPB, Advisory NDPB, Public Corporation, Royal Charter Body, Tribunal, Other Body |
| Group | Cabinet, Other Group |

### Tag System

Each element can carry **type tags** (e.g. Regulator, Museum / Gallery, Armed Forces) and **sector tags** (e.g. Health, Finance, Digital / Technology). Tags are colour-coded, clickable in the element pane, and filterable in the search pane. In full view, tag filters highlight the matching elements across the entire network.

---

## Data Coverage

`src/data/elements.ts` — comprehensive database of UK Government structure:
- All Cabinet ministers with current role holders
- All junior ministers across every department
- Permanent Secretaries and key independent officials
- All ministerial and non-ministerial departments
- 40+ executive agencies
- 100+ executive and advisory NDPBs
- Arms-length bodies, tribunals, ombudsmen, regulators, and public corporations
- Government professions and cross-cutting functions (Cabinet Office)

`src/data/powers.ts` — powers and legislation data for:
- All 19 Cabinet ministers (comprehensive coverage of statutory powers, duties, functions, and responsibilities)
- The Prime Minister (33+ entries covering constitutional and statutory powers)
- The Investigatory Powers Commissioner
- The Comptroller and Auditor General
- Key independent officials

`src/data/budgets-oscar.json` — 2024–25 outturn budget data for 37 department groups, pre-processed from HM Treasury OSCAR data.

`src/data/staffing.ts` — Civil Service headcount as at 31 March 2025 for all ministerial departments and major non-ministerial departments, with per-grade breakdowns and sub-organisation detail.

---

## Tech Stack

- **React 18** + **TypeScript** via **Vite 5**
- **Cytoscape.js** — network graph (both focus and full views)
- **Recharts** — budget and staff donut charts
- **CSS3** — component-scoped styling with CSS custom property-based dark mode

---

## Getting Started

### Prerequisites

Node.js 18+ and npm.

### Development

```bash
npm install
npm run dev        # http://localhost:5173
```

### Production build

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
```

---

## Project Structure

```
src/
├── components/
│   ├── OrgChart.tsx / .css         # Focus view — Cytoscape radial layout
│   ├── FullView.tsx / .css         # Full view — all elements, concentric ring layout
│   ├── ElementDetails.tsx / .css   # Element detail pane (Info / Powers / Budget / Staff)
│   ├── BudgetTab.tsx / .css        # Budget tab
│   ├── StaffTab.tsx / .css         # Staff tab
│   ├── InfoPane.tsx / .css         # Help / about pane
│   ├── CategoryInfo.tsx / .css     # Category info & element list
│   ├── CategoriesPane.tsx / .css   # Browse all categories
│   ├── TagInfo.tsx / .css          # Tag info & element list
│   └── SearchPane.tsx / .css       # Search and filter pane
├── data/
│   ├── elements.ts                 # All government element data and tag definitions
│   ├── powers.ts                   # Powers, duties, and legislation data
│   ├── budgets.ts                  # Budget types and OSCAR JSON import
│   ├── budgets-oscar.json          # Pre-processed 2024–25 outturn data
│   └── staffing.ts                 # Civil Service headcount data (2025)
├── utils/
│   └── colors.ts                   # Element colour scheme
├── App.tsx                         # Main app, state management, dark mode, view mode
├── App.css                         # Layout, panel ordering, responsive breakpoints, dark mode tokens
└── main.tsx                        # React entry point

scripts/
└── extract-oscar.mjs               # OSCAR xlsx → budgets-oscar.json
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
  description: string
  role?: string                // role title (officials only)
  currentHolder?: string       // person currently in the role
  infoUrl?: string             // link to GOV.UK page
  parentIds: string[]          // elements this reports to / is part of
  secondaryParentIds?: string[] // additional oversight relationships (e.g. junior minister → dept)
  tags?: string[]              // tag IDs from tagDefinitions
}
```

Reverse lookups are computed at module load time:
- `getChildIds(id)` — elements that list `id` in their `parentIds`
- `getSecondaryChildIds(id)` — elements that list `id` in their `secondaryParentIds`
- `getConnectedElements(id)` — returns `{ parents, children, secondaryParents, secondaryChildren }`

### PowerProfile (`src/data/powers.ts`)

```typescript
{
  elementId: string
  lastReviewed?: string
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
      legislationUrl?: string
      caseRef?: string
    }>
    notes?: string
  }>
}
```

### BudgetProfile and StaffProfile

See the existing `budgets.ts` and `staffing.ts` type definitions. Use `getStaffProfile(elementId)` — it searches both top-level profiles and sub-organisation arrays so agencies can be looked up without duplicating data.

---

## Visualization Controls

| Action | Control |
|--------|---------|
| Select an element | Click a node |
| Pan | Click and drag |
| Zoom | Scroll wheel / pinch |
| Reset focus layout / re-centre full view | ↺ button (top-right of chart) |
| Switch focus ↔ full view | ⊞ Full / ⊡ Focus button |
| Toggle dark / light mode | ☾ Dark / ☀ Light button (header or mobile nav) |
| Navigate to related element | Click a parent/child in the element pane |
| Open category pane | Click the category badge in the element pane |
| Open tag pane | Click a tag pill in the element pane |
| Search | Search button in the header / mobile nav |
| Browse categories | Categories button in the header / mobile nav |
| Help | Help / ? button in the header / mobile nav |

---

## Refreshing Budget Data

```bash
# 1. Place new BUD_xx-xx.xlsx in project root
# 2. Update filename in scripts/extract-oscar.mjs
# 3. Run:
node scripts/extract-oscar.mjs
```

Update `BODY_LABEL_TO_ELEMENT` in the script if any body names have changed or new elements have been added.

---

## Adding Powers Data

Add an entry to `src/data/powers.ts` keyed by the element's ID from `elements.ts`. Use `legislationUrl` pointing to legislation.gov.uk for sources where possible.

---

## Disclaimer

The information in this application is provided for general reference purposes only. While every effort has been made to ensure accuracy, the data may be incomplete, incorrect, or out of date. Government structures, ministerial appointments, and organisational relationships change frequently. The author makes no representations or warranties of any kind, express or implied, as to the accuracy, completeness, or fitness for any particular purpose of the information contained herein. The author accepts no liability whatsoever for any loss, damage, or inconvenience arising from reliance on information in this application. Always verify against official sources such as [GOV.UK](https://www.gov.uk/government/organisations).
