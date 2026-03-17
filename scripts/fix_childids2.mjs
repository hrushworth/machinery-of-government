import { readFileSync, writeFileSync } from 'fs'

const filePath = 'C:/Users/harry/OneDrive/Desktop/UK_Gov_Org_Chart/src/data/elements.ts'
const src = readFileSync(filePath, 'utf8')

// The previous script set all cabinet minister childIds to the PM's full children list.
// We process line by line, tracking which element block we're in, and fix childIds.

const cabinetMinisters = {
  'chancellor':         ['treasury', 'treasury-chief-sec', 'treasury-fin-sec', 'treasury-exchequer-sec', 'treasury-econ-sec'],
  'fcdo-sec':           ['fcdo', 'fcdo-intl-dev', 'fcdo-europe', 'fcdo-middle-east', 'fcdo-indo-pacific', 'fcdo-multilateral'],
  'moj-sec':            ['moj', 'moj-prisons', 'moj-courts', 'moj-victims', 'moj-sentencing'],
  'defra-sec':          ['defra', 'defra-food', 'defra-water', 'defra-nature', 'defra-biosecurity'],
  'dluhc-sec':          ['dluhc', 'dluhc-housing', 'dluhc-local-gov', 'dluhc-devolution', 'dluhc-building-safety'],
  'wpc-sec':            ['dwp', 'dwp-employment', 'dwp-transformation', 'dwp-pensions'],
  'dfe-sec':            ['dfe', 'dfe-schools', 'dfe-skills', 'dfe-disability', 'dfe-early-ed', 'dfe-children'],
  'dhsc-sec':           ['dhsc', 'dhsc-secondary-care', 'dhsc-care', 'dhsc-womens-health', 'dhsc-innovation', 'dhsc-pus'],
  'desnz-sec':          ['desnz', 'desnz-energy', 'desnz-climate', 'desnz-consumers', 'desnz-industry'],
  'dcms-sec':           ['dcms', 'dcms-creative', 'dcms-sport', 'dcms-museums'],
  'dbt-sec':            ['dbt', 'dbt-trade', 'dbt-small-biz', 'dbt-employment-rights', 'dbt-industry'],
  'cabinet-office-sec': ['co', 'co-paymaster', 'co-minister-state', 'co-minister-without-portfolio'],
  'scotland-sec':       ['scotland-office', 'scotland-pus'],
  'wales-sec':          ['wales-office', 'wales-pus-1', 'wales-pus-2'],
  'ni-sec':             ['ni-office', 'ni-pus'],
  'home-sec':           ['home-office', 'home-security', 'home-policing', 'home-border', 'home-safeguarding', 'home-migration'],
  'defence-sec':        ['mod', 'mod-readiness', 'mod-armed-forces', 'mod-veterans'],
  'transport-sec':      ['dft', 'dft-rail', 'dft-roads', 'dft-local-transport', 'dft-aviation'],
  'science-sec':        ['dsit', 'dsit-digital-gov', 'dsit-ai'],
  'attorney-gen':       ['ago', 'solicitor-gen'],
}

const lines = src.split('\n')
let currentBlock = null

const fixed = lines.map(line => {
  // Detect block start: "  'some-id': {"
  const blockStart = line.match(/^  '([^']+)':\s*\{/)
  if (blockStart) currentBlock = blockStart[1]

  // Detect block end
  if (line.match(/^  \},?\s*$/) || line.match(/^  \}$/)) {
    currentBlock = null
  }

  // Fix childIds only for cabinet minister blocks
  if (currentBlock && cabinetMinisters[currentBlock]) {
    const childMatch = line.match(/^(\s+childIds: )\[.*\](,?\s*)$/)
    if (childMatch) {
      const ids = cabinetMinisters[currentBlock].map(id => `'${id}'`).join(', ')
      return `${childMatch[1]}[${ids}]${childMatch[2]}`
    }
  }

  return line
})

writeFileSync(filePath, fixed.join('\n'), 'utf8')
console.log('Done fixing cabinet minister childIds')

// Verify
const result = readFileSync(filePath, 'utf8')
const chancellorMatch = result.match(/'chancellor': \{[\s\S]{0,300}?childIds: (\[[^\]]*\])/)
console.log('chancellor childIds:', chancellorMatch?.[1])
