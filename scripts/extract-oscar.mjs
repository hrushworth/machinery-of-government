/**
 * extract-oscar.mjs
 *
 * Reads BUD_24-25.xlsx (OSCAR data from HM Treasury) and produces
 * src/data/budgets-oscar.json, imported by budgets.ts.
 *
 * Usage:
 *   node scripts/extract-oscar.mjs
 *
 * Input:  BUD_24-25.xlsx  (in project root)
 * Output: src/data/budgets-oscar.json
 *
 * Filter logic:
 *   Both FINAL OUTTURN and IN-YEAR RETURN rows must be summed.
 *   FINAL OUTTURN rows are year-end adjustments; IN-YEAR RETURN rows carry the
 *   main cumulative spend. NON-BUDGET rows are excluded throughout.
 */

import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { createRequire } from 'module'

const XLSX = createRequire(import.meta.url)('xlsx')

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// ── Mapping: OSCAR DEPARTMENT_GROUP_CODE → element ID ────────────────────────
const DEPT_GROUP_TO_ELEMENT = {
  'CAB010.GROUP': 'co',
  'UKT013.GROUP': 'dbt',
  'DCM048.GROUP': 'dcms',
  'DFE022.GROUP': 'dfe',
  'DEC066.GROUP': 'desnz',
  'EFR003.GROUP': 'defra',
  'BIS084.GROUP': 'dsit',
  'DFT004.GROUP': 'dft',
  'DWP032.GROUP': 'dwp',
  'DOH033.GROUP': 'dhsc',
  'ECG025.GROUP': 'ukef',
  'FSA026.GROUP': 'fsa',
  'DID030.GROUP': 'fcdo',
  'GAD031.GROUP': 'gad',
  'HML078.GROUP': 'hmland',
  'HMR041.GROUP': 'hmrc',
  'HMT087.GROUP': 'treasury',
  'HOF034.GROUP': 'home-office',
  'MOD017.GROUP': 'mod',
  'CLG085.GROUP': 'dluhc',
  'MOJ047.GROUP': 'moj',
  'NCA073.GROUP': 'nca-non-min',
  'DNS049.GROUP': 'nsi',
  'NIO097.GROUP': 'ni-office',
  'OSE072.GROUP': 'ofsted',
  'OGE020.GROUP': 'ofgem',
  'OFQ070.GROUP': 'ofqual',
  'ORR088.GROUP': 'orr',
  'SCO042.GROUP': 'scotland-office',
  'SFO019.GROUP': 'sfo',
  'ONS005.GROUP': 'uksa',
  'TSC068.GROUP': 'supreme-court',
  'WOF091.GROUP': 'wales-office',
  'WSR057.GROUP': 'ofwat',
  'CHC009.GROUP': 'charity-comm',
  'CMA076.GROUP': 'cma',
  'CPS016.GROUP': 'cps',
}

// ── Verified annual report collection URLs (gov.uk/government/collections) ────
// Only include URLs that are confirmed to resolve to a collections page.
const ANNUAL_REPORT_URLS = {
  'co':          'https://www.gov.uk/government/collections/cabinet-office-annual-report-and-accounts',
  'dbt':         'https://www.gov.uk/government/collections/department-for-business-and-trade-annual-report-and-accounts',
  'dcms':        'https://www.gov.uk/government/collections/dcms-annual-report-and-accounts',
  'dfe':         'https://www.gov.uk/government/collections/dfe-annual-reports',
  'desnz':       'https://www.gov.uk/government/collections/department-for-energy-security-and-net-zero-annual-report-and-accounts',
  'defra':       'https://www.gov.uk/government/collections/defra-annual-report-and-accounts',
  'dsit':        'https://www.gov.uk/government/collections/department-for-science-innovation-and-technology-annual-report-and-accounts',
  'dft':         'https://www.gov.uk/government/collections/department-for-transport-annual-report-and-accounts',
  'dwp':         'https://www.gov.uk/government/collections/dwp-annual-report-and-accounts',
  'dhsc':        'https://www.gov.uk/government/collections/department-of-health-annual-report-and-accounts',
  'fcdo':        'https://www.gov.uk/government/collections/foreign-commonwealth-development-office-annual-report-and-accounts',
  'hmrc':        'https://www.gov.uk/government/collections/hm-revenue-and-customs-annual-report-and-accounts',
  'treasury':    'https://www.gov.uk/government/collections/hm-treasury-annual-report-and-accounts',
  'home-office': 'https://www.gov.uk/government/collections/home-office-annual-report-and-accounts',
  'mod':         'https://www.gov.uk/government/collections/mod-annual-reports-and-accounts',
  'dluhc':       'https://www.gov.uk/government/collections/mhclg-annual-report-and-accounts',
  'moj':         'https://www.gov.uk/government/collections/moj-annual-report-and-accounts',
  'hmland':      'https://www.gov.uk/government/collections/hm-land-registry-annual-report-and-accounts',
  'nca-non-min': 'https://www.gov.uk/government/collections/national-crime-agency-annual-report-and-accounts',
  'cps':         'https://www.gov.uk/government/collections/cps-annual-report',
  'sfo':         'https://www.gov.uk/government/collections/serious-fraud-office-annual-reports-and-accounts',
  'uksa':        'https://www.gov.uk/government/collections/office-for-statistics-regulation-annual-report',
}

// ── Mapping: OSCAR body/ALB label → element ID ───────────────────────────────
// Used to add elementId to bodyLines so pie slices can navigate to that element.
const BODY_LABEL_TO_ELEMENT = {
  'Advanced Research and Invention Agency':                  'aria',
  'Advisory, Conciliation and Arbitration Service':          'acas',
  'Agriculture & Horticulture Development Board':            'ahdb',
  'British Film Institute':                                  'bfi',
  'British Library':                                         'british-library',
  'British Museum':                                          'british-museum',
  'British Transport Police Authority':                      'btpa',
  'Care Quality Commission':                                 'cqc',
  'Children and Family Court Advisory and Support Service':  'cafcass',
  'College of Policing':                                     'college-of-policing',
  'Committee on Climate Change':                             'ccc',
  'Commonwealth Scholarship Commission':                     'csc-uk',
  'Commonwealth War Graves Commission':                      'cwgc',
  'Competition Service':                                     'competition-service',
  'Construction Industry Training Board':                    'citb',
  'Consumer Council for Water':                              'consumer-council-water',
  'Criminal Cases Review Commission':                        'ccrc',
  'Disclosure and Barring Service (DBS)':                    'dbs',
  'Civil Nuclear Police Authority and Constabulary':         'civil-nuclear-police',
  'Coal Authority':                                          'mining-rem-auth',
  'East West Rail':                                          'east-west-railway',
  'Engineering Construction Industry Training Board':        'ecitb',
  'Environment Agency':                                      'environment-agency',
  'Great British Nuclear Limited':                           'gbe-nuclear',
  'Health Research Authority':                               'hra',
  'High Speed 2':                                            'hs2',
  'Horniman Museum':                                         'horniman-museum',
  'Health Services Safety Investigations Body':              'hssib',
  'Health and Safety Executive':                             'hse',
  'Homes England':                                           'homes-england',
  'Human Fertilisation and Embryology Authority':            'hfea',
  'Human Tissue Authority':                                  'hta',
  'Imperial War Museum':                                     'iwm',
  'Independent Commission for Aid Impact':                   'icai',
  'Independent Commission for Reconciliation and Information Recovery': 'icrir',
  'Infected Blood Compensation Authority':                   'ibca',
  'Institute for Apprenticeship':                            'ifate',
  'Joint Nature Conservation Committee':                     'jncc',
  'Judicial Appointments Commission':                        'jac',
  'Leasehold Advisory Service':                              'lease',
  'Low Carbon Contracts Company':                            'low-carbon-contracts',
  'Marine Management Organisation':                          'mmo',
  'Marshall Aid Commemoration Commission':                   'macc',
  'NHS Property Services':                                   'nhs-property-services',
  'National Army Museum':                                    'national-army-museum',
  'National Gallery':                                        'national-gallery',
  'National Heritage Memorial Fund':                         'nhmf',
  'National Highways':                                       'national-highways',
  'National Institute for Health and Care Excellence':       'nice',
  'National Maritime Museum':                                'rmg',
  'National Museum of Science and Industry':                 'science-museum-group',
  'National Museum of the Royal Navy':                       'nmrn',
  'National Museums Liverpool':                              'national-museums-liverpool',
  'National Portrait Gallery':                               'npg',
  'Natural England':                                         'natural-england',
  'Natural History Museum':                                  'nhm',
  'Network Rail':                                            'network-rail',
  'Northern Lighthouse Board':                               'nlb',
  'Nuclear Decommissioning Authority':                       'nda',
  'Nursing and Midwifery Council':                           'nmc',
  'Ofcom':                                                   'ofcom',
  'Office for Budget Responsibility':                        'obr',
  'Office for Environmental Protection':                     'oep',
  'Office for Students':                                     'ofstu',
  'NI Human Rights Commission':                              'nihrc',
  'NI Parades Commission':                                   'ni-parades-commission',
  'Oil & Gas Authority':                                     'nsta',
  'Parole Board for England and Wales':                      'parole-board',
  'Reclaim Fund Ltd':                                        'reclaim-fund',
  'Regulator of Social Housing':                             'rsh',
  'Royal Air Force Museum':                                  'raf-museum',
  'Royal Armouries':                                         'royal-armouries',
  'Royal Botanic Gardens, Kew':                              'kew-gardens',
  'S4C':                                                     's4c',
  'Security Industry Authority':                             'sia',
  'Salix':                                                   'salix',
  'Single Financial Guidance Body':                          'maps',
  'Single Source Regulations Office':                        'ssro',
  'Social Work England':                                     'social-work-england',
  'Sport England':                                           'sport-england',
  'Student Loans Company':                                   'slc',
  'Tate Gallery':                                            'tate',
  'The Gambling Commission':                                  'gambling-commission',
  'The Pensions Ombudsman':                                  'pensions-ombudsman',
  'The Housing Ombudsman':                                   'housing-ombudsman',
  'The Pensions Regulator':                                  'pensions-regulator',
  'Trade Remedies Authority (TRA)':                          'tra-body',
  'Transport Focus':                                         'transport-focus',
  'UK Research and Innovation':                              'ukri',
  'United Kingdom Anti Doping':                              'ukad',
  'United Kingdom Atomic Energy Authority':                  'ukaea',
  'United Kingdom Sports Council':                           'uk-sport',
  'Visit Britain':                                           'visitbritain',
  'Victoria and Albert Museum':                              'vam',
  'Wallace Collection':                                      'wallace-collection',
  'Westminster Foundation for Democracy':                    'wfd',
  'Youth Justice Board for England and Wales':               'yjb',
}

// ── Economic group → collapsed display category ───────────────────────────────
function displayCategory(economicGroupCode) {
  const code = economicGroupCode || 'n/a'
  if (['A1','A2'].includes(code)) return 'Pay'
  if (['B1','B2'].includes(code)) return 'Goods & Services'
  if (code.startsWith('C')) return 'Subsidies'
  if (['D1','D2','D7','D8'].includes(code)) return 'Current Grants'
  if (code === 'D4') return 'Public Service Pensions'
  if (['D5','D6'].includes(code)) return 'Grants to Govt'
  if (['E1','E2','F1','F2','G1','G2','G3','G5','G6'].includes(code)) return 'Capital Investment'
  if (['H1','H2','H3','H5','H6'].includes(code)) return 'Loans'
  if (['K1','K3'].includes(code)) return 'Equity Investment'
  if (['J1','J3','T1','T2','T3','T4'].includes(code)) return 'Income & Receipts'
  if (['P1','P2','P3','P4'].includes(code)) return 'Depreciation'
  if (['S1','S2','S3','S5','S6'].includes(code)) return 'Interest'
  if (['L1','L2','L4','L5','E3','E5'].includes(code)) return 'Provisions'
  return 'Other'
}

// ── Load and parse ────────────────────────────────────────────────────────────
console.log('Reading BUD_24-25.xlsx …')
const wb = XLSX.readFile(join(ROOT, 'BUD_24-25.xlsx'))
const ws = wb.Sheets[wb.SheetNames[0]]
const rows = XLSX.utils.sheet_to_json(ws)
console.log(`  ${rows.length} rows loaded`)

const budgetRows = rows.filter(r => r.TYPE_LONG_NAME !== 'NON-BUDGET')
console.log(`  ${budgetRows.length} budget rows (excl. NON-BUDGET)`)

// ── Aggregation maps ──────────────────────────────────────────────────────────
// byEconomicCat:  elementId → Map<displayCategory, number>
// byProgramme:    elementId → Map<estimatesRowLabel, number>
// byBody:         elementId → Map<organisationName, number>
// byControl:      elementId → { delAdmin, delProg, deptAme, nonDeptAme }

const byEconomicCat = new Map()
const byProgramme   = new Map()
const byBody        = new Map()
const byControl     = new Map()

for (const row of budgetRows) {
  const groupCode = row.DEPARTMENT_GROUP_CODE
  const elementId = DEPT_GROUP_TO_ELEMENT[groupCode]
  if (!elementId) continue

  const amount = Number(row.AMOUNT) || 0

  // ── Economic category ──
  if (!byEconomicCat.has(elementId)) byEconomicCat.set(elementId, new Map())
  const cat = displayCategory(row.ECONOMIC_GROUP_CODE)
  byEconomicCat.get(elementId).set(cat, (byEconomicCat.get(elementId).get(cat) || 0) + amount)

  // ── Programme (ESTIMATES_ROW_LONG_NAME) ──
  // Skip rows where it's blank/n/a — those are usually internal accounting entries
  const prog = (row.ESTIMATES_ROW_LONG_NAME || '').trim()
  if (prog && prog !== 'n/a') {
    if (!byProgramme.has(elementId)) byProgramme.set(elementId, new Map())
    byProgramme.get(elementId).set(prog, (byProgramme.get(elementId).get(prog) || 0) + amount)
  }

  // ── Body (ORGANISATION_LONG_NAME, excluding the core department itself) ──
  const org = (row.ORGANISATION_LONG_NAME || '').trim()
  // Only include ALBs/agencies (org type ALB, ALBD, PC) — not the core dept row
  const orgType = row.ORGANISATION_TYPE_L1_CODE || ''
  if (org && ['ALB','ALBD','PC'].includes(orgType)) {
    if (!byBody.has(elementId)) byBody.set(elementId, new Map())
    byBody.get(elementId).set(org, (byBody.get(elementId).get(org) || 0) + amount)
  }

  // ── DEL / AME split ──
  if (!byControl.has(elementId)) byControl.set(elementId, { delAdmin: 0, delProg: 0, deptAme: 0, nonDeptAme: 0 })
  const ctrl = byControl.get(elementId)
  const cb = row.CONTROL_BUDGET_L0_LONG_NAME || ''
  if (cb === 'DEL ADMIN') ctrl.delAdmin += amount
  else if (cb === 'DEL PROG') ctrl.delProg += amount
  else if (cb === 'DEPT AME') ctrl.deptAme += amount
  else if (cb === 'NON-DEPT AME') ctrl.nonDeptAme += amount
}

// ── Helper: map → sorted BudgetLine array ─────────────────────────────────────
const MIN_AMOUNT = 1000   // ignore sub-£1m entries (amounts in £ thousands)

function toLines(map, minAbs = MIN_AMOUNT, includeElementIds = false) {
  if (!map) return { expenditureLines: [], incomeLines: [] }
  const expenditureLines = []
  const incomeLines = []
  for (const [label, amount] of [...map.entries()].sort((a,b) => Math.abs(b[1]) - Math.abs(a[1]))) {
    if (Math.abs(amount) < minAbs) continue
    const line = { label, amount: Math.round(amount) }
    if (includeElementIds) {
      const elementId = BODY_LABEL_TO_ELEMENT[label]
      if (elementId) line.elementId = elementId
    }
    if (amount >= 0) expenditureLines.push(line)
    else incomeLines.push(line)
  }
  return { expenditureLines, incomeLines }
}

// ── Build output ──────────────────────────────────────────────────────────────
const FINANCIAL_YEAR = '2024-25'
const SOURCE_LABEL = 'HM Treasury OSCAR Final Outturn 2024-25'

const output = {}

for (const elementId of new Set([
  ...byEconomicCat.keys(),
  ...byProgramme.keys(),
  ...byBody.keys(),
])) {
  const { expenditureLines: ecExp, incomeLines: ecInc } = toLines(byEconomicCat.get(elementId))
  const { expenditureLines: progExp, incomeLines: progInc } = toLines(byProgramme.get(elementId))
  const { expenditureLines: bodyExp, incomeLines: bodyInc } = toLines(byBody.get(elementId), MIN_AMOUNT, true)

  // Use economic-category totals for the headline figures
  const totalGrossExpenditure = ecExp.reduce((s, l) => s + l.amount, 0)
  const totalIncome = ecInc.reduce((s, l) => s + l.amount, 0)
  const totalNetExpenditure = totalGrossExpenditure + totalIncome

  const ctrl = byControl.get(elementId) || { delAdmin: 0, delProg: 0, deptAme: 0, nonDeptAme: 0 }

  const oscarCode = Object.entries(DEPT_GROUP_TO_ELEMENT).find(([, v]) => v === elementId)?.[0] ?? null

  output[elementId] = {
    elementId,
    oscarDeptGroupCode: oscarCode,
    budgets: [
      {
        financialYear: FINANCIAL_YEAR,
        totalNetExpenditure: Math.round(totalNetExpenditure),
        totalGrossExpenditure: Math.round(totalGrossExpenditure),
        totalIncome: Math.round(totalIncome),
        unit: 'thousands',
        delAdmin: Math.round(ctrl.delAdmin),
        delProg: Math.round(ctrl.delProg),
        deptAme: Math.round(ctrl.deptAme),
        nonDeptAme: Math.round(ctrl.nonDeptAme),
        // By economic type (Pay, Goods & Services, Capital, etc.)
        expenditureLines: ecExp,
        incomeLines: ecInc,
        // By named programme / Estimates row
        programmeLines: progExp,
        programmeIncomeLines: progInc,
        // By arm's length body / agency
        bodyLines: bodyExp,
        bodyIncomeLines: bodyInc,
        annualReportUrl: ANNUAL_REPORT_URLS[elementId] ?? null,
        sourceLabel: SOURCE_LABEL,
      }
    ]
  }
}

// ── Write ─────────────────────────────────────────────────────────────────────
const outPath = join(ROOT, 'src', 'data', 'budgets-oscar.json')
writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8')

const count = Object.keys(output).length
console.log(`\nWrote ${count} department budgets to src/data/budgets-oscar.json`)
console.log('\nElements included:')
for (const [elementId, rec] of Object.entries(output)) {
  const b = rec.budgets[0]
  const net = (b.totalNetExpenditure / 1_000_000).toFixed(1)
  const progs = b.programmeLines.length
  const bodies = b.bodyLines.length
  console.log(`  ${elementId.padEnd(20)} net £${net}bn  programmes:${progs}  bodies:${bodies}`)
}
