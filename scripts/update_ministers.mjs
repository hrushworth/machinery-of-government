import { readFileSync, writeFileSync } from 'fs'

const filePath = 'C:/Users/harry/OneDrive/Desktop/UK_Gov_Org_Chart/src/data/elements.ts'
let src = readFileSync(filePath, 'utf8')

// ── 1. Fix cabinet minister current holders ──────────────────────────────────

const cabinetFixes = [
  // [id, new name, new description, newDeptChildId if changed]
  // Peter Mandelson -> Darren Jones as CDL
  ['cabinet-office-sec', 'Chancellor of the Duchy of Lancaster', 'Minister for the Cabinet Office and Cabinet Secretary to the Prime Minister', 'Darren Jones'],
  // fcdo-sec: David Lammy was Foreign Sec but is now MoJ - Yvette Cooper is Home Sec
  // Actually per the data: fcdo-sec had David Lammy but Yvette Cooper is Foreign Sec
  ['fcdo-sec', 'Secretary of State for Foreign Affairs', 'Minister responsible for foreign policy and international relations', 'Yvette Cooper'],
  // moj-sec: was Shabana Mahmood but she is Home Sec; David Lammy is now Dep PM & Lord Chancellor
  ['moj-sec', 'Lord Chancellor and Secretary of State for Justice', 'Deputy Prime Minister and Minister responsible for the justice system', 'David Lammy'],
  // home-sec: was Yvette Cooper but she moved to FCDO; Shabana Mahmood is Home Sec
  ['home-sec', 'Secretary of State for Home Affairs', 'Minister responsible for policing, crime, migration, and borders', 'Shabana Mahmood'],
  // dluhc-sec: Angela Rayner -> Steve Reed
  ['dluhc-sec', 'Secretary of State for Housing and Communities', 'Minister responsible for housing, communities and local government', 'Steve Reed'],
  // defra-sec: Steve Reed -> Emma Reynolds
  ['defra-sec', 'Secretary of State for Environment', 'Minister responsible for environment and rural affairs', 'Emma Reynolds'],
  // wpc-sec: Liz Kendall -> Pat McFadden (DWP)
  ['wpc-sec', 'Secretary of State for Work and Pensions', 'Minister responsible for social security and employment', 'Pat McFadden'],
  // science-sec: Peter Kyle is still DSIT but Liz Kendall is now DSIT per data
  ['science-sec', 'Secretary of State for Science', 'Minister responsible for science, innovation and technology', 'Liz Kendall'],
  // dbt-sec: Jonathan Reynolds -> Peter Kyle
  ['dbt-sec', 'Secretary of State for Business and Trade', 'Minister responsible for business, trade and industry', 'Peter Kyle'],
  // wales-sec: Peter David -> Jo Stevens
  ['wales-sec', 'Secretary of State for Wales', 'Minister responsible for Wales Office', 'Jo Stevens'],
  // scotland-sec: Ian Murray -> Douglas Alexander
  ['scotland-sec', 'Secretary of State for Scotland', 'Minister responsible for Scotland Office', 'Douglas Alexander'],
  // ni-sec: Hilary Benn stays
  // chancellor: Rachel Reeves stays
  // defence-sec: John Healey stays
  // dfe-sec: Bridget Phillipson stays
  // dhsc-sec: Wes Streeting stays
  // desnz-sec: Ed Miliband stays
  // dcms-sec: Lisa Nandy stays
  // transport-sec: Heidi Alexander stays
  // attorney-gen: Richard Hermer stays (lord hermer)
]

for (const [id, name, desc, holder] of cabinetFixes) {
  // Replace currentHolder line for this minister
  const holderRe = new RegExp(
    `(  '${id}': \\{[^}]*?currentHolder: ')[^']*(')`,'s')
  src = src.replace(holderRe, `$1${holder}$2`)

  // Replace name line
  const nameRe = new RegExp(
    `(  '${id}': \\{[^}]*?name: ')[^']*(')`,'s')
  src = src.replace(nameRe, `$1${name}$2`)

  // Replace description line
  const descRe = new RegExp(
    `(  '${id}': \\{[^}]*?description: ')[^']*(')`,'s')
  src = src.replace(descRe, `$1${desc}$2`)
}

// ── 2. Build new junior minister entries ─────────────────────────────────────
// Format: id, name (role title), currentHolder, deptId (leads), cabinetSecId (overseen by), attendsCabinet, infoUrl

const juniorMinisters = [
  // HM Treasury
  { id: 'treasury-chief-sec', name: 'Chief Secretary to the Treasury', holder: 'James Murray', dept: 'treasury', boss: 'chancellor', cabinet: false, url: 'https://www.gov.uk/government/ministers/chief-secretary-to-the-treasury' },
  { id: 'treasury-fin-sec', name: 'Financial Secretary to the Treasury', holder: 'Lord Livermore', dept: 'treasury', boss: 'chancellor', cabinet: false, url: 'https://www.gov.uk/government/ministers/financial-secretary-to-the-treasury' },
  { id: 'treasury-exchequer-sec', name: 'Exchequer Secretary to the Treasury', holder: 'Daniel Tomlinson', dept: 'treasury', boss: 'chancellor', cabinet: false, url: 'https://www.gov.uk/government/ministers/exchequer-secretary-to-the-treasury' },
  { id: 'treasury-econ-sec', name: 'Economic Secretary to the Treasury', holder: 'Lucy Rigby', dept: 'treasury', boss: 'chancellor', cabinet: false, url: 'https://www.gov.uk/government/ministers/economic-secretary-to-the-treasury' },

  // FCDO
  { id: 'fcdo-intl-dev', name: 'Minister of State (International Development)', holder: 'Baroness Chapman of Darlington', dept: 'fcdo', boss: 'fcdo-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/minister-of-state-foreign-commonwealth-development-office' },
  { id: 'fcdo-europe', name: 'Minister of State (Europe and Americas)', holder: 'Stephen Doughty', dept: 'fcdo', boss: 'fcdo-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/minister-of-state-foreign-commonwealth-development-office--2' },
  { id: 'fcdo-middle-east', name: 'Parliamentary Under-Secretary (Middle East)', holder: 'Hamish Falconer', dept: 'fcdo', boss: 'fcdo-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/parliamentary-under-secretary-of-state--foreign-commonwealth-development-office' },
  { id: 'fcdo-indo-pacific', name: 'Parliamentary Under-Secretary (Indo-Pacific)', holder: 'Seema Malhotra', dept: 'fcdo', boss: 'fcdo-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/parliamentary-under-secretary-of-state--foreign-commonwealth-development-office--2' },
  { id: 'fcdo-multilateral', name: 'Parliamentary Under-Secretary (Multilateral)', holder: 'Chris Elmore', dept: 'fcdo', boss: 'fcdo-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/parliamentary-under-secretary-of-state--foreign-commonwealth-development-office--3' },

  // Home Office
  { id: 'home-security', name: 'Minister of State (Security)', holder: 'Dan Jarvis', dept: 'home-office', boss: 'home-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/minister-of-state--66' },
  { id: 'home-policing', name: 'Minister of State (Policing and Crime)', holder: 'Sarah Jones', dept: 'home-office', boss: 'home-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/minister-of-state--67' },
  { id: 'home-border', name: 'Minister of State (Border Security)', holder: 'Alex Norris', dept: 'home-office', boss: 'home-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/minister-of-state--68' },
  { id: 'home-safeguarding', name: 'Parliamentary Under-Secretary (Safeguarding)', holder: 'Jess Phillips', dept: 'home-office', boss: 'home-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/parliamentary-under-secretary-of-state--home-office' },
  { id: 'home-migration', name: 'Parliamentary Under-Secretary (Migration)', holder: 'Mike Tapp', dept: 'home-office', boss: 'home-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/parliamentary-under-secretary-of-state--home-office--2' },

  // MoD
  { id: 'mod-readiness', name: 'Minister of State (Defence Readiness)', holder: 'Luke Pollard', dept: 'mod', boss: 'defence-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/minister-of-state--ministry-of-defence' },
  { id: 'mod-armed-forces', name: 'Parliamentary Under-Secretary (Armed Forces)', holder: 'Alistair Carns', dept: 'mod', boss: 'defence-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/parliamentary-under-secretary-of-state--ministry-of-defence' },
  { id: 'mod-veterans', name: 'Parliamentary Under-Secretary (Veterans)', holder: 'Louise Sandher-Jones', dept: 'mod', boss: 'defence-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/parliamentary-under-secretary-of-state--ministry-of-defence--2' },

  // MoJ
  { id: 'moj-prisons', name: 'Minister of State (Prisons and Probation)', holder: 'Lord Timpson', dept: 'moj', boss: 'moj-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/minister-of-state--ministry-of-justice' },
  { id: 'moj-courts', name: 'Minister of State (Courts and Legal Services)', holder: 'Sarah Sackman', dept: 'moj', boss: 'moj-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/minister-of-state--ministry-of-justice--2' },
  { id: 'moj-victims', name: 'Parliamentary Under-Secretary (Victims)', holder: 'Alex Davies-Jones', dept: 'moj', boss: 'moj-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/parliamentary-under-secretary-of-state--ministry-of-justice' },
  { id: 'moj-sentencing', name: 'Parliamentary Under-Secretary (Sentencing)', holder: 'Jake Richards', dept: 'moj', boss: 'moj-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/parliamentary-under-secretary-of-state--ministry-of-justice--2' },

  // MHCLG (dluhc)
  { id: 'dluhc-housing', name: 'Minister of State (Housing and Planning)', holder: 'Matthew Pennycook', dept: 'dluhc', boss: 'dluhc-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/minister-of-state--55' },
  { id: 'dluhc-local-gov', name: 'Minister of State (Local Government)', holder: 'Alison McGovern', dept: 'dluhc', boss: 'dluhc-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/minister-of-state--56' },
  { id: 'dluhc-devolution', name: 'Parliamentary Under-Secretary (Devolution)', holder: 'Miatta Fahnbulleh', dept: 'dluhc', boss: 'dluhc-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/parliamentary-under-secretary-of-state--ministry-of-housing-communities-and-local-government' },
  { id: 'dluhc-building-safety', name: 'Parliamentary Under-Secretary (Building Safety)', holder: 'Samantha Dixon', dept: 'dluhc', boss: 'dluhc-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/parliamentary-under-secretary-of-state--ministry-of-housing-communities-and-local-government--2' },

  // DHSC
  { id: 'dhsc-secondary-care', name: 'Minister of State (Secondary Care)', holder: 'Karin Smyth', dept: 'dhsc', boss: 'dhsc-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/minister-of-state--department-of-health-and-social-care' },
  { id: 'dhsc-care', name: 'Minister of State (Care)', holder: 'Stephen Kinnock', dept: 'dhsc', boss: 'dhsc-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/minister-of-state--department-of-health-and-social-care--2' },
  { id: 'dhsc-womens-health', name: "Parliamentary Under-Secretary (Women's Health)", holder: 'Baroness Merron', dept: 'dhsc', boss: 'dhsc-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/parliamentary-under-secretary-of-state--department-of-health-and-social-care' },
  { id: 'dhsc-innovation', name: 'Parliamentary Under-Secretary (Health Innovation)', holder: 'Dr Zubir Ahmed', dept: 'dhsc', boss: 'dhsc-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/parliamentary-under-secretary-of-state--department-of-health-and-social-care--2' },
  { id: 'dhsc-pus', name: 'Parliamentary Under-Secretary of State', holder: 'Sharon Hodgson', dept: 'dhsc', boss: 'dhsc-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/parliamentary-under-secretary-of-state--department-of-health-and-social-care--3' },

  // DfE
  { id: 'dfe-schools', name: 'Minister of State (School Standards)', holder: 'Georgia Gould', dept: 'dfe', boss: 'dfe-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/minister-of-state--department-for-education' },
  { id: 'dfe-skills', name: 'Minister of State (Skills and Equalities)', holder: 'Baroness Smith of Malvern', dept: 'dfe', boss: 'dfe-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/minister-of-state--department-for-education--2' },
  { id: 'dfe-disability', name: 'Minister of State (Social Security and Disability)', holder: 'Sir Stephen Timms', dept: 'dfe', boss: 'dfe-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/minister-of-state--department-for-education--3' },
  { id: 'dfe-early-ed', name: 'Parliamentary Under-Secretary (Early Education)', holder: 'Olivia Bailey', dept: 'dfe', boss: 'dfe-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/parliamentary-under-secretary-of-state--department-for-education' },
  { id: 'dfe-children', name: 'Parliamentary Under-Secretary (Children and Families)', holder: 'Josh MacAlister', dept: 'dfe', boss: 'dfe-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/parliamentary-under-secretary-of-state--department-for-education--2' },

  // DESNZ
  { id: 'desnz-energy', name: 'Minister of State (Energy)', holder: 'Michael Shanks', dept: 'desnz', boss: 'desnz-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/minister-of-state--department-for-energy-security-and-net-zero' },
  { id: 'desnz-climate', name: 'Parliamentary Under-Secretary (Climate)', holder: 'Katie White', dept: 'desnz', boss: 'desnz-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/parliamentary-under-secretary-of-state--department-for-energy-security-and-net-zero' },
  { id: 'desnz-consumers', name: 'Parliamentary Under-Secretary (Energy Consumers)', holder: 'Martin McCluskey', dept: 'desnz', boss: 'desnz-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/parliamentary-under-secretary-of-state--department-for-energy-security-and-net-zero--2' },
  { id: 'desnz-industry', name: 'Parliamentary Under-Secretary (Industry)', holder: 'Chris McDonald', dept: 'desnz', boss: 'desnz-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/parliamentary-under-secretary-of-state--department-for-energy-security-and-net-zero--3' },

  // DWP
  { id: 'dwp-employment', name: 'Minister of State (Employment)', holder: 'Dame Diana Johnson', dept: 'dwp', boss: 'wpc-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/minister-of-state--department-for-work-and-pensions' },
  { id: 'dwp-transformation', name: 'Parliamentary Under-Secretary (Transformation)', holder: 'Andrew Western', dept: 'dwp', boss: 'wpc-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/parliamentary-under-secretary-of-state--department-for-work-and-pensions' },
  { id: 'dwp-pensions', name: 'Parliamentary Under-Secretary (Pensions)', holder: 'Torsten Bell', dept: 'dwp', boss: 'wpc-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/parliamentary-under-secretary-of-state--department-for-work-and-pensions--2' },

  // DBT
  { id: 'dbt-trade', name: 'Minister of State (Trade)', holder: 'Sir Chris Bryant', dept: 'dbt', boss: 'dbt-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/minister-of-state--department-for-business-and-trade' },
  { id: 'dbt-small-biz', name: 'Parliamentary Under-Secretary (Small Business)', holder: 'Blair McDougall', dept: 'dbt', boss: 'dbt-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/parliamentary-under-secretary-of-state--department-for-business-and-trade' },
  { id: 'dbt-employment-rights', name: 'Parliamentary Under-Secretary (Employment Rights)', holder: 'Kate Dearden', dept: 'dbt', boss: 'dbt-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/parliamentary-under-secretary-of-state--department-for-business-and-trade--2' },
  { id: 'dbt-industry', name: 'Parliamentary Under-Secretary (Industry)', holder: 'Chris McDonald', dept: 'dbt', boss: 'dbt-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/parliamentary-under-secretary-of-state--department-for-business-and-trade--3' },

  // DSIT
  { id: 'dsit-digital-gov', name: 'Minister of State (Digital Government)', holder: 'Ian Murray', dept: 'dsit', boss: 'science-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/minister-of-state--department-for-science-innovation-and-technology' },
  { id: 'dsit-ai', name: 'Parliamentary Under-Secretary (AI and Online Safety)', holder: 'Kanishka Narayan', dept: 'dsit', boss: 'science-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/parliamentary-under-secretary-of-state--department-for-science-innovation-and-technology' },

  // DfT
  { id: 'dft-rail', name: 'Minister of State (Rail)', holder: 'Lord Hendy of Richmond Hill', dept: 'dft', boss: 'transport-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/minister-of-state--department-for-transport' },
  { id: 'dft-roads', name: 'Parliamentary Under-Secretary (Roads and Buses)', holder: 'Simon Lightwood', dept: 'dft', boss: 'transport-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/parliamentary-under-secretary-of-state--department-for-transport' },
  { id: 'dft-local-transport', name: 'Parliamentary Under-Secretary (Local Transport)', holder: 'Lilian Greenwood', dept: 'dft', boss: 'transport-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/parliamentary-under-secretary-of-state--department-for-transport--2' },
  { id: 'dft-aviation', name: 'Parliamentary Under-Secretary (Aviation)', holder: 'Keir Mather', dept: 'dft', boss: 'transport-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/parliamentary-under-secretary-of-state--department-for-transport--3' },

  // DEFRA
  { id: 'defra-food', name: 'Minister of State (Food Security)', holder: 'Dame Angela Eagle', dept: 'defra', boss: 'defra-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/minister-of-state--department-for-environment-food-and-rural-affairs' },
  { id: 'defra-water', name: 'Parliamentary Under-Secretary (Water)', holder: 'Emma Hardy', dept: 'defra', boss: 'defra-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/parliamentary-under-secretary-of-state--department-for-environment-food-and-rural-affairs' },
  { id: 'defra-nature', name: 'Parliamentary Under-Secretary (Nature)', holder: 'Mary Creagh', dept: 'defra', boss: 'defra-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/parliamentary-under-secretary-of-state--department-for-environment-food-and-rural-affairs--2' },
  { id: 'defra-biosecurity', name: 'Parliamentary Under-Secretary (Biosecurity)', holder: 'Baroness Hayman of Ullock', dept: 'defra', boss: 'defra-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/parliamentary-under-secretary-of-state--department-for-environment-food-and-rural-affairs--3' },

  // DCMS
  { id: 'dcms-creative', name: 'Minister of State (Creative Industries)', holder: 'Ian Murray', dept: 'dcms', boss: 'dcms-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/minister-of-state--department-for-culture-media-and-sport' },
  { id: 'dcms-sport', name: 'Parliamentary Under-Secretary (Sport and Tourism)', holder: 'Stephanie Peacock', dept: 'dcms', boss: 'dcms-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/parliamentary-under-secretary-of-state--department-for-culture-media-and-sport' },
  { id: 'dcms-museums', name: 'Parliamentary Under-Secretary (Museums and Heritage)', holder: 'Baroness Twycross', dept: 'dcms', boss: 'dcms-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/parliamentary-under-secretary-of-state--department-for-culture-media-and-sport--2' },

  // NI Office
  { id: 'ni-pus', name: 'Parliamentary Under-Secretary (Northern Ireland)', holder: 'Matthew Patrick', dept: 'ni-office', boss: 'ni-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/parliamentary-under-secretary-of-state--northern-ireland-office' },

  // Scotland Office
  { id: 'scotland-pus', name: 'Parliamentary Under-Secretary (Scotland)', holder: 'Kirsty McNeill', dept: 'scotland-office', boss: 'scotland-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/parliamentary-under-secretary-of-state--scotland-office' },

  // Wales Office
  { id: 'wales-pus-1', name: 'Parliamentary Under-Secretary (Wales)', holder: 'Anna McMorrin', dept: 'wales-office', boss: 'wales-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/parliamentary-under-secretary-of-state--wales-office' },
  { id: 'wales-pus-2', name: 'Parliamentary Under-Secretary (Wales)', holder: 'Claire Hughes', dept: 'wales-office', boss: 'wales-sec', cabinet: false, url: 'https://www.gov.uk/government/ministers/parliamentary-under-secretary-of-state--wales-office--2' },

  // AGO
  { id: 'solicitor-gen', name: 'Solicitor General', holder: 'Ellie Reeves', dept: 'ago', boss: 'attorney-gen', cabinet: false, url: 'https://www.gov.uk/government/ministers/solicitor-general' },

  // Cabinet Office - ministers who attend cabinet (junior-minister subtype, cabinet group)
  { id: 'co-paymaster', name: 'Paymaster General', holder: 'Nick Thomas-Symonds', dept: 'co', boss: 'cabinet-office-sec', cabinet: true, url: 'https://www.gov.uk/government/ministers/paymaster-general' },
  { id: 'co-minister-state', name: 'Minister of State (Cabinet Office)', holder: 'Dan Jarvis', dept: 'co', boss: 'cabinet-office-sec', cabinet: true, url: 'https://www.gov.uk/government/ministers/minister-of-state--cabinet-office' },
  { id: 'co-minister-without-portfolio', name: 'Minister without Portfolio', holder: 'Anna Turley', dept: 'co', boss: 'cabinet-office-sec', cabinet: true, url: 'https://www.gov.uk/government/ministers/minister-without-portfolio' },
]

// Generate entries text
let newEntries = '\n\n  // ── OFFICIALS: Junior Ministers ───────────────────────────────────────────\n'
for (const m of juniorMinisters) {
  const cabinetParent = m.cabinet ? `, 'cabinet'` : ''
  newEntries += `  '${m.id}': {
    id: '${m.id}',
    name: '${m.name}',
    category: 'official',
    subtype: 'junior-minister',
    description: '${m.name} in the ${m.dept.toUpperCase()} department.',
    currentHolder: '${m.holder}',
    infoUrl: '${m.url}',
    parentIds: ['pm', '${m.boss}'${cabinetParent}],
    childIds: ['${m.dept}'],
  },\n`
}

// ── 3. Insert junior ministers before the Civil Servants section ──────────────
src = src.replace(
  /\n\n  \/\/ ── OFFICIALS: Civil Servants/,
  newEntries + '\n\n  // ── OFFICIALS: Civil Servants'
)

// ── 4. Update PM childIds to include junior ministers + cabinet-attending ones ─
// Remove old childIds line and replace
const juniorIds = juniorMinisters.map(m => `'${m.id}'`).join(', ')
const allPmChildren = `['chancellor', 'fcdo-sec', 'moj-sec', 'defra-sec', 'dluhc-sec', 'wpc-sec', 'dfe-sec', 'dhsc-sec', 'desnz-sec', 'dcms-sec', 'dbt-sec', 'cabinet-office-sec', 'scotland-sec', 'wales-sec', 'ni-sec', 'home-sec', 'defence-sec', 'transport-sec', 'science-sec', 'attorney-gen', 'pm-office', ${juniorIds}]`
src = src.replace(
  /('pm': \{[\s\S]*?childIds: )\[[^\]]*\]/,
  `$1${allPmChildren}`
)

// ── 5. Update cabinet childIds to include cabinet-attending junior ministers ──
const cabinetAttending = juniorMinisters.filter(m => m.cabinet).map(m => `'${m.id}'`).join(', ')
src = src.replace(
  /('cabinet': \{[\s\S]*?childIds: )\[[^\]]*\]/,
  `$1['pm', 'chancellor', 'fcdo-sec', 'moj-sec', 'defra-sec', 'dluhc-sec', 'wpc-sec', 'dfe-sec', 'dhsc-sec', 'desnz-sec', 'dcms-sec', 'dbt-sec', 'cabinet-office-sec', 'scotland-sec', 'wales-sec', 'ni-sec', 'home-sec', 'defence-sec', 'transport-sec', 'science-sec', ${cabinetAttending}]`
)

// ── 6. Update each cabinet minister's childIds to include their junior ministers
for (const m of juniorMinisters) {
  if (m.boss === 'pm') continue // pm already handled
  // Find the boss entry and add junior minister to childIds
  const bossRe = new RegExp(`('${m.boss}': \\{[\\s\\S]*?childIds: \\[)([^\\]]*)\\]`)
  src = src.replace(bossRe, (match, prefix, existing) => {
    const ids = existing.split(',').map(s => s.trim()).filter(Boolean)
    if (!ids.includes(`'${m.id}'`)) ids.push(`'${m.id}'`)
    return `${prefix}${ids.join(', ')}]`
  })
}

writeFileSync(filePath, src, 'utf8')
console.log('Done. Junior ministers added:', juniorMinisters.length)
