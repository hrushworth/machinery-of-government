import { readFileSync, writeFileSync } from 'fs'

const filePath = new URL('../src/data/elements.ts', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')
let content = readFileSync(filePath, 'utf8')

// Deduplicate items in childIds arrays
// Pattern: childIds: ['a', 'b', 'a', 'c'] -> childIds: ['a', 'b', 'c']
let fixCount = 0

content = content.replace(/childIds: \[([^\]]*)\]/g, (match, inner) => {
  if (!inner.trim()) return match
  const items = inner.match(/'[^']*'/g)
  if (!items) return match
  const unique = [...new Set(items)]
  if (unique.length === items.length) return match
  fixCount++
  return `childIds: [${unique.join(', ')}]`
})

writeFileSync(filePath, content, 'utf8')
console.log(`Deduplicated ${fixCount} childIds arrays`)
