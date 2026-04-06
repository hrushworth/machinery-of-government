// ── Powers, Duties & Responsibilities ────────────────────────────────────────
// Keyed by element ID from elements.ts.

export type PowerType = 'power' | 'duty' | 'function' | 'responsibility'
export type SourceType = 'act' | 'statutory-instrument' | 'prerogative' | 'case-law' | 'convention'

export interface LegislativeSource {
  type: SourceType
  title: string
  section?: string
  year?: number
  legislationUrl?: string
  caseRef?: string
}

export interface Power {
  id: string
  title: string
  description: string
  powerType: PowerType
  inForceFrom?: string
  amendedDate?: string
  sources: LegislativeSource[]
  notes?: string
}

export interface PowerProfile {
  elementId: string
  powers: Power[]
  lastReviewed?: string
}

export const powerProfiles: Record<string, PowerProfile> = {

  'pm': {
    elementId: 'pm',
    lastReviewed: '2025-03-25',
    powers: [
      {
        id: 'pm-appoint-ministers',
        title: 'Formation of Government',
        description: 'Nominated by the President, confirmed by Riigikogu. Appoints and dismisses ministers.',
        powerType: 'power',
        inForceFrom: '1992',
        sources: [{ type: 'act', title: 'Constitution of the Republic of Estonia', section: '§§ 86-90', year: 1992, legislationUrl: 'https://www.riigiteataja.ee/en/eli/530122020003/consolide' }],
      },
      {
        id: 'pm-direct-policy',
        title: 'Direction of Government Policy',
        description: 'Leads and coordinates government policy. Chairs cabinet sessions.',
        powerType: 'power',
        sources: [{ type: 'act', title: 'Government of the Republic Act', section: '§ 3', year: 1995, legislationUrl: 'https://www.riigiteataja.ee/en/eli/528122020004/consolide' }],
      },
      {
        id: 'pm-represent',
        title: 'Representation of Government',
        description: 'Represents the Government of the Republic domestically and internationally.',
        powerType: 'function',
        sources: [{ type: 'act', title: 'Government of the Republic Act', section: '§ 3', year: 1995 }],
      },
    ],
  },

  'president': {
    elementId: 'president',
    lastReviewed: '2025-03-25',
    powers: [
      {
        id: 'president-represent',
        title: 'Representation in International Relations',
        description: 'Represents the Republic of Estonia in international relations.',
        powerType: 'power',
        sources: [{ type: 'act', title: 'Constitution of the Republic of Estonia', section: '§ 78', year: 1992, legislationUrl: 'https://www.riigiteataja.ee/en/eli/530122020003/consolide' }],
      },
      {
        id: 'president-nominate-pm',
        title: 'Nomination of Prime Minister Candidate',
        description: 'Designates the candidate for Prime Minister who is charged with forming the Government.',
        powerType: 'power',
        sources: [{ type: 'act', title: 'Constitution of the Republic of Estonia', section: '§ 89', year: 1992 }],
      },
      {
        id: 'president-promulgate',
        title: 'Promulgation of Laws',
        description: 'Promulgates laws passed by the Riigikogu. May refuse to promulgate and return for reconsideration.',
        powerType: 'power',
        sources: [{ type: 'act', title: 'Constitution of the Republic of Estonia', section: '§§ 107-108', year: 1992 }],
      },
      {
        id: 'president-supreme-commander',
        title: 'Supreme Commander of National Defence',
        description: 'Supreme commander of the national defence of Estonia.',
        powerType: 'power',
        sources: [{ type: 'act', title: 'Constitution of the Republic of Estonia', section: '§ 78(16)', year: 1992 }],
      },
      {
        id: 'president-appoint-judges',
        title: 'Appointment of Judges',
        description: 'Appoints judges on proposal of the Chief Justice of the Supreme Court.',
        powerType: 'power',
        sources: [{ type: 'act', title: 'Constitution of the Republic of Estonia', section: '§ 150', year: 1992 }],
      },
    ],
  },

  'riigikogu_speaker': {
    elementId: 'riigikogu_speaker',
    lastReviewed: '2025-03-25',
    powers: [
      {
        id: 'riigikogu-legislate',
        title: 'Legislative Power',
        description: 'The Riigikogu passes laws, resolutions, and declarations. Approves the state budget.',
        powerType: 'power',
        sources: [{ type: 'act', title: 'Constitution of the Republic of Estonia', section: '§ 65', year: 1992 }],
      },
      {
        id: 'riigikogu-elect-president',
        title: 'Election of the President',
        description: 'Elects the President of the Republic.',
        powerType: 'power',
        sources: [{ type: 'act', title: 'Constitution of the Republic of Estonia', section: '§ 79', year: 1992 }],
      },
      {
        id: 'riigikogu-oversight',
        title: 'Parliamentary Oversight',
        description: 'Exercises parliamentary supervision over the executive. Appoints Chancellor of Justice, Auditor General, and Chief Justice on proposal of the President.',
        powerType: 'function',
        sources: [{ type: 'act', title: 'Constitution of the Republic of Estonia', section: '§ 65', year: 1992 }],
      },
    ],
  },

  'oiguskantsler': {
    elementId: 'oiguskantsler',
    lastReviewed: '2025-03-25',
    powers: [
      {
        id: 'ok-constitutional-review',
        title: 'Constitutional Review',
        description: 'Reviews the conformity of legislation of the legislative and executive powers and of local governments with the Constitution and the laws.',
        powerType: 'duty',
        sources: [{ type: 'act', title: 'Constitution of the Republic of Estonia', section: '§ 139', year: 1992 }, { type: 'act', title: 'Chancellor of Justice Act', year: 1999, legislationUrl: 'https://www.riigiteataja.ee/en/eli/517012019007/consolide' }],
      },
      {
        id: 'ok-ombudsman',
        title: 'Ombudsman Functions',
        description: 'Reviews compliance of state agencies with fundamental rights and freedoms. Accepts complaints from individuals.',
        powerType: 'function',
        sources: [{ type: 'act', title: 'Chancellor of Justice Act', year: 1999 }],
      },
    ],
  },

  'chief_justice': {
    elementId: 'chief_justice',
    lastReviewed: '2025-03-25',
    powers: [
      {
        id: 'cj-constitutional-review',
        title: 'Constitutional Review Court',
        description: 'The Supreme Court also functions as the constitutional review court.',
        powerType: 'function',
        sources: [{ type: 'act', title: 'Constitution of the Republic of Estonia', section: '§ 149', year: 1992 }, { type: 'act', title: 'Constitutional Review Court Procedure Act', year: 2002 }],
      },
      {
        id: 'cj-cassation',
        title: 'Court of Cassation',
        description: 'Highest court of appeal. Reviews judgments of lower courts through cassation proceedings.',
        powerType: 'function',
        sources: [{ type: 'act', title: 'Courts Act', year: 2002, legislationUrl: 'https://www.riigiteataja.ee/en/eli/514012019008/consolide' }],
      },
    ],
  },

  'auditor_general': {
    elementId: 'auditor_general',
    lastReviewed: '2025-03-25',
    powers: [
      {
        id: 'ag-audit',
        title: 'State Budget Audit',
        description: 'Audits the economic activities of state agencies, state enterprises, and other organisations using state assets.',
        powerType: 'duty',
        sources: [{ type: 'act', title: 'Constitution of the Republic of Estonia', section: '§ 132', year: 1992 }, { type: 'act', title: 'National Audit Office Act', year: 2002 }],
      },
    ],
  },

  'cabinet': {
    elementId: 'cabinet',
    lastReviewed: '2025-03-25',
    powers: [
      {
        id: 'cabinet-executive',
        title: 'Executive Power',
        description: 'The Government of the Republic exercises executive power. Implements domestic and foreign policy. Directs and coordinates activities of government agencies.',
        powerType: 'power',
        sources: [{ type: 'act', title: 'Constitution of the Republic of Estonia', section: '§§ 86-87', year: 1992 }, { type: 'act', title: 'Government of the Republic Act', year: 1995 }],
      },
      {
        id: 'cabinet-regulations',
        title: 'Issuing Regulations and Orders',
        description: 'Issues regulations and orders on the basis of and for the implementation of law.',
        powerType: 'power',
        sources: [{ type: 'act', title: 'Constitution of the Republic of Estonia', section: '§ 87', year: 1992 }],
      },
    ],
  },

}
