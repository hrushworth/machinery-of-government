// ── Professional Regulation Data ────────────────────────────────────────────
// Not applicable for the Estonian dataset.

export interface RegulatedProfession {
  name: string
  jurisdictionNote?: string
}

export interface ProfessionProfile {
  elementId: string
  professions: RegulatedProfession[]
  onBehalfOf?: string
}

export const professionProfiles: Record<string, ProfessionProfile> = {}
