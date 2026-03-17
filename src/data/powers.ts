// ── Powers, Duties & Responsibilities ────────────────────────────────────────
// Keyed by element ID from elements.ts.
// Not every element needs an entry — absence simply means no data yet.

export type PowerType = 'power' | 'duty' | 'function' | 'responsibility'
export type SourceType = 'act' | 'statutory-instrument' | 'prerogative' | 'case-law' | 'convention'

export interface LegislativeSource {
  type: SourceType
  title: string          // e.g. "Constitutional Reform and Governance Act 2010"
  section?: string       // e.g. "s.3(1)"
  year?: number
  legislationUrl?: string // deep-link to legislation.gov.uk
  caseRef?: string        // for case-law: full neutral citation
}

export interface Power {
  id: string
  title: string
  description: string
  powerType: PowerType
  inForceFrom?: string         // ISO date or year string, e.g. "2010" or "1997-05-02"
  amendedDate?: string
  sources: LegislativeSource[]
  notes?: string
}

export interface PowerProfile {
  elementId: string
  powers: Power[]
  lastReviewed?: string        // ISO date — flag for data freshness
}

// ── Data ──────────────────────────────────────────────────────────────────────
export const powerProfiles: Record<string, PowerProfile> = {

  'prime-minister': {
    elementId: 'prime-minister',
    lastReviewed: '2025-01-01',
    powers: [
      {
        id: 'pm-appoint-ministers',
        title: 'Appointment of Ministers',
        description: 'The Prime Minister advises the Sovereign on the appointment and dismissal of all Ministers of the Crown, including Cabinet ministers, Ministers of State, and Parliamentary Under-Secretaries of State.',
        powerType: 'power',
        inForceFrom: '1900',
        sources: [
          {
            type: 'convention',
            title: 'Constitutional convention',
            section: undefined,
            notes: 'Formally a prerogative of the Crown exercised on the advice of the Prime Minister.'
          } as LegislativeSource & { notes?: string },
          {
            type: 'act',
            title: 'Ministers of the Crown Act 1975',
            year: 1975,
            legislationUrl: 'https://www.legislation.gov.uk/ukpga/1975/26',
          },
        ],
        notes: 'In practice this extends to all senior public appointments where the PM has an advisory or direct role.',
      },
      {
        id: 'pm-request-dissolution',
        title: 'Requesting Dissolution of Parliament',
        description: 'The Prime Minister may request that the Sovereign dissolve Parliament, triggering a general election. Since the Dissolution and Calling of Parliament Act 2022, this restored the prerogative power following the fixed-term Parliament regime.',
        powerType: 'power',
        inForceFrom: '2022',
        sources: [
          {
            type: 'act',
            title: 'Dissolution and Calling of Parliament Act 2022',
            year: 2022,
            legislationUrl: 'https://www.legislation.gov.uk/ukpga/2022/11',
          },
          {
            type: 'prerogative',
            title: 'Royal Prerogative — dissolution of Parliament',
          },
        ],
      },
      {
        id: 'pm-civil-service-management',
        title: 'Management of the Civil Service',
        description: 'The Prime Minister is Minister for the Civil Service and holds overall responsibility for the organisation, management, and terms and conditions of the Civil Service.',
        powerType: 'responsibility',
        inForceFrom: '1968',
        sources: [
          {
            type: 'act',
            title: 'Constitutional Reform and Governance Act 2010',
            year: 2010,
            section: 'Part 1',
            legislationUrl: 'https://www.legislation.gov.uk/ukpga/2010/25/part/1',
          },
        ],
        notes: 'Day-to-day management of the Civil Service is delegated to the Cabinet Secretary and Permanent Secretaries.',
      },
      {
        id: 'pm-national-security',
        title: 'Chair of the National Security Council',
        description: 'The Prime Minister chairs the National Security Council (NSC), which coordinates across government on national security, intelligence, defence, and foreign policy.',
        powerType: 'function',
        inForceFrom: '2010',
        sources: [
          {
            type: 'convention',
            title: 'Cabinet committee structure — NSC Terms of Reference',
          },
        ],
      },
    ],
  },

  'hm-treasury': {
    elementId: 'hm-treasury',
    lastReviewed: '2025-01-01',
    powers: [
      {
        id: 'hmt-financial-management',
        title: 'Control of Public Expenditure',
        description: 'HM Treasury is responsible for managing public spending, setting departmental expenditure limits, and authorising Supply from the Consolidated Fund.',
        powerType: 'function',
        inForceFrom: '1866',
        sources: [
          {
            type: 'act',
            title: 'Exchequer and Audit Departments Act 1866',
            year: 1866,
            legislationUrl: 'https://www.legislation.gov.uk/ukpga/Vict/29-30/39',
          },
          {
            type: 'act',
            title: 'Government Resources and Accounts Act 2000',
            year: 2000,
            legislationUrl: 'https://www.legislation.gov.uk/ukpga/2000/20',
          },
        ],
      },
      {
        id: 'hmt-taxation',
        title: 'Taxation Policy',
        description: 'HM Treasury is responsible for taxation policy and strategy, working with HMRC on the administration and collection of taxes.',
        powerType: 'responsibility',
        inForceFrom: '1849',
        sources: [
          {
            type: 'prerogative',
            title: 'Treasury prerogative — consolidated fund',
          },
          {
            type: 'act',
            title: 'Finance Acts (annual)',
            notes: 'Each year\'s Finance Act implements budget tax changes.',
          } as LegislativeSource & { notes?: string },
        ],
      },
      {
        id: 'hmt-fiscal-framework',
        title: 'Setting the Fiscal Framework',
        description: 'The Chancellor, through HM Treasury, sets the UK\'s fiscal rules, including debt and deficit targets, and presents the annual Budget and Spending Reviews to Parliament.',
        powerType: 'duty',
        inForceFrom: '1998',
        sources: [
          {
            type: 'act',
            title: 'Budget Responsibility and National Audit Act 2011',
            year: 2011,
            legislationUrl: 'https://www.legislation.gov.uk/ukpga/2011/4',
          },
        ],
      },
    ],
  },

}
