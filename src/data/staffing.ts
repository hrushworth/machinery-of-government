// Estonian central government staffing by governance area
// Source: Avaliku teenistuse aastaraamat 2023, salary survey 2024,
// and 2025 budget explanatory notes (labour cost percentages).
// https://www.fin.ee/riigihaldus-ja-avalik-teenistus-kinnisvara/riigihaldus/avaliku-sektori-statistika
//
// Estonia does not use the UK grade system. We use a simple breakdown:
//   total = approximate headcount for the governance area
//   orgs  = named sub-organisations where known
//
// All figures are approximate, rounded from various public sources.

export interface GradeBreakdown {
  scs: number    // senior officials (unused — set to 0)
  g67: number    // unused — set to 0
  sheo: number   // unused — set to 0
  eo: number     // unused — set to 0
  aaao: number   // unused — set to 0
  other: number  // unused — set to 0
  total: number  // total headcount
}

export interface OrgStaff {
  orgId: string
  label: string
  grades: GradeBreakdown
}

export interface StaffProfile {
  elementId: string
  year: string
  grades: GradeBreakdown
  coreGrades?: GradeBreakdown
  orgs: OrgStaff[]
  professions?: Record<string, number>
  coreProfessions?: Record<string, number>
}

function g(total: number): GradeBreakdown {
  return { scs: 0, g67: 0, sheo: 0, eo: 0, aaao: 0, other: 0, total }
}

export const staffProfiles: Record<string, StaffProfile> = {

  'ministry_interior': {
    elementId: 'ministry_interior',
    year: '2023-24',
    grades: g(8500),
    orgs: [
      { orgId: 'agency_ppa',          label: 'Police and Border Guard Board (PPA)', grades: g(5000) },
      { orgId: 'agency_paasteamet',   label: 'Rescue Board (Päästeamet)',           grades: g(2500) },
      { orgId: 'agency_kapo',         label: 'Internal Security Service (KAPO)',     grades: g(0) },  // classified
      { orgId: 'agency_smit',         label: 'IT and Development Centre (SMIT)',     grades: g(200) },
      { orgId: 'agency_ska_interior', label: 'Academy of Security Sciences (SKA)',   grades: g(300) },
    ],
  },

  'ministry_defence': {
    elementId: 'ministry_defence',
    year: '2023-24',
    grades: g(7000),
    orgs: [
      { orgId: 'agency_defence_forces',     label: 'Estonian Defence Forces (Kaitsevägi)',         grades: g(6000) },
      { orgId: 'agency_defence_resources',  label: 'Defence Resources Agency',                    grades: g(100) },
      { orgId: 'agency_defence_league',     label: 'Estonian Defence League (Kaitseliit)',         grades: g(500) },
      { orgId: 'agency_defence_investment', label: 'Centre for Defence Investment (RKIK)',         grades: g(200) },
    ],
  },

  'ministry_justice_digital': {
    elementId: 'ministry_justice_digital',
    year: '2023-24',
    grades: g(4000),
    orgs: [
      { orgId: 'agency_prokuratuur',  label: 'Prosecution Service (Prokuratuur)',                grades: g(500) },
      { orgId: 'agency_ria',          label: 'Information System Authority (RIA)',               grades: g(400) },
      { orgId: 'agency_aki',          label: 'Data Protection Inspectorate (AKI)',               grades: g(50) },
      { orgId: 'agency_patendiamet',  label: 'Patent Office (Patendiamet)',                      grades: g(60) },
      { orgId: 'agency_ekei',         label: 'Forensic Science Institute (EKEI)',                grades: g(200) },
    ],
  },

  'ministry_finance': {
    elementId: 'ministry_finance',
    year: '2023-24',
    grades: g(3500),
    orgs: [
      { orgId: 'agency_tax_customs',         label: 'Tax and Customs Board (MTA)',               grades: g(1800) },
      { orgId: 'agency_statistics',          label: 'Statistics Estonia (Statistikaamet)',        grades: g(600) },
      { orgId: 'agency_rtk',                label: 'State Shared Service Centre (RTK)',          grades: g(400) },
      { orgId: 'agency_finantsinspektsioon', label: 'Financial Supervision Authority',           grades: g(100) },
    ],
  },

  'ministry_social': {
    elementId: 'ministry_social',
    year: '2023-24',
    grades: g(3000),
    orgs: [
      { orgId: 'agency_sotsiaalkindlustusamet', label: 'Social Insurance Board (SKA)',           grades: g(800) },
      { orgId: 'agency_terviseamet',            label: 'Health Board (Terviseamet)',              grades: g(400) },
      { orgId: 'agency_ravimiamet',             label: 'State Agency of Medicines (Ravimiamet)', grades: g(100) },
      { orgId: 'agency_tai',                    label: 'National Institute for Health Dev (TAI)', grades: g(200) },
      { orgId: 'body_tervisekassa',             label: 'Health Insurance Fund (Tervisekassa)',    grades: g(500) },
      { orgId: 'body_tootukassa',               label: 'Unemployment Insurance Fund (Töötukassa)', grades: g(600) },
    ],
  },

  'ministry_education': {
    elementId: 'ministry_education',
    year: '2023-24',
    grades: g(2000),
    orgs: [
      { orgId: 'agency_harno',             label: 'Education and Youth Board (HARNO)',         grades: g(600) },
      { orgId: 'agency_etag',              label: 'Estonian Research Council (ETAg)',           grades: g(100) },
      { orgId: 'agency_rahvusarhiiv',      label: 'National Archives (Rahvusarhiiv)',          grades: g(200) },
      { orgId: 'agency_keeleinspektsioon', label: 'Language Inspectorate (Keeleinspektsioon)', grades: g(30) },
    ],
  },

  'ministry_economy': {
    elementId: 'ministry_economy',
    year: '2023-24',
    grades: g(1500),
    orgs: [
      { orgId: 'agency_ttja',             label: 'Consumer Protection and Tech Regulatory (TTJA)', grades: g(400) },
      { orgId: 'agency_tooinspektsioon',  label: 'Labour Inspectorate (Tööinspektsioon)',          grades: g(200) },
      { orgId: 'agency_veeteede_amet',    label: 'Maritime Administration (Veeteede Amet)',         grades: g(150) },
    ],
  },

  'ministry_climate': {
    elementId: 'ministry_climate',
    year: '2023-24',
    grades: g(1500),
    orgs: [
      { orgId: 'agency_keskkonnaamet',    label: 'Environmental Board (Keskkonnaamet)',         grades: g(500) },
      { orgId: 'agency_keskkonnaagentuur', label: 'Environment Agency (Keskkonnaagentuur)',     grades: g(300) },
      { orgId: 'agency_rmk',              label: 'State Forest Management (RMK)',               grades: g(400) },
    ],
  },

  'ministry_regional_agriculture': {
    elementId: 'ministry_regional_agriculture',
    year: '2023-24',
    grades: g(1200),
    orgs: [
      { orgId: 'agency_pta',  label: 'Agriculture and Food Board (PTA)', grades: g(600) },
      { orgId: 'agency_pria', label: 'Agricultural Registers (PRIA)',    grades: g(300) },
    ],
  },

  'ministry_foreign': {
    elementId: 'ministry_foreign',
    year: '2023-24',
    grades: g(800),
    orgs: [
      { orgId: 'agency_foreign_intel', label: 'Foreign Intelligence Service (Välisluureamet)', grades: g(0) },  // classified
    ],
  },

  'ministry_culture': {
    elementId: 'ministry_culture',
    year: '2023-24',
    grades: g(500),
    orgs: [
      { orgId: 'agency_muinsuskaitseamet', label: 'National Heritage Board (Muinsuskaitseamet)', grades: g(150) },
    ],
  },

  'riigikantselei': {
    elementId: 'riigikantselei',
    year: '2023-24',
    grades: g(200),
    orgs: [],
  },
}

export function getStaffProfile(elementId: string): StaffProfile | undefined {
  if (staffProfiles[elementId]) return staffProfiles[elementId]

  for (const parent of Object.values(staffProfiles)) {
    if (parent.elementId === elementId) continue
    for (const org of parent.orgs) {
      if (org.orgId === elementId) {
        return {
          elementId,
          year: parent.year,
          grades: org.grades,
          orgs: [],
        }
      }
    }
  }

  return undefined
}
