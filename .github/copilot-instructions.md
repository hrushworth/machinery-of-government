# Machinery of Government — Development Instructions

This file provides internal guidance for AI assistants (Claude Code, GitHub Copilot, etc.) working on this codebase. Read this before making changes.

---

## Stack

- **React 18 + TypeScript** via **Vite 5**
- **Cytoscape.js** — interactive network graph (both views)
- **Recharts** — pie/donut charts (PieChart, Pie, Tooltip, ResponsiveContainer)
- **CSS3** — component-scoped `.css` files; dark mode via CSS custom properties on `.app-dark`
- No Redux, no React Query — all state lives in `App.tsx` and component `useState`

---

## Project Layout

```
src/
├── components/
│   ├── OrgChart.tsx / .css       # Focus view — radial arc layout centred on selected element
│   ├── FullView.tsx / .css       # Full view — all elements in concentric rings from PM
│   ├── ElementDetails.tsx / .css # Detail pane with Info / Powers / Budget / Staff tabs
│   ├── BudgetTab.tsx / .css
│   ├── StaffTab.tsx / .css
│   ├── InfoPane.tsx / .css       # Help / about pane
│   ├── SearchPane.tsx / .css     # Full-text + tag search; emits onResultsChange for FullView highlight
│   ├── CategoryInfo.tsx / .css
│   ├── CategoriesPane.tsx / .css
│   └── TagInfo.tsx / .css
├── data/
│   ├── elements.ts               # All government elements; getChildIds / getSecondaryChildIds / getConnectedElements
│   ├── powers.ts                 # Powers, duties, functions, responsibilities keyed by element ID
│   ├── budgets.ts                # Budget types + OSCAR JSON import
│   ├── budgets-oscar.json        # Pre-processed 2024–25 outturn (37 depts) — do not hand-edit
│   └── staffing.ts               # Civil Service headcount 2025
├── utils/colors.ts               # Element colour palette
├── App.tsx                       # Top-level state: selectedElementId, viewMode, darkMode, searchHighlightIds
└── App.css                       # Flex layout, panel ordering, responsive breakpoints, dark mode tokens
```

---

## Key Architecture Decisions

### Two views (App.tsx)

`viewMode` state (`'focus'` | `'full'`) controls which chart component renders inside `.chart-container`. The ⊞ Full / ⊡ Focus toggle button sits absolutely inside `.chart-container` (not inside either chart component). Both views receive `darkMode` and `selectedElementId`.

### Panel system (App.tsx / App.css)

Five panels share a flex row using CSS `order`:
1. `category-pane` (order 1) — CategoryInfo / TagInfo
2. `element-pane` (order 2) — ElementDetails
3. `chart-container` (order 3) — OrgChart or FullView + toggle button
4. `search-panel` (order 4) — SearchPane
5. `info-panel` (order 5) — InfoPane or CategoriesPane

Header buttons (Dark, Help, Categories, Search) are mutually exclusive — opening one closes others.

### Dark mode (App.tsx / App.css)

`darkMode` boolean state. Applied as `.app-dark` class on the root `.app` div. CSS custom properties defined on `.app-dark`:
```css
--dm-bg, --dm-bg-subtle, --dm-bg-inset, --dm-border,
--dm-text, --dm-text-muted, --dm-text-faint,
--dm-link, --dm-accent-bg, --dm-tag-bg, --dm-tag-text,
--dm-input-bg, --dm-hover-bg
```
All dark mode overrides for pane components are written centrally in `App.css` under `.app-dark .classname` selectors — do not scatter them across component CSS files. Both chart components (`OrgChart`, `FullView`) receive a `darkMode` prop and apply it to Cytoscape stylesheet and background.

**Important:** Focus view (OrgChart) node labels remain `color: #333` in both modes — node fill colours are unchanged so text must stay dark.

### Element data (`src/data/elements.ts`)

All government elements are stored as a keyed record `Record<string, GovElement>`. IDs are kebab-case (e.g. `'home-office'`, `'cqc'`).

**No `childIds` field** — child relationships are computed at module load time via reverse lookup maps:
```ts
const _childrenByParent = new Map<string, string[]>()         // from parentIds
const _secondaryChildrenByParent = new Map<string, string[]>() // from secondaryParentIds
export function getChildIds(id: string): string[]
export function getSecondaryChildIds(id: string): string[]
```
When adding a new element, only set `parentIds` (and optionally `secondaryParentIds`). Do **not** add a `childIds` field — it will be ignored and is not part of the interface.

`secondaryParentIds` is used for junior ministers (who lead a department alongside the Secretary of State). The relationship renders as a dashed edge labelled "also leads" / "also sponsors".

### FullView ring layout (`src/components/FullView.tsx`)

Tier assignment (computed once at module load, not on every render):
- Tier 0: PM
- Tier 1: Cabinet ministers
- Tier 2: Junior ministers
- Tier 3: Ministerial + non-ministerial departments
- Tier 4: Executive agencies + division-directorates
- Tier 5+: BFS distance from any tier-1–4 node

Ring radii: 180 / 330 / 520 / 720 / 940 / 1160 / … px. Nodes sorted by subtype within each ring.

Node labels are hidden by default (`label: ''`). On hover, the hovered node and its full ancestor chain (all parents, grandparents, etc. via BFS up through `_allParents`) plus direct children are highlighted — everything else dimmed to 12% opacity. Hover is suppressed when `searchActiveRef.current` is true (search pane open).

### Search → FullView highlight

`SearchPane` accepts an `onResultsChange?: (ids: string[]) => void` prop. This fires whenever the filtered element list changes. `App` stores it as `searchHighlightIds` and passes it to `FullView` as `highlightIds` (only when `searchOpen`). `FullView` has a `useEffect` on `highlightIds`: when non-null, it dims all non-matching nodes, shows matching nodes with labels, and hides all edges. `searchActiveRef` (a ref, not state) is kept in sync so event handlers registered at mount can check it without stale closures.

### Budget data (`src/data/budgets-oscar.json` + `budgets.ts`)

Generated by `scripts/extract-oscar.mjs` from HM Treasury OSCAR xlsx. Do **not** hand-edit the JSON. The `BODY_LABEL_TO_ELEMENT` map controls which body lines get an `elementId` for pie-click navigation.

### Staff data (`src/data/staffing.ts`)

Hand-maintained. Source: Civil Service Statistics 2025, Table 20. Figures rounded to nearest 5. Sub-org profiles are **not** duplicated — `getStaffProfile(elementId)` searches parent `orgs[]` arrays at runtime.

### Mobile

Mobile is detected via `window.matchMedia('(max-width: 768px) and (pointer: coarse)')` — narrow desktop windows are not treated as mobile.

Mobile layout:
- Header buttons (Dark, Help, Categories, Search) are hidden; replaced by a fixed bottom nav bar
- Bottom nav has: Help, Categories, Search, dark mode toggle (moon/sun), view toggle (⊞/⊡), Details (when element selected)
- Element pane uses a draggable bottom sheet (states: `closed` | `partial` | `full`) instead of the sidebar
- The full view and focus view both work on mobile; touch pan/zoom is handled by Cytoscape natively

### Tab bar (ElementDetails.tsx)

Uses `ResizeObserver` + `scrollWidth > clientWidth` to detect overflow. Active tab indicator uses `box-shadow: inset 0 -2px 0` (not `border-bottom`) to avoid layout shift. Tab bar height fixed at `2.5rem`. Budget and Staff tabs are hidden when `element.category === 'official'`.

### Pie charts (BudgetTab.tsx, StaffTab.tsx)

Both use Recharts `<Pie data={activePieData} ... />` with swapped `data` props (not remount) for CSS transition animations. Click navigation: `onClick={(data: any) => data?.elementId && onSelectElement?.(data.elementId)}`. Use `(data: any)` — Recharts' `PieSectorDataItem` type is incompatible with the actual click payload.

Staff pie: entries below 2% threshold are collapsed into a grey "Other" slice in the pie, but all entries remain visible in the legend (grey dot for collapsed items).

---

## Common Tasks

### Adding a new government element

1. Add an entry to `src/data/elements.ts`:
   ```typescript
   'my-element': {
     id: 'my-element',
     name: 'Full Official Name',
     category: 'body',
     subtype: 'executive-ndpb',
     description: 'One-sentence overview.',
     infoUrl: 'https://www.gov.uk/government/organisations/...',
     parentIds: ['sponsoring-dept'],
     tags: ['regulator'],
   },
   ```
2. **Do not add `childIds`** — child lookup is computed automatically from `parentIds`.
3. If it appears as a body line in OSCAR data, add it to `BODY_LABEL_TO_ELEMENT` in `scripts/extract-oscar.mjs` and re-run the script.
4. If it has Civil Service Statistics data, add it to `staffing.ts` or as an entry in the relevant parent's `orgs[]`.

### Adding powers data

Add an entry to `src/data/powers.ts` keyed by element ID. Use `legislationUrl` pointing to legislation.gov.uk where possible.

### Refreshing budget data

```bash
# 1. Place new BUD_xx-xx.xlsx in project root
# 2. Update filename in scripts/extract-oscar.mjs
# 3. Run:
node scripts/extract-oscar.mjs
```

---

## Style Conventions

- Component CSS is co-located with the component
- Dark mode overrides go in `App.css` under `.app-dark .classname` — not in component CSS files
- Responsive breakpoints are in `App.css`: panel width 350px → 420px at 1600px → 480px at 1920px
- Colour palette: UK Gov blue `#003366` / `#004d99` header; element colours from `utils/colors.ts`
- Use existing CSS class naming patterns: `.budget-section-label`, `.tab-button`, `.breakdown-btn`, `.bbt-*`, `.sot-*`

---

## Data Integrity Rules

- **IDs must be unique** across `elements.ts`. Use kebab-case.
- **No `childIds`** — this field has been removed from the `GovElement` interface. Child lookup is computed from `parentIds`.
- **`secondaryParentIds`** is used only for junior ministers leading departments. The secondary relationship renders differently in both views (dashed edges, different label).
- **`orgId` in `staffing.ts`** must match an element ID in `elements.ts`, or be left empty (`''`).
- **`elementId` in `BODY_LABEL_TO_ELEMENT`** must match an element ID in `elements.ts`.
- **Budget figures** are in £ thousands (matching OSCAR source). Do not convert units.
- **Staff figures** are headcount rounded to nearest 5. Cells with <5 staff are suppressed (shown as 0).
- **Power profile keys** must match the element ID exactly (e.g. `'pm'` not `'prime-minister'`, `'treasury'` not `'hm-treasury'`).

---

## Troubleshooting

**Full view hover highlight not working after search:**
Check `searchActiveRef.current`. It should be `false` when `highlightIds` is `null`. It is set inside the `useEffect` that watches `highlightIds`.

**Power card not appearing:**
Verify the key in `powerProfiles` exactly matches the element ID in `elements.ts` (e.g. `'pm'`, `'treasury'`, `'attorney-gen'`).

**Pie chart not rendering for a sub-org:**
Check whether `effectiveView` in `StaffTab.tsx` falls back to `'grade'` when `orgs.length === 0`.

**Staff table row not clickable:**
Ensure `orgId` in `staffing.ts` matches an element ID in `elements.ts`.

**Budget body pie slice not navigating:**
Ensure the OSCAR body label matches a key in `BODY_LABEL_TO_ELEMENT`. Re-run `extract-oscar.mjs` after adding the mapping.

**Tab bar shows scroll indicator when it shouldn't:**
`ResizeObserver` calls `checkTabs()` on resize. Ensure `checkTabs` is also called in the `useEffect` that depends on `elementId` changes.

**TypeScript error on Recharts Pie onClick:**
Use `(data: any)` — do not try to type as `PieSectorDataItem`.
