import { readFileSync, writeFileSync } from 'fs'

const filePath = 'C:/Users/harry/OneDrive/Desktop/UK_Gov_Org_Chart/src/data/elements.ts'
let src = readFileSync(filePath, 'utf8')

// Perm secs currently have parentIds: ['dept'] AND childIds: ['dept']
// This creates a bidirectional cycle that breaks pathfinding.
// Perm secs lead depts, so they should be parents (childIds: ['dept'], parentIds: [])
// matching the pattern of non-ministerial dept heads (e.g. hmrc-ceo has childIds:['hmrc'], parentIds:[])

const permSecIds = [
  'co-perm-sec', 'dbt-perm-sec', 'defra-perm-sec', 'dcms-perm-sec',
  'desnz-perm-sec', 'dfe-perm-sec', 'dft-perm-sec', 'dhsc-perm-sec',
  'dsit-perm-sec', 'dwp-perm-sec', 'fcdo-perm-sec', 'home-perm-sec',
  'dluhc-perm-sec', 'mod-perm-sec', 'moj-perm-sec', 'ni-perm-sec',
  'treasury-perm-sec',
]

const lines = src.split('\n')
let currentBlock = null

const fixed = lines.map(line => {
  const blockStart = line.match(/^  '([^']+)':\s*\{/)
  if (blockStart) currentBlock = blockStart[1]
  if (line.match(/^  \},?\r?$/) && !line.includes("'")) currentBlock = null

  // Clear parentIds for all perm secs (they are parents, not children)
  if (currentBlock && permSecIds.includes(currentBlock)) {
    const parentMatch = line.match(/^(\s+parentIds: )\[[^\]]*\](\s*,?\r?)$/)
    if (parentMatch) {
      return `${parentMatch[1]}[]${parentMatch[2]}`
    }
  }

  return line
})

writeFileSync(filePath, fixed.join('\n'), 'utf8')
console.log('Cleared perm sec parentIds')

// Verify
const result = readFileSync(filePath, 'utf8')
const lines2 = result.split('\n')
let cur = null
permSecIds.slice(0, 4).forEach(id => {
  lines2.forEach(line => {
    const m = line.match(/^  '([^']+)':\s*\{/)
    if (m) cur = m[1]
    if (cur === id && line.includes('parentIds:')) {
      console.log(id, '|', line.trim().replace(/\r/, ''))
    }
  })
})
