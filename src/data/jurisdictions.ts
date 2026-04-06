export type Jurisdiction = 'estonia'

export interface JurisdictionInfo {
  label: string
  shortLabel: string
  description: string
  flag?: string
}

export const jurisdictionInfo: Record<Jurisdiction, JurisdictionInfo> = {
  'estonia': { label: 'Estonia', shortLabel: 'Estonia', description: 'Republic of Estonia — unitary state' },
}

export const JURISDICTION_COVERS: Record<Jurisdiction, Jurisdiction[]> = {
  'estonia': ['estonia'],
}

export const DEFAULT_JURISDICTIONS: Jurisdiction[] = ['estonia']

export function elementMatchesJurisdiction(
  elementJurisdictions: Jurisdiction[] | undefined,
  filter: Jurisdiction
): boolean {
  const jurs = elementJurisdictions ?? DEFAULT_JURISDICTIONS
  const covers = JURISDICTION_COVERS[filter]
  return jurs.some(j => covers.includes(j))
}
