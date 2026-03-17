import { readFileSync, writeFileSync } from 'fs'

const filePath = 'C:/Users/harry/OneDrive/Desktop/UK_Gov_Org_Chart/src/data/elements.ts'
let src = readFileSync(filePath, 'utf8')

const crlf = src.includes('\r\n')
const EOL = crlf ? '\r\n' : '\n'

// ── 1. Update existing gld-head entry ────────────────────────────────────────
// Fix name and description for Susanna McGibbon
src = src.replace(
  /('gld-head': \{[\s\S]*?name: ')[^']*(')/,
  `$1HM Procurator General and Treasury Solicitor$2`
)
src = src.replace(
  /('gld-head': \{[\s\S]*?currentHolder: ')[^']*(')/,
  `$1Susanna McGibbon KC$2`
)
src = src.replace(
  /('gld-head': \{[\s\S]*?description: ')[^']*(')/,
  `$1HM Procurator General, Treasury Solicitor and Head of the Government Legal Profession and Crown's Nominee.$2`
)

// ── 2. Update civil-service element to link to Dame Antonia's entry ──────────
// Will be done via parentIds after adding the entry

// ── 3. New perm sec entries ───────────────────────────────────────────────────
// Format: id, name (role title), holder, deptId, extraChildIds, extraDescription
const permSecs = [
  {
    id: 'co-perm-sec',
    name: 'Cabinet Secretary and Head of the Civil Service',
    holder: 'Dame Antonia Romeo DCB',
    dept: 'co',
    extraChildIds: ['civil-service'],
    description: 'Cabinet Secretary, Head of the Civil Service and Permanent Secretary of the Cabinet Office.',
    url: 'https://www.gov.uk/government/organisations/cabinet-office/about/our-governance',
  },
  {
    id: 'dbt-perm-sec',
    name: 'Permanent Secretary, DBT',
    holder: 'Gareth Davies CB',
    dept: 'dbt',
    extraChildIds: [],
    description: 'Permanent Secretary of the Department for Business and Trade.',
    url: 'https://www.gov.uk/government/organisations/department-for-business-and-trade/about/our-governance',
  },
  {
    id: 'defra-perm-sec',
    name: 'Permanent Secretary, Defra',
    holder: 'Paul Kissack',
    dept: 'defra',
    extraChildIds: [],
    description: 'Permanent Secretary of the Department for Environment, Food and Rural Affairs.',
    url: 'https://www.gov.uk/government/organisations/department-for-environment-food-rural-affairs/about/our-governance',
  },
  {
    id: 'dcms-perm-sec',
    name: 'Permanent Secretary, DCMS',
    holder: 'Susannah Storey',
    dept: 'dcms',
    extraChildIds: [],
    description: 'Permanent Secretary of the Department for Culture, Media and Sport.',
    url: 'https://www.gov.uk/government/organisations/department-for-culture-media-sport/about/our-governance',
  },
  {
    id: 'desnz-perm-sec',
    name: 'Permanent Secretary, DESNZ',
    holder: 'Jeremy Pocklington CB',
    dept: 'desnz',
    extraChildIds: [],
    description: 'Permanent Secretary of the Department for Energy Security and Net Zero.',
    url: 'https://www.gov.uk/government/organisations/department-for-energy-security-and-net-zero/about/our-governance',
  },
  {
    id: 'dfe-perm-sec',
    name: 'Permanent Secretary, DfE',
    holder: 'Susan Acland-Hood',
    dept: 'dfe',
    extraChildIds: [],
    description: 'Permanent Secretary of the Department for Education.',
    url: 'https://www.gov.uk/government/organisations/department-for-education/about/our-governance',
  },
  {
    id: 'dft-perm-sec',
    name: 'Permanent Secretary, DfT',
    holder: 'Jo Shanmugalingam',
    dept: 'dft',
    extraChildIds: [],
    description: 'Permanent Secretary of the Department for Transport.',
    url: 'https://www.gov.uk/government/organisations/department-for-transport/about/our-governance',
  },
  {
    id: 'dhsc-perm-sec',
    name: 'Permanent Secretary, DHSC',
    holder: 'Samantha Jones',
    dept: 'dhsc',
    extraChildIds: [],
    description: 'Permanent Secretary of the Department of Health and Social Care.',
    url: 'https://www.gov.uk/government/organisations/department-of-health-and-social-care/about/our-governance',
  },
  {
    id: 'dsit-perm-sec',
    name: 'Permanent Secretary, DSIT',
    holder: 'Emran Mian',
    dept: 'dsit',
    extraChildIds: [],
    description: 'Permanent Secretary of the Department for Science, Innovation and Technology.',
    url: 'https://www.gov.uk/government/organisations/department-for-science-innovation-and-technology/about/our-governance',
  },
  {
    id: 'dwp-perm-sec',
    name: 'Permanent Secretary, DWP',
    holder: 'Sir Peter Schofield KCB',
    dept: 'dwp',
    extraChildIds: [],
    description: 'Permanent Secretary of the Department for Work and Pensions.',
    url: 'https://www.gov.uk/government/organisations/department-for-work-pensions/about/our-governance',
  },
  {
    id: 'fcdo-perm-sec',
    name: 'Permanent Secretary, FCDO',
    holder: 'Sir Oliver Robbins KCMG CB',
    dept: 'fcdo',
    extraChildIds: [],
    description: 'Permanent Secretary of the Foreign, Commonwealth and Development Office.',
    url: 'https://www.gov.uk/government/organisations/foreign-commonwealth-development-office/about/our-governance',
  },
  {
    id: 'home-perm-sec',
    name: 'Permanent Secretary, Home Office',
    holder: 'Sir Matthew Rycroft KCMG CBE',
    dept: 'home-office',
    extraChildIds: [],
    description: 'Permanent Secretary of the Home Office.',
    url: 'https://www.gov.uk/government/organisations/home-office/about/our-governance',
  },
  {
    id: 'dluhc-perm-sec',
    name: 'Permanent Secretary, MHCLG',
    holder: 'Dame Sarah Healey DCB CVO',
    dept: 'dluhc',
    extraChildIds: [],
    description: 'Permanent Secretary of the Ministry of Housing, Communities and Local Government.',
    url: 'https://www.gov.uk/government/organisations/ministry-of-housing-communities-and-local-government/about/our-governance',
  },
  {
    id: 'mod-perm-sec',
    name: 'Permanent Secretary, MoD',
    holder: 'David Williams',
    dept: 'mod',
    extraChildIds: [],
    description: 'Permanent Secretary of the Ministry of Defence.',
    url: 'https://www.gov.uk/government/organisations/ministry-of-defence/about/our-governance',
  },
  {
    id: 'moj-perm-sec',
    name: 'Permanent Secretary, MoJ',
    holder: 'Dr Jo Farrar CB OBE',
    dept: 'moj',
    extraChildIds: [],
    description: 'Permanent Secretary of the Ministry of Justice.',
    url: 'https://www.gov.uk/government/organisations/ministry-of-justice/about/our-governance',
  },
  {
    id: 'ni-perm-sec',
    name: 'Permanent Secretary, NIO',
    holder: 'Julie Harrison',
    dept: 'ni-office',
    extraChildIds: [],
    description: 'Permanent Secretary of the Northern Ireland Office.',
    url: 'https://www.gov.uk/government/organisations/northern-ireland-office/about/our-governance',
  },
  {
    id: 'treasury-perm-sec',
    name: 'Permanent Secretary, HM Treasury',
    holder: 'James Bowler CB',
    dept: 'treasury',
    extraChildIds: [],
    description: 'Permanent Secretary of HM Treasury.',
    url: 'https://www.gov.uk/government/organisations/hm-treasury/about/our-governance',
  },
]

// Note: home-perm-sec — Dame Antonia Romeo is at Home Office per the list.
// Wait — the list says Dame Antonia Romeo is at Home Office, but the user says she also
// has the Cabinet Secretary role. Let me re-check:
// The fetched list shows: Dame Antonia Romeo DCB -> Home Office (HO)
// BUT there's also Catherine Little CB -> Cabinet Office
// The user says Dame Antonia Romeo has an "additional role in the cabinet office: Cabinet Secretary"
// So Romeo = Home Office perm sec + Cabinet Secretary (CO)
// Catherine Little = CO perm sec (separate role?)
// Actually reading again: the user said "Dame Antonia Romeo has an additional role in the cabinet office"
// So she leads both home-office AND co (as Cabinet Secretary) AND civil-service

// Fix: Romeo leads home-office (primary) + co + civil-service
// Update co-perm-sec to be Catherine Little (straight CO perm sec)
// Add a separate romeo entry that covers home-office + cabinet secretary

// Actually re-reading user instructions: "Dame Antonia Romeo... Cabinet Secretary and Head of the Civil Service;
// she should also be shown as leading the UK Civil Service element"
// This implies she's the perm sec for home office, AND has additional Cabinet Secretary role
// Let's make one entry for Romeo covering home-office as primary dept

// Fix romeo entry:
const romeoIdx = permSecs.findIndex(p => p.id === 'home-perm-sec')
permSecs[romeoIdx] = {
  id: 'home-perm-sec',
  name: 'Cabinet Secretary and Head of the Civil Service',
  holder: 'Dame Antonia Romeo DCB',
  dept: 'home-office',
  extraChildIds: ['civil-service', 'co'],
  description: 'Cabinet Secretary, Head of the Civil Service and Permanent Secretary of the Home Office.',
  url: 'https://www.gov.uk/government/organisations/home-office/about/our-governance',
}

// Update co-perm-sec to Catherine Little (CO perm sec, not Cabinet Secretary)
const coIdx = permSecs.findIndex(p => p.id === 'co-perm-sec')
permSecs[coIdx] = {
  id: 'co-perm-sec',
  name: 'Permanent Secretary, Cabinet Office',
  holder: 'Catherine Little CB',
  dept: 'co',
  extraChildIds: [],
  description: 'Permanent Secretary of the Cabinet Office.',
  url: 'https://www.gov.uk/government/organisations/cabinet-office/about/our-governance',
}

function entry(p) {
  const allChildIds = [p.dept, ...p.extraChildIds].map(id => `'${id}'`).join(', ')
  return [
    `  '${p.id}': {`,
    `    id: '${p.id}',`,
    `    name: '${p.name}',`,
    `    category: 'official',`,
    `    subtype: 'civil-servant',`,
    `    description: '${p.description}',`,
    `    currentHolder: '${p.holder}',`,
    `    infoUrl: '${p.url}',`,
    `    parentIds: [],`,
    `    childIds: [${allChildIds}],`,
    `  },`,
  ].join(EOL)
}

const sectionHeader = `${EOL}${EOL}  // ── OFFICIALS: Permanent Secretaries (Ministerial Departments) ─────────────`
const newBlock = sectionHeader + EOL + permSecs.map(entry).join(EOL) + EOL

// Insert before the Civil Servants section (non-ministerial dept heads)
const insertMarker = `  // ── OFFICIALS: Civil Servants`
if (!src.includes(insertMarker)) {
  console.error('ERROR: Civil Servants marker not found')
  process.exit(1)
}

src = src.replace(insertMarker, newBlock + insertMarker)

// ── 4. Update civil-service element to include home-perm-sec in parentIds ────
src = src.replace(
  /('civil-service': \{[\s\S]*?parentIds: )\[[^\]]*\]/,
  `$1['co', 'home-perm-sec']`
)

writeFileSync(filePath, src, 'utf8')
console.log(`Added ${permSecs.length} permanent secretary entries`)
