export type Jurisdiction =
  | 'uk'
  | 'gb'
  | 'england-wales'
  | 'england'
  | 'scotland'
  | 'wales'
  | 'northern-ireland'
  | 'crown-dependencies'
  | 'overseas-territories'

export interface JurisdictionInfo {
  label: string
  filterLabel?: string  // override label used in the jurisdiction filter panel
  shortLabel: string
  description: string
  flag?: string
}

export const jurisdictionInfo: Record<Jurisdiction, JurisdictionInfo> = {
  'uk':                   { label: 'United Kingdom', filterLabel: 'Whole of UK', shortLabel: 'Whole of UK', description: 'Bodies whose remit covers all four nations' },
  'gb':                   { label: 'Great Britain',         shortLabel: 'GB',          description: 'England, Scotland and Wales (not NI)' },
  'england-wales':        { label: 'England & Wales',       shortLabel: 'Eng & Wales', description: 'England and Wales only' },
  'england':              { label: 'England',               shortLabel: 'England',     description: 'England only' },
  'scotland':             { label: 'Scotland',              shortLabel: 'Scotland',    description: 'Scotland only' },
  'wales':                { label: 'Wales',                 shortLabel: 'Wales',       description: 'Wales only' },
  'northern-ireland':     { label: 'Northern Ireland',      shortLabel: 'N. Ireland',  description: 'Northern Ireland only' },
  'crown-dependencies':   { label: 'Crown Dependencies',    shortLabel: 'Crown Deps',  description: 'Jersey, Guernsey and Isle of Man' },
  'overseas-territories': { label: 'Overseas Territories',  shortLabel: 'Overseas',    description: 'British Overseas Territories' },
}

// When filtering for a given jurisdiction, elements with any of these annotations match.
// Hierarchy: broader jurisdictions (uk, gb) cover narrower ones (england, wales etc.)
// Crown dependencies and overseas territories are NOT implied by uk — must be explicit.
export const JURISDICTION_COVERS: Record<Jurisdiction, Jurisdiction[]> = {
  'uk':                   ['uk'],
  'gb':                   ['uk', 'gb'],
  'england-wales':        ['uk', 'gb', 'england-wales'],
  'england':              ['uk', 'gb', 'england-wales', 'england'],
  'scotland':             ['uk', 'gb', 'scotland'],
  'wales':                ['uk', 'gb', 'england-wales', 'wales'],
  'northern-ireland':     ['uk', 'northern-ireland'],
  'crown-dependencies':   ['crown-dependencies'],
  'overseas-territories': ['overseas-territories'],
}

// Elements with no jurisdiction annotation are treated as UK-wide
export const DEFAULT_JURISDICTIONS: Jurisdiction[] = ['uk']

export function elementMatchesJurisdiction(
  elementJurisdictions: Jurisdiction[] | undefined,
  filter: Jurisdiction
): boolean {
  const jurs = elementJurisdictions ?? DEFAULT_JURISDICTIONS
  const covers = JURISDICTION_COVERS[filter]
  return jurs.some(j => covers.includes(j))
}
