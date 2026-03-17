// Civil Service headcount by grade, as at 31 March 2025
// Source: Civil Service Statistics 2025, Table 20
// https://www.gov.uk/government/statistics/civil-service-statistics-2025
//
// Grades:
//   scs   = Senior Civil Service
//   g67   = Grade 6 or Grade 7
//   sheo  = Senior or Higher Executive Officer
//   eo    = Executive Officer
//   aaao  = Administrative Assistant or Administrative Officer
//   other = Unreported / unclassified grade
//
// [c] cells (suppressed, 1–4 staff) are recorded as 0.
// Parent department entries use the "Overall" totals from Table 20.
// Sub-org entries use their individual row totals.
// Keys must match element IDs in elements.ts.

export interface GradeBreakdown {
  scs: number
  g67: number
  sheo: number
  eo: number
  aaao: number
  other: number
  total: number
}

export interface OrgStaff {
  /** Element ID of the sub-organisation (if it exists in elements.ts) */
  orgId: string
  /** Display label matching the Table 20 organisation name */
  label: string
  grades: GradeBreakdown
}

export interface StaffProfile {
  /** Element ID from elements.ts */
  elementId: string
  /** Reference year */
  year: string
  /** Department-level totals (the "Overall" row from Table 20) */
  grades: GradeBreakdown
  /** Individual sub-organisations listed under this department in Table 20 */
  orgs: OrgStaff[]
}

export const staffProfiles: Record<string, StaffProfile> = {

  // ── Ministerial Departments ───────────────────────────────────────────────

  'co': {
    elementId: 'co',
    year: '2024-25',
    grades: { scs: 770, g67: 4460, sheo: 5060, eo: 855, aaao: 370, other: 0, total: 11510 },
    orgs: [
      { orgId: 'co',    label: 'Cabinet Office (excl. agencies)', grades: { scs: 530, g67: 2745, sheo: 2510, eo: 755, aaao: 355, other: 0, total: 6890 } },
      { orgId: '',      label: 'Fast Stream',                     grades: { scs: 0,   g67: 0,    sheo: 1975, eo: 0,   aaao: 0,   other: 0, total: 1980 } },
      { orgId: '',      label: 'Crown Commercial Service',        grades: { scs: 25,  g67: 185,  sheo: 405,  eo: 85,  aaao: 10,  other: 0, total: 715  } },
      { orgId: '',      label: 'Government Commercial Organisation', grades: { scs: 185, g67: 1305, sheo: 45, eo: 0,  aaao: 0,   other: 0, total: 1535 } },
      { orgId: '',      label: 'Government Property Agency',      grades: { scs: 30,  g67: 220,  sheo: 125,  eo: 10,  aaao: 0,   other: 0, total: 390  } },
    ],
  },

  'dbt': {
    elementId: 'dbt',
    year: '2024-25',
    grades: { scs: 345, g67: 2875, sheo: 4905, eo: 1400, aaao: 1195, other: 0, total: 10720 },
    orgs: [
      { orgId: 'dbt',              label: 'DBT (excl. agencies)',      grades: { scs: 320, g67: 2480, sheo: 2685, eo: 400,  aaao: 50,  other: 0, total: 5935 } },
      { orgId: 'acas',             label: 'ACAS',                      grades: { scs: 5,   g67: 60,   sheo: 650,  eo: 305,  aaao: 40,  other: 0, total: 1060 } },
      { orgId: 'companies-house',  label: 'Companies House',           grades: { scs: 10,  g67: 160,  sheo: 595,  eo: 500,  aaao: 600, other: 0, total: 1865 } },
      { orgId: 'insolvency-service', label: 'The Insolvency Service',    grades: { scs: 10,  g67: 175,  sheo: 975,  eo: 195,  aaao: 500, other: 0, total: 1855 } },
    ],
  },

  'dcms': {
    elementId: 'dcms',
    year: '2024-25',
    grades: { scs: 70, g67: 485, sheo: 405, eo: 95, aaao: 0, other: 0, total: 1060 },
    orgs: [],
  },

  'defra': {
    elementId: 'defra',
    year: '2024-25',
    grades: { scs: 240, g67: 3445, sheo: 5675, eo: 2190, aaao: 2390, other: 10, total: 13950 },
    orgs: [
      { orgId: 'defra', label: 'Defra (excl. agencies)',            grades: { scs: 215, g67: 2710, sheo: 3390, eo: 430,  aaao: 85,  other: 10, total: 6840 } },
      { orgId: 'apha',  label: 'Animal and Plant Health Agency',    grades: { scs: 5,   g67: 320,  sheo: 1215, eo: 905,  aaao: 925, other: 0,  total: 3370 } },
      { orgId: 'cefas', label: 'Centre for Environment, Fisheries and Aquaculture Science', grades: { scs: 5, g67: 155, sheo: 360, eo: 120, aaao: 15, other: 0, total: 655 } },
      { orgId: 'rpa',   label: 'Rural Payments Agency',             grades: { scs: 10,  g67: 185,  sheo: 640,  eo: 715,  aaao: 1345,other: 0,  total: 2895 } },
      { orgId: 'vmd',   label: 'Veterinary Medicines Directorate',  grades: { scs: 0,   g67: 70,   sheo: 65,   eo: 25,   aaao: 25,  other: 0,  total: 190  } },
    ],
  },

  'desnz': {
    elementId: 'desnz',
    year: '2024-25',
    grades: { scs: 235, g67: 2275, sheo: 2030, eo: 205, aaao: 30, other: 0, total: 4780 },
    orgs: [],
  },

  'dfe': {
    elementId: 'dfe',
    year: '2024-25',
    grades: { scs: 275, g67: 3255, sheo: 3875, eo: 705, aaao: 80, other: 0, total: 8185 },
    orgs: [
      { orgId: 'dfe',   label: 'DfE (excl. agencies)',             grades: { scs: 245, g67: 2910, sheo: 3355, eo: 625, aaao: 70, other: 0, total: 7215 } },
      { orgId: 'esfa',  label: 'Education and Skills Funding Agency', grades: { scs: 10, g67: 135, sheo: 295, eo: 15, aaao: 0, other: 0, total: 460 } },
      { orgId: 'ifate', label: 'Institute for Apprenticeships and Technical Education', grades: { scs: 10, g67: 155, sheo: 95, eo: 10, aaao: 0, other: 0, total: 270 } },
      { orgId: '',      label: 'Standards and Testing Agency',     grades: { scs: 0,   g67: 40,   sheo: 80,   eo: 15,  aaao: 0,  other: 0, total: 140  } },
      { orgId: '',      label: 'Teaching Regulation Agency',       grades: { scs: 0,   g67: 10,   sheo: 45,   eo: 35,  aaao: 10, other: 0, total: 100  } },
    ],
  },

  'dft': {
    elementId: 'dft',
    year: '2024-25',
    grades: { scs: 295, g67: 2395, sheo: 4375, eo: 4050, aaao: 5415, other: 0, total: 16535 },
    orgs: [
      { orgId: 'dft',  label: 'DfT (excl. agencies)',              grades: { scs: 265, g67: 1670, sheo: 1510, eo: 275,  aaao: 140,  other: 0, total: 3855 } },
      { orgId: 'dvla', label: 'Driver and Vehicle Licensing Agency',grades: { scs: 10,  g67: 330,  sheo: 1070, eo: 885,  aaao: 3855, other: 0, total: 6150 } },
      { orgId: 'dvsa', label: 'Driver and Vehicle Standards Agency',grades: { scs: 10,  g67: 160,  sheo: 1085, eo: 2610, aaao: 1095, other: 0, total: 4955 } },
      { orgId: 'maritime-coastguard', label: 'Maritime and Coastguard Agency',    grades: { scs: 10,  g67: 180,  sheo: 575,  eo: 205,  aaao: 280,  other: 0, total: 1250 } },
      { orgId: '',     label: 'Vehicle Certification Agency',      grades: { scs: 0,   g67: 20,   sheo: 105,  eo: 75,   aaao: 40,   other: 0, total: 235  } },
      { orgId: '',     label: 'Active Travel England',             grades: { scs: 0,   g67: 45,   sheo: 35,   eo: 5,    aaao: 0,    other: 0, total: 85   } },
    ],
  },

  'dhsc': {
    elementId: 'dhsc',
    year: '2024-25',
    grades: { scs: 700, g67: 4105, sheo: 4480, eo: 1225, aaao: 600, other: 0, total: 11115 },
    orgs: [
      { orgId: 'dhsc',  label: 'DHSC (excl. agencies)',            grades: { scs: 235, g67: 1675, sheo: 1455, eo: 305, aaao: 30,  other: 0, total: 3695 } },
      { orgId: 'mhra',  label: 'Medicines and Healthcare Products Regulatory Agency', grades: { scs: 145, g67: 545, sheo: 560, eo: 210, aaao: 25, other: 0, total: 1480 } },
      { orgId: 'uk-health-security', label: 'UK Health Security Agency',        grades: { scs: 325, g67: 1885, sheo: 2465, eo: 715, aaao: 550, other: 0, total: 5935 } },
    ],
  },

  'dluhc': {
    elementId: 'dluhc',
    year: '2024-25',
    grades: { scs: 190, g67: 2375, sheo: 1790, eo: 380, aaao: 210, other: 0, total: 4945 },
    orgs: [
      { orgId: 'dluhc', label: 'MHCLG (excl. agencies)',           grades: { scs: 180, g67: 1850, sheo: 1560, eo: 260, aaao: 45,  other: 0, total: 3900 } },
      { orgId: 'planning-inspectorate', label: 'Planning Inspectorate',            grades: { scs: 5,   g67: 520,  sheo: 200,  eo: 105, aaao: 160, other: 0, total: 995  } },
      { orgId: '',      label: 'Queen Elizabeth II Centre',        grades: { scs: 0,   g67: 0,    sheo: 30,   eo: 15,  aaao: 0,   other: 0, total: 50   } },
    ],
  },

  'dsit': {
    elementId: 'dsit',
    year: '2024-25',
    grades: { scs: 185, g67: 2605, sheo: 3220, eo: 905, aaao: 220, other: 0, total: 7135 },
    orgs: [
      { orgId: 'dsit',       label: 'DSIT (excl. agencies)',       grades: { scs: 140, g67: 1135, sheo: 940,  eo: 95,  aaao: 10,  other: 0, total: 2320 } },
      { orgId: '',           label: 'Building Digital UK',         grades: { scs: 10,  g67: 125,  sheo: 110,  eo: 10,  aaao: 0,   other: 0, total: 260  } },
      { orgId: 'ipo',        label: 'Intellectual Property Office',grades: { scs: 20,  g67: 465,  sheo: 655,  eo: 485, aaao: 125, other: 0, total: 1755 } },
      { orgId: 'met-office', label: 'Met Office',                  grades: { scs: 10,  g67: 725,  sheo: 1360, eo: 305, aaao: 80,  other: 0, total: 2480 } },
      { orgId: 'uksa',       label: 'UK Space Agency',             grades: { scs: 10,  g67: 150,  sheo: 150,  eo: 10,  aaao: 0,   other: 0, total: 325  } },
    ],
  },

  'dwp': {
    elementId: 'dwp',
    year: '2024-25',
    grades: { scs: 360, g67: 5490, sheo: 16980, eo: 50100, aaao: 23960, other: 0, total: 96890 },
    orgs: [
      { orgId: 'dwp', label: 'DWP (excl. agencies)',               grades: { scs: 320, g67: 4850, sheo: 15375, eo: 49570, aaao: 23690, other: 0, total: 93805 } },
      { orgId: 'hse', label: 'Health and Safety Executive',        grades: { scs: 40,  g67: 640,  sheo: 1605,  eo: 530,   aaao: 270,   other: 0, total: 3085  } },
    ],
  },

  'fcdo': {
    elementId: 'fcdo',
    year: '2024-25',
    grades: { scs: 575, g67: 3620, sheo: 3710, eo: 1025, aaao: 505, other: 0, total: 9435 },
    orgs: [
      { orgId: 'fcdo',          label: 'FCDO (excl. agencies)',    grades: { scs: 565, g67: 3365, sheo: 3160, eo: 705, aaao: 360, other: 0, total: 8150 } },
      { orgId: '',              label: 'FCDO Services',            grades: { scs: 10,  g67: 240,  sheo: 520,  eo: 290, aaao: 135, other: 0, total: 1195 } },
      { orgId: '',              label: 'Wilton Park',              grades: { scs: 0,   g67: 15,   sheo: 30,   eo: 25,  aaao: 15,  other: 0, total: 90   } },
    ],
  },

  'home-office': {
    elementId: 'home-office',
    year: '2024-25',
    grades: { scs: 370, g67: 5095, sheo: 13940, eo: 21155, aaao: 9950, other: 140, total: 50655 },
    orgs: [],
  },

  'mod': {
    elementId: 'mod',
    year: '2024-25',
    grades: { scs: 560, g67: 9130, sheo: 23675, eo: 8255, aaao: 14455, other: 1425, total: 57500 },
    orgs: [
      { orgId: 'mod',  label: 'MoD (excl. agencies)',              grades: { scs: 405, g67: 3940, sheo: 12960, eo: 6475, aaao: 12570, other: 25,   total: 36375 } },
      { orgId: 'dstl', label: 'Defence Science and Technology Laboratory', grades: { scs: 5, g67: 2420, sheo: 2285, eo: 265, aaao: 60, other: 50, total: 5085 } },
      { orgId: 'des',  label: 'Defence Equipment and Support',     grades: { scs: 105, g67: 2010, sheo: 6390, eo: 925,  aaao: 1525, other: 0,    total: 10950 } },
      { orgId: '',     label: 'Royal Fleet Auxiliary',             grades: { scs: 0,   g67: 30,   sheo: 150,  eo: 160,  aaao: 155,  other: 1135, total: 1635  } },
      { orgId: 'sda',  label: 'Submarine Delivery Agency',         grades: { scs: 40,  g67: 605,  sheo: 1370, eo: 155,  aaao: 100,  other: 215,  total: 2480  } },
      { orgId: 'uk-hydrographic', label: 'UK Hydrographic Office',            grades: { scs: 5,   g67: 125,  sheo: 525,  eo: 275,  aaao: 45,   other: 0,    total: 975   } },
    ],
  },

  'moj': {
    elementId: 'moj',
    year: '2024-25',
    grades: { scs: 320, g67: 4565, sheo: 15680, eo: 12055, aaao: 40555, other: 23040, total: 96210 },
    orgs: [
      { orgId: 'moj',   label: 'MoJ (excl. agencies)',             grades: { scs: 180, g67: 2680, sheo: 4210, eo: 770,  aaao: 335,   other: 30,    total: 8210  } },
      { orgId: 'cica',  label: 'Criminal Injuries Compensation Authority', grades: { scs: 0, g67: 10, sheo: 85, eo: 90, aaao: 140, other: 0, total: 325 } },
      { orgId: 'hmcts', label: 'HM Courts and Tribunals Service',  grades: { scs: 70,  g67: 825,  sheo: 3080, eo: 2825, aaao: 9060,  other: 0,     total: 15860 } },
      { orgId: 'legal-aid', label: 'Legal Aid Agency',                 grades: { scs: 10,  g67: 95,   sheo: 355,  eo: 385,  aaao: 470,   other: 0,     total: 1315  } },
      { orgId: 'hmpps', label: 'HM Prison and Probation Service',  grades: { scs: 55,  g67: 900,  sheo: 7760, eo: 7505, aaao: 29465, other: 23005, total: 68690 } },
      { orgId: 'opg',   label: 'Office of the Public Guardian',    grades: { scs: 0,   g67: 55,   sheo: 190,  eo: 475,  aaao: 1085,  other: 0,     total: 1810  } },
    ],
  },

  'ni-office': {
    elementId: 'ni-office',
    year: '2024-25',
    grades: { scs: 15, g67: 55, sheo: 80, eo: 15, aaao: 5, other: 0, total: 175 },
    orgs: [],
  },

  'scotland-office': {
    elementId: 'scotland-office',
    year: '2024-25',
    grades: { scs: 15, g67: 55, sheo: 45, eo: 10, aaao: 5, other: 0, total: 135 },
    orgs: [],
  },

  'treasury': {
    elementId: 'treasury',
    year: '2024-25',
    grades: { scs: 180, g67: 1215, sheo: 1050, eo: 240, aaao: 35, other: 0, total: 2720 },
    orgs: [
      { orgId: 'treasury', label: 'HM Treasury (excl. agencies)', grades: { scs: 140, g67: 910, sheo: 725, eo: 205, aaao: 30, other: 0, total: 2015 } },
      { orgId: 'ukdmo',    label: 'UK Debt Management Office',     grades: { scs: 0,   g67: 45,  sheo: 60,  eo: 10,  aaao: 0,  other: 0, total: 120  } },
      { orgId: 'giaa',     label: 'Government Internal Audit Agency', grades: { scs: 25, g67: 205, sheo: 240, eo: 15, aaao: 0, other: 0, total: 485 } },
      { orgId: 'nista',    label: 'National Infrastructure and Service Transformation Authority', grades: { scs: 0, g67: 25, sheo: 15, eo: 5, aaao: 0, other: 0, total: 50 } },
      { orgId: 'obr',      label: 'Office for Budget Responsibility', grades: { scs: 0, g67: 30, sheo: 15, eo: 0, aaao: 0, other: 0, total: 50 } },
    ],
  },

  'ukef': {
    elementId: 'ukef',
    year: '2024-25',
    grades: { scs: 50, g67: 265, sheo: 210, eo: 55, aaao: 0, other: 0, total: 585 },
    orgs: [],
  },

  'wales-office': {
    elementId: 'wales-office',
    year: '2024-25',
    grades: { scs: 5, g67: 15, sheo: 15, eo: 10, aaao: 0, other: 0, total: 45 },
    orgs: [],
  },

  // ── Non-Ministerial Departments ───────────────────────────────────────────

  'charity-comm': {
    elementId: 'charity-comm',
    year: '2024-25',
    grades: { scs: 5, g67: 80, sheo: 250, eo: 110, aaao: 10, other: 0, total: 455 },
    orgs: [],
  },

  'cma': {
    elementId: 'cma',
    year: '2024-25',
    grades: { scs: 140, g67: 570, sheo: 320, eo: 80, aaao: 30, other: 0, total: 1140 },
    orgs: [],
  },

  'fsa': {
    elementId: 'fsa',
    year: '2024-25',
    grades: { scs: 30, g67: 310, sheo: 855, eo: 380, aaao: 5, other: 0, total: 1580 },
    orgs: [],
  },

  'hmland': {
    elementId: 'hmland',
    year: '2024-25',
    grades: { scs: 30, g67: 335, sheo: 2550, eo: 2555, aaao: 1390, other: 0, total: 6865 },
    orgs: [],
  },

  'hmrc': {
    elementId: 'hmrc',
    year: '2024-25',
    grades: { scs: 540, g67: 9800, sheo: 26070, eo: 16000, aaao: 18515, other: 0, total: 70925 },
    orgs: [
      { orgId: 'hmrc', label: 'HMRC (excl. agencies)',             grades: { scs: 520, g67: 9270, sheo: 24330, eo: 15125, aaao: 17700, other: 0, total: 66945 } },
      { orgId: 'voa',  label: 'Valuation Office Agency',           grades: { scs: 20,  g67: 530,  sheo: 1740,  eo: 875,   aaao: 815,   other: 0, total: 3980  } },
    ],
  },

  'nats': {
    elementId: 'nats',
    year: '2024-25',
    grades: { scs: 10, g67: 110, sheo: 320, eo: 100, aaao: 105, other: 0, total: 645 },
    orgs: [],
  },

  'nca-non-min': {
    elementId: 'nca-non-min',
    year: '2024-25',
    grades: { scs: 50, g67: 575, sheo: 2795, eo: 2320, aaao: 200, other: 0, total: 5945 },
    orgs: [],
  },

  'ofgem': {
    elementId: 'ofgem',
    year: '2024-25',
    grades: { scs: 95, g67: 1010, sheo: 650, eo: 455, aaao: 10, other: 0, total: 2225 },
    orgs: [],
  },

  'ofqual': {
    elementId: 'ofqual',
    year: '2024-25',
    grades: { scs: 20, g67: 135, sheo: 170, eo: 20, aaao: 5, other: 0, total: 360 },
    orgs: [],
  },

  'ofsted': {
    elementId: 'ofsted',
    year: '2024-25',
    grades: { scs: 35, g67: 740, sheo: 860, eo: 195, aaao: 195, other: 0, total: 2020 },
    orgs: [],
  },

  'ofwat': {
    elementId: 'ofwat',
    year: '2024-25',
    grades: { scs: 10, g67: 100, sheo: 240, eo: 50, aaao: 10, other: 0, total: 410 },
    orgs: [],
  },

  'ons': {
    elementId: 'ons',
    year: '2024-25',
    grades: { scs: 90, g67: 1180, sheo: 2390, eo: 730, aaao: 1245, other: 0, total: 5630 },
    orgs: [],
  },

  'orr': {
    elementId: 'orr',
    year: '2024-25',
    grades: { scs: 20, g67: 200, sheo: 95, eo: 35, aaao: 15, other: 0, total: 365 },
    orgs: [],
  },

}

// Derived lookup: for each sub-org with a non-empty orgId, synthesise a
// StaffProfile so that ElementDetails can display staffing data when the
// user opens that sub-org's element pane.
//
// The profile contains the sub-org's own grades as the top-level totals,
// no nested orgs, and inherits the parent's year.
export function getStaffProfile(elementId: string): StaffProfile | undefined {
  // Direct match first
  if (staffProfiles[elementId]) return staffProfiles[elementId]

  // Search parent orgs arrays (skip self-referencing rows)
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
