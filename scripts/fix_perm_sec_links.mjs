import { readFileSync, writeFileSync } from 'fs'

const filePath = 'C:/Users/harry/OneDrive/Desktop/UK_Gov_Org_Chart/src/data/elements.ts'
let src = readFileSync(filePath, 'utf8')

// Add each perm sec to their dept's parentIds, and set perm sec parentIds to their dept
// Also fix solicitor-gen: should not lead ago, should have ago as dept (it appears as
// a child of attorney-gen who leads ago)

// Map: deptId -> permSecId(s) to add to parentIds
const deptToPermSec = {
  'co':          ['co-perm-sec', 'home-perm-sec'],  // both Catherine Little and Romeo (Cabinet Sec)
  'dbt':         ['dbt-perm-sec'],
  'defra':       ['defra-perm-sec'],
  'dcms':        ['dcms-perm-sec'],
  'desnz':       ['desnz-perm-sec'],
  'dfe':         ['dfe-perm-sec'],
  'dft':         ['dft-perm-sec'],
  'dhsc':        ['dhsc-perm-sec'],
  'dsit':        ['dsit-perm-sec'],
  'dwp':         ['dwp-perm-sec'],
  'fcdo':        ['fcdo-perm-sec'],
  'home-office': ['home-perm-sec'],
  'dluhc':       ['dluhc-perm-sec'],
  'mod':         ['mod-perm-sec'],
  'moj':         ['moj-perm-sec'],
  'ni-office':   ['ni-perm-sec'],
  'treasury':    ['treasury-perm-sec'],
}

// Process line by line
const lines = src.split('\n')
let currentBlock = null

const fixed = lines.map(line => {
  const blockStart = line.match(/^  '([^']+)':\s*\{/)
  if (blockStart) currentBlock = blockStart[1]
  if (line.match(/^  \},?\r?$/) && !line.includes("'")) currentBlock = null

  // Add perm sec to dept parentIds
  if (currentBlock && deptToPermSec[currentBlock]) {
    const parentMatch = line.match(/^(\s+parentIds: \[)([^\]]*)(\]\s*,?\r?)$/)
    if (parentMatch) {
      const existing = parentMatch[2].split(',').map(s => s.trim()).filter(Boolean)
      for (const ps of deptToPermSec[currentBlock]) {
        if (!existing.includes(`'${ps}'`)) existing.push(`'${ps}'`)
      }
      return `${parentMatch[1]}${existing.join(', ')}${parentMatch[3]}`
    }
  }

  // Fix perm sec parentIds: add their primary dept
  // (perm secs currently have parentIds: [])
  // We map permSecId -> their primary dept
  const permSecDept = {
    'co-perm-sec': 'co',
    'dbt-perm-sec': 'dbt',
    'defra-perm-sec': 'defra',
    'dcms-perm-sec': 'dcms',
    'desnz-perm-sec': 'desnz',
    'dfe-perm-sec': 'dfe',
    'dft-perm-sec': 'dft',
    'dhsc-perm-sec': 'dhsc',
    'dsit-perm-sec': 'dsit',
    'dwp-perm-sec': 'dwp',
    'fcdo-perm-sec': 'fcdo',
    'home-perm-sec': 'home-office',
    'dluhc-perm-sec': 'dluhc',
    'mod-perm-sec': 'mod',
    'moj-perm-sec': 'moj',
    'ni-perm-sec': 'ni-office',
    'treasury-perm-sec': 'treasury',
  }

  if (currentBlock && permSecDept[currentBlock]) {
    const parentMatch = line.match(/^(\s+parentIds: \[)([^\]]*)(\]\s*,?\r?)$/)
    if (parentMatch) {
      const existing = parentMatch[2].split(',').map(s => s.trim()).filter(Boolean)
      const deptId = `'${permSecDept[currentBlock]}'`
      if (!existing.includes(deptId)) existing.push(deptId)
      return `${parentMatch[1]}${existing.join(', ')}${parentMatch[3]}`
    }
  }

  // Fix solicitor-gen: childIds should be [] not ['ago']
  if (currentBlock === 'solicitor-gen') {
    const childMatch = line.match(/^(\s+childIds: )\[[^\]]*\](\s*,?\r?)$/)
    if (childMatch) {
      return `${childMatch[1]}[]${childMatch[2]}`
    }
  }

  return line
})

writeFileSync(filePath, fixed.join('\n'), 'utf8')
console.log('Fixed perm sec links and solicitor-gen')

// Verify
const result = readFileSync(filePath, 'utf8')
const lines2 = result.split('\n')
let cur = null
const checks = ['co', 'home-office', 'treasury', 'co-perm-sec', 'home-perm-sec', 'treasury-perm-sec', 'solicitor-gen']
lines2.forEach(line => {
  const m = line.match(/^  '([^']+)':\s*\{/)
  if (m) cur = m[1]
  if (cur && checks.includes(cur) && (line.includes('parentIds:') || line.includes('childIds:'))) {
    console.log(cur, '|', line.trim().replace(/\r/,'').slice(0,100))
  }
})
