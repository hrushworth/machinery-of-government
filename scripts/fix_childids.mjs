import { readFileSync, writeFileSync } from 'fs'

const filePath = 'C:/Users/harry/OneDrive/Desktop/UK_Gov_Org_Chart/src/data/elements.ts'
let src = readFileSync(filePath, 'utf8')

// The script that added junior ministers accidentally set ALL cabinet minister
// childIds to the full PM children list. We need to restore them to the correct
// values (their own dept + their junior ministers).

const cabinetMinisters = {
  'chancellor':       { dept: 'treasury',        juniors: ['treasury-chief-sec', 'treasury-fin-sec', 'treasury-exchequer-sec', 'treasury-econ-sec'] },
  'fcdo-sec':         { dept: 'fcdo',             juniors: ['fcdo-intl-dev', 'fcdo-europe', 'fcdo-middle-east', 'fcdo-indo-pacific', 'fcdo-multilateral'] },
  'moj-sec':          { dept: 'moj',              juniors: ['moj-prisons', 'moj-courts', 'moj-victims', 'moj-sentencing'] },
  'defra-sec':        { dept: 'defra',            juniors: ['defra-food', 'defra-water', 'defra-nature', 'defra-biosecurity'] },
  'dluhc-sec':        { dept: 'dluhc',            juniors: ['dluhc-housing', 'dluhc-local-gov', 'dluhc-devolution', 'dluhc-building-safety'] },
  'wpc-sec':          { dept: 'dwp',              juniors: ['dwp-employment', 'dwp-transformation', 'dwp-pensions'] },
  'dfe-sec':          { dept: 'dfe',              juniors: ['dfe-schools', 'dfe-skills', 'dfe-disability', 'dfe-early-ed', 'dfe-children'] },
  'dhsc-sec':         { dept: 'dhsc',             juniors: ['dhsc-secondary-care', 'dhsc-care', 'dhsc-womens-health', 'dhsc-innovation', 'dhsc-pus'] },
  'desnz-sec':        { dept: 'desnz',            juniors: ['desnz-energy', 'desnz-climate', 'desnz-consumers', 'desnz-industry'] },
  'dcms-sec':         { dept: 'dcms',             juniors: ['dcms-creative', 'dcms-sport', 'dcms-museums'] },
  'dbt-sec':          { dept: 'dbt',              juniors: ['dbt-trade', 'dbt-small-biz', 'dbt-employment-rights', 'dbt-industry'] },
  'cabinet-office-sec': { dept: 'co',             juniors: ['co-paymaster', 'co-minister-state', 'co-minister-without-portfolio'] },
  'scotland-sec':     { dept: 'scotland-office',  juniors: ['scotland-pus'] },
  'wales-sec':        { dept: 'wales-office',     juniors: ['wales-pus-1', 'wales-pus-2'] },
  'ni-sec':           { dept: 'ni-office',        juniors: ['ni-pus'] },
  'home-sec':         { dept: 'home-office',      juniors: ['home-security', 'home-policing', 'home-border', 'home-safeguarding', 'home-migration'] },
  'defence-sec':      { dept: 'mod',              juniors: ['mod-readiness', 'mod-armed-forces', 'mod-veterans'] },
  'transport-sec':    { dept: 'dft',              juniors: ['dft-rail', 'dft-roads', 'dft-local-transport', 'dft-aviation'] },
  'science-sec':      { dept: 'dsit',             juniors: ['dsit-digital-gov', 'dsit-ai'] },
  'attorney-gen':     { dept: 'ago',              juniors: ['solicitor-gen'] },
}

// Split into individual element blocks and fix each one
// Strategy: for each entry id, find the childIds line within just that block
// We identify blocks by finding the entry key line and the closing '  },' or '  }\n'

for (const [id, { dept, juniors }] of Object.entries(cabinetMinisters)) {
  const correctChildIds = `['${dept}', ${juniors.map(j => `'${j}'`).join(', ')}]`

  // Match the specific block for this id: from "  'id': {" up to the closing "},"
  // Use a non-greedy match confined to one block
  const blockRe = new RegExp(
    `(  '${id}': \\{(?:(?!  '[a-z])[\s\S])*?    childIds: )\\[[^\\]]*\\]`,
    ''
  )

  const before = src
  src = src.replace(blockRe, `$1${correctChildIds}`)
  if (src === before) {
    console.warn(`WARNING: no match for ${id}`)
  }
}

// Also fix the PM entry - should have cabinet ministers + junior ministers but NOT pm-office's dept
// The PM childIds should be: cabinet ministers + pm-office + all junior minister IDs
// But NOT the junior ministers appearing as if they are already there (the old script put them)
// Check current PM childIds:
const pmMatch = src.match(/'pm': \{[\s\S]*?childIds: (\[[^\]]*\])/)
console.log('PM childIds (first 200 chars):', pmMatch?.[1]?.slice(0, 200))

writeFileSync(filePath, src, 'utf8')
console.log('Fixed cabinet minister childIds')
