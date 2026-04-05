# CLAUDE.md — Developer Reference

This file is for Claude Code. It captures project conventions, architecture, and recurring patterns to avoid re-deriving them each session.

---

## Project overview

A React + TypeScript + Vite single-page app for exploring the structure of UK central government. Deployed via Cloudflare Pages. Data is static — no backend.

---

## Tech stack

- **React 18** with functional components and hooks only
- **TypeScript** (strict mode)
- **Vite** for build (`npm run build`, `npm run dev`)
- **Cytoscape.js** for graph visualisations (`src/components/FullView.tsx`, `src/components/GravityView.tsx`)
- **cytoscape-cola** for force-directed layout (GravityView) — types declared in `src/cytoscape-cola.d.ts`
- **Recharts** for budget/staffing charts

---

## Key data files (`src/data/`)

| File | Purpose |
|------|---------|
| `elements.ts` | All ~500+ gov elements (departments, bodies, officials). Central source of truth. |
| `jurisdictions.ts` | `Jurisdiction` type, `jurisdictionInfo`, `JURISDICTION_COVERS`, `elementMatchesJurisdiction()` |
| `professions.ts` | `professionProfiles` — regulated professions per element (for professional regulators) |
| `powers.ts` | Powers/functions per element |
| `budgets.ts` + `budgets-oscar.json` | Budget data |
| `staffing.ts` | Headcount data |

### `elements.ts` structure

Each element has:
```ts
{
  id: string
  name: string
  category: 'official' | 'department' | 'body' | 'group'
  subtype: string          // e.g. 'ministerial', 'executive-ndpb', 'cabinet-minister'
  parentIds: string[]
  secondaryParentIds?: string[]
  jurisdictions?: Jurisdiction[]   // defaults to ['uk'] if absent
  tags?: string[]          // e.g. 'professional-regulator', 'statutory-regulator'
  role?: string            // human-readable role title
  description?: string
}
```

Categories and their Cytoscape shapes:
- `official` → ellipse (pm=heptagon, cabinet-minister=octagon)
- `department` → rectangle (agency/division-directorate=roundrectangle)
- `body` → diamond
- `group` → not rendered in FullView/GravityView (skipped with `el.category === 'group'`)

---

## Views (`src/App.tsx` → `viewMode`)

Three views cycling via a single toggle button (shows **current** view name):

| viewMode | Component | Description |
|----------|-----------|-------------|
| `'radial'` | `FullView` | Concentric rings, preset layout, ring rotation on selection |
| `'gravity'` | `GravityView` | cytoscape-cola force layout, hierarchical flow (y-axis) |
| `'focus'` | `OrgChart` | Traditional org chart (hierarchical tree) |

Toggle cycles: focus → radial → gravity → focus.

---

## Jurisdiction system

- `jurisdictions?: Jurisdiction[]` on each element (default = `['uk']` if absent)
- Filter stored in `App.tsx` as `jurisdictionFilter: Jurisdiction | null`
- `jurisdictionHighlightIds` is a **memoised** array of matching element IDs (important — must stay stable reference)
- When filter is active in FullView/GravityView: non-matching nodes are **physically removed** from the Cytoscape graph (not just faded), layout is recomputed
- `JURISDICTION_COVERS` encodes hierarchy: filtering for `england` also shows `uk`, `gb`, `england-wales` elements
- Filter menu: "Any / All UK" = null (default); indented by `(JURISDICTION_COVERS[j].length - 1) * 12` px

---

## FullView architecture (`src/components/FullView.tsx`)

- Nodes placed on concentric rings; ring assignment via `computeTiers(includedIds?)` + `buildPositions(tiers)`
- Module-level `tierMap`, `nodePositions`, `baseNodeAngles`, `ringData` for the full (unfiltered) graph
- When jurisdiction filter active: recomputes filtered versions, stores in `currentTierMapRef` / `currentRingDataRef` / `currentNodeAnglesRef`
- Ring rotation on selection: `rotateToSelection` → `computeRotatedPositions` → `animateRingRotation` (requestAnimationFrame arc interpolation)
- Node animation: **single-object form** `n.animate({ position, duration, easing } as any)` — two-argument form doesn't work reliably
- After `cy.add()` (re-adding removed nodes), always use `setTimeout(fn, 0)` before animating — Cytoscape needs a tick to register re-added nodes
- Two separate jurisdiction effects: (1) deselect effect `[jurisdictionIds, selectedElementId, onDeselect]`, (2) graph-restructure effect `[jurisdictionIds]` only — keeping them separate prevents spurious re-runs overwriting `removedElementsRef`

## GravityView architecture (`src/components/GravityView.tsx`)

- Same props as FullView; same node/edge building (no `position` property — Cola assigns positions)
- Cola layout: `infinite: false` (runs to convergence then stops), `flow: { axis: 'y', minSeparation: 60 }`
- Edge lengths weighted by tier difference: `80 + |srcTier - tgtTier| * 20`
- No ring rotation; `layoutRef` holds current Cola layout instance
- Jurisdiction filter: stop layout → restore removed nodes → remove non-matching → re-run Cola
- CSS class prefixes: `gv-previewed`, `gv-selected` (vs `fv-` in FullView)

---

## Component conventions

- Every component has a matching `.css` file; CSS class names prefixed with component slug (e.g. `full-view-`, `gravity-view-`, `jurisdiction-`)
- `darkMode` prop propagates top-down from App; dark variant via CSS class on wrapper (e.g. `full-view-dark`)
- Mobile detection: `window.matchMedia('(max-width: 768px) and (pointer: coarse)')` — touch devices only, not narrow desktop
- Memoisation: functions passed as props to Cytoscape views should be `useCallback`; arrays that are dependency-compared should be `useMemo`
- `applyHighlightFilter` + `highlightNode` are `useCallback` in both graph views — stable refs needed for Cytoscape event handlers

---

## Adding new elements

1. Add entry to `src/data/elements.ts` (check for duplicates — `id` must be unique)
2. Set `jurisdictions` if not UK-wide
3. Add `tags` for categorisation (e.g. `professional-regulator`, `statutory-regulator`)
4. If a professional regulator, add entry to `src/data/professions.ts`

---

## Build & deploy

```bash
npm run dev       # local dev server
npm run build     # TypeScript check + Vite production build
```

Deployed to Cloudflare Pages. Build output: `dist/`.

The chunk size warning (`> 500 kB`) on build is expected and harmless — Cytoscape + Recharts are large.
